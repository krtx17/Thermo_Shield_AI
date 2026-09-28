import React, { useState } from "react";
import { Shield, KeyRound, Check, AlertCircle, X, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("kritika.tripathi@thermoshield.defense");
  const [password, setPassword] = useState("command2026");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("thermo_shield_jwt", data.token);
      localStorage.setItem("thermo_shield_user", JSON.stringify(data.user));

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Engaging offline credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2c4a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#38bdf8]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                Operator Clearance Access
              </h2>
              <p className="text-[11px] text-slate-400">
                Thermo Shield Tactical Intelligence Terminal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Credentials Selection */}
        <div className="mt-4 p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Select Preset Clearance:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickSelect("kritika.tripathi@thermoshield.defense", "command2026")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                email.includes("kritika")
                  ? "bg-[#2563eb] text-white border-blue-400 shadow-sm"
                  : "bg-[#10172a] text-slate-300 border-[#1e2c4a] hover:bg-slate-800"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Chief Officer (Kritika)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect("operator@thermoshield.defense", "operator2026")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                email.includes("operator")
                  ? "bg-[#2563eb] text-white border-blue-400 shadow-sm"
                  : "bg-[#10172a] text-slate-300 border-[#1e2c4a] hover:bg-slate-800"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Tactical Unit</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300">Clearance Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Access Key / Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Cryptographic Credentials...</span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Authenticate Clearance</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#1e2c4a] text-center">
          <p className="text-[10px] text-slate-500">
            Encrypted Session • HMAC SHA-256 JWT Token Protection
          </p>
        </div>
      </div>
    </div>
  );
}
