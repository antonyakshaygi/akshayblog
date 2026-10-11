import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/blogData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPasscode: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPasscode,
}) => {
  const [email, setEmail] = useState('antonyakshay7@gmail.com');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let timer: any;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Validate owner identity:
      // Verified owner email must match Antony Akshay's email or account
      const normalizedEmail = email.trim().toLowerCase();
      const validOwnerEmails = [
        AUTHOR_PROFILE.email.toLowerCase(),
        'antonyakshay7@gmail.com',
        'akshay@sapiexa.com',
      ];

      const isEmailValid = validOwnerEmails.includes(normalizedEmail);

      // Validate passcode against current stored passcode:
      // Absolutely NO public default passcode exposed or universal bypass.
      const isPasscodeValid = passcode.trim() === correctPasscode.trim();

      if (isEmailValid && isPasscodeValid) {
        // Successful authentication
        try {
          sessionStorage.setItem('akshay_admin_session', 'true');
          sessionStorage.setItem('akshay_admin_timestamp', Date.now().toString());
          sessionStorage.setItem('akshay_admin_email', normalizedEmail);
        } catch {}
        setFailedAttempts(0);
        setPasscode('');
        onSuccess();
        onClose();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutTimer(60);
          setErrorMsg('Too many invalid attempts. Security lockdown active for 60 seconds.');
        } else if (!isEmailValid) {
          setErrorMsg('Unauthorized email. Access is strictly restricted to Antony Akshay.');
        } else {
          setErrorMsg(`Invalid owner secret key. ${5 - nextAttempts} attempt(s) remaining before security lockout.`);
        }
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 border border-stone-200 dark:border-stone-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-editorial font-bold text-stone-900 dark:text-stone-100">
                Owner Authentication Gate
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">
                Sapiexa Media · akshayblog.sapiexa.com
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-base cursor-pointer p-1"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Restricted Single-Owner Admin Control</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Content creation, article editing, and monetization parameters on <code>akshayblog.sapiexa.com</code> are restricted exclusively to <strong>Antony Akshay</strong>. Public readers have read-only access.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Lockout countdown */}
        {lockoutTimer > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs text-center font-mono font-semibold">
            Security cooling period active: {lockoutTimer}s remaining
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Owner Email */}
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Verified Owner Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={lockoutTimer > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="antonyakshay7@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Master Passcode */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-stone-700 dark:text-stone-300">
                Owner Secret Passkey
              </label>
              <span className="text-[10px] text-stone-400 font-mono">
                Encrypted Session
              </span>
            </div>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                autoFocus
                disabled={lockoutTimer > 0}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter master passkey..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                title={showPasscode ? 'Hide secret key' : 'Show secret key'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || lockoutTimer > 0}
              className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying Identity...' : 'Authenticate & Unlock'}</span>
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>Protected: BroSis Tech Tamil</span>
          <span>Role: Solo SuperAdmin</span>
        </div>
      </div>
    </div>
  );
};
