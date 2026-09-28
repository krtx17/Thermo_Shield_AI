import React, { useState } from "react";
import { Shield, KeyRound, Check, AlertCircle, X, User, UserPlus, LogIn } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, isNewUser?: boolean) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Login form state
  const [email, setEmail] = useState("commander@thermoshield.defense");
  const [password, setPassword] = useState("command2026");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("FIELD_OPERATOR");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

      onLoginSuccess(data.user, false);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Engaging offline credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("thermo_shield_jwt", data.token);
      localStorage.setItem("thermo_shield_user", JSON.stringify(data.user));

      onLoginSuccess(data.user, true);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Network error during clearance registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#0b101d] border border-[#1e2c4a] shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2c4a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#38bdf8]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                {authMode === "login" ? "Operator Clearance Login" : "Register Security Clearance"}
              </h2>
              <p className="text-[11px] text-slate-400">
                Thermo Shield Tactical Terminal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="mt-4 p-1 rounded-xl bg-[#070b14] border border-[#18233a] flex gap-1">
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMode === "login"
                ? "bg-[#2563eb] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("register"); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMode === "register"
                ? "bg-[#2563eb] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIGN IN FORM */}
        {/* ========================================================================= */}
        {authMode === "login" ? (
          <div>
            {/* Quick Credentials Selection */}
            <div className="mt-3 p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Clearance Preset:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect("commander@thermoshield.defense", "command2026")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    email.includes("commander")
                      ? "bg-[#2563eb] text-white border-blue-400 shadow-sm"
                      : "bg-[#10172a] text-slate-300 border-[#1e2c4a] hover:bg-slate-800"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Cmdr. Vance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect("operator@thermoshield.defense", "operator2026")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
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

            <form onSubmit={handleLoginSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Clearance Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@thermoshield.defense"
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
                  placeholder="••••••••••••"
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
          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTER NEW OPERATOR FORM */
          /* ========================================================================= */
          <form onSubmit={handleRegisterSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Full Operator Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                placeholder="e.g. Commander Marcus Vance"
                className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Official Clearance Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="m.vance@agency.gov.in"
                className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Access Key / Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
                className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Security Clearance Level</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 rounded-xl text-xs bg-[#10172a] border border-[#1e2c4a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer"
              >
                <option value="FIELD_OPERATOR">Field Tactical Operator (Standard)</option>
                <option value="SAFETY_MARSHAL">Refinery Safety Marshal</option>
                <option value="CHIEF_OFFICER">Chief Geospatial Officer (Full Clearance)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Generating Cryptographic Identity...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Clearance & Start Onboarding</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-[#1e2c4a] text-center">
          <p className="text-[10px] text-slate-500">
            Encrypted Session • HMAC SHA-256 JWT Token Protection
          </p>
        </div>
      </div>
    </div>
  );
}
