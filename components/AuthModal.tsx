"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Compass, Phone, ShieldCheck, X } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "./Providers";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const verifier = useRef<RecaptchaVerifier | null>(null);
  const confirmation = useRef<ConfirmationResult | null>(null);
  const generation = useRef(0);
  const [step, setStep] = useState<"choose" | "phone" | "otp" | "success">("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const { setDemoProfile } = useAuth();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      generation.current += 1;
      element?.close();
      document.body.style.overflow = previousOverflow;
      verifier.current?.clear();
      verifier.current = null;
    };
  }, [open]);

  function close() {
    generation.current += 1;
    setStep("choose"); setError(""); setBusy(false); setPhone(""); setOtp("");
    confirmation.current = null;
    onClose();
  }
  async function run(action: () => Promise<void>) {
    const current = generation.current;
    setBusy(true); setError("");
    try { await action(); } catch (err) {
      if (current === generation.current) {
        const code = (err as { code?: string }).code;
        const messages: Record<string, string> = {
          "auth/popup-closed-by-user": "Sign-in was cancelled. You can try again.",
          "auth/invalid-verification-code": "That code is incorrect. Please check it and try again.",
          "auth/code-expired": "Your code expired. Request a new one.",
          "auth/too-many-requests": "Too many attempts. Please wait before trying again.",
          "auth/invalid-phone-number": "Enter a valid phone number with country code, for example +919876543210.",
          "auth/unauthorized-domain": "This domain needs to be added to Firebase authorized domains.",
          "auth/operation-not-allowed": "Enable this sign-in provider in Firebase Authentication.",
        };
        setError(code ? messages[code] || "Sign-in could not be completed. Check your connection and Firebase settings, then try again." : (err as Error).message);
      }
    } finally { if (current === generation.current) setBusy(false); }
  }
  function sendOtp(event?: FormEvent) {
    event?.preventDefault();
    const normalized = phone.replace(/[\s()-]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(normalized)) { setError("Include your country code, for example +919876543210."); return; }
    if (Date.now() < resendAt) { setError("Please wait 30 seconds between code requests."); return; }
    const current = generation.current;
    void run(async () => {
      if (firebaseConfigured) {
        verifier.current?.clear();
        verifier.current = new RecaptchaVerifier(getFirebaseAuth(), "recaptcha-container", { size: "invisible" });
        const result = await signInWithPhoneNumber(getFirebaseAuth(), normalized, verifier.current);
        if (current !== generation.current) return;
        confirmation.current = result;
      }
      if (current === generation.current) { setPhone(normalized); setResendAt(Date.now() + 30_000); setStep("otp"); }
    });
  }
  function verify(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setError("Enter the full 6-digit code."); return; }
    const current = generation.current;
    void run(async () => {
      if (firebaseConfigured) {
        if (!confirmation.current) throw new Error("Request a new code to continue.");
        await confirmation.current.confirm(otp);
      } else {
        if (otp !== "123456") throw new Error("Use 123456 for this demo. No SMS was sent.");
        setDemoProfile();
      }
      if (current === generation.current) setStep("success");
    });
  }

  return <dialog ref={dialog} aria-labelledby="auth-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); } }} className="w-[calc(100%-32px)] max-w-[440px] rounded-3xl border border-white bg-white p-0 text-slate-800 shadow-2xl">
    <div className="relative p-7 sm:p-9"><button onClick={close} aria-label="Close sign in" className="absolute top-5 right-5 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={17} /></button><div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white"><Compass size={30} /></div>
      <AnimatePresence mode="wait"><m.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
        <h2 id="auth-title" className="text-2xl font-semibold tracking-tight">{step === "choose" ? "Your next chapter starts here." : step === "phone" ? "Let’s get you signed in." : step === "otp" ? "Check your messages." : "You’re all set."}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{step === "choose" ? "Welcome to Exam Intel. A little closer to your dream college." : step === "phone" ? "Enter your phone number with its country code." : step === "otp" ? (firebaseConfigured ? `Enter the 6-digit code sent to ${phone}.` : "Demo mode: no SMS was sent. Enter 123456 to continue.") : firebaseConfigured ? "You’re signed in. Your next chapter is waiting." : "Demo sign-in complete. This session stays in memory and resets on refresh."}</p>
        {!firebaseConfigured && step !== "success" && <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">Demo authentication · Firebase is not configured.</p>}
        {step === "choose" && <div className="mt-7"><button onClick={() => { setStep("phone"); setError(""); }} disabled={busy} className="primary-button w-full"><Phone size={17} />Continue with Phone Number</button></div>}
        {step === "phone" && <form onSubmit={sendOtp} className="mt-6 space-y-4"><label className="block text-xs font-semibold" htmlFor="phone-number">Phone number</label><input autoFocus id="phone-number" type="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" className="field" /><p className="text-xs leading-5 text-slate-500">{firebaseConfigured ? "Firebase uses your phone number for authentication and abuse prevention. Standard SMS rates may apply." : "Use any valid phone format. Demo mode does not send or store your number."}</p><button disabled={busy} className="primary-button w-full">{busy ? "Sending code…" : "Send OTP"}<ArrowRight size={16} /></button></form>}
        {step === "otp" && <form onSubmit={verify} className="mt-6 space-y-4"><label htmlFor="otp-code" className="block text-xs font-semibold">6-digit verification code</label><input autoFocus id="otp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" className="field text-center text-xl tracking-[.6em]" /><button disabled={busy} className="primary-button w-full">{busy ? "Verifying…" : "Verify & continue"}<ArrowRight size={16} /></button><button type="button" disabled={busy} onClick={() => sendOtp()} className="w-full py-1 text-xs font-medium text-indigo-600">Resend code</button></form>}
        {step === "success" && <button onClick={close} className="primary-button mt-6 w-full"><Check size={17} />Continue exploring</button>}
      </m.div></AnimatePresence>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
      {(step === "phone" || step === "otp") && <button disabled={busy} onClick={() => { setStep(step === "otp" ? "phone" : "choose"); setError(""); setOtp(""); }} className="mt-5 flex items-center gap-1.5 text-xs text-slate-500"><ArrowLeft size={14} />Back</button>}
      <div id="recaptcha-container" />
      <div className="mt-7 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-5 text-[11px] text-slate-500"><ShieldCheck size={14} className="text-teal-600" />{firebaseConfigured ? "Secure sign-in with Firebase" : "Explore the predictor without signing in"}</div>
    </div>
  </dialog>;
}
