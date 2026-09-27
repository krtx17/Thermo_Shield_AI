import React, { useState, useEffect } from "react";
import { AuditLogEntry } from "../types";

export default function AuditTrail() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState("EVT-20260903-0042");
  const [newAction, setNewAction] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLogs(data);
        }
      }
    } catch (e) {
      console.warn("Could not load audit logs:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddManualLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: newEvent,
          action: newAction,
          source: "Manual Operator Verification"
        })
      });

      if (res.ok) {
        const created = await res.json();
        setLogs(prev => [created, ...prev]);
        setNewAction("");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to add manual audit log:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      log.event.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.source.toLowerCase().includes(q) ||
      log.hash.toLowerCase().includes(q) ||
      String(log.block).includes(q)
    );
  });

  return (
    <div className="p-4 flex flex-col gap-4 text-left font-mono">
      {/* Title bar */}
      <div className="bg-[#181b25] p-4 rounded-xl border border-[#262a34] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-[#8c909f] font-bold uppercase tracking-widest">Verification Chain</span>
          <h2 className="font-sans font-bold text-lg text-white mt-0.5">Tamper-Evident Audit Ledger</h2>
          <span className="text-[9px] text-[#8c909f]">Cryptographic SHA-256 sequential hash chain tracking all intelligence operations</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg bg-[#181b25] text-white border border-[#262a34] hover:bg-[#262a34] text-xs font-semibold uppercase transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">{showAddForm ? "close" : "add"}</span>
            {showAddForm ? "Cancel" : "Record Entry"}
          </button>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[#0267b8] text-white hover:bg-[#025699] text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">{isLoading ? "sync" : "refresh"}</span>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Manual verification entry form */}
      {showAddForm && (
        <form onSubmit={handleAddManualLog} className="bg-[#0c0f16] border border-[#262a34] rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-bold text-white uppercase">Record Operator Verification Entry</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] text-[#8c909f] block uppercase mb-1">Incident Event</label>
              <select
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                className="w-full bg-[#181b25] border border-[#262a34] rounded p-2 text-white text-xs"
              >
                <option value="EVT-20260903-0042">EVT-20260903-0042 (Paradip)</option>
                <option value="EVT-20260903-0089">EVT-20260903-0089 (Dahej)</option>
                <option value="EVT-20260902-0031">EVT-20260902-0031 (Jharkhand)</option>
                <option value="EVT-20260902-0012">EVT-20260902-0012 (Nagpur)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[9px] text-[#8c909f] block uppercase mb-1">Verification Action / Remark</label>
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g. On-ground emergency crew confirmed controlled burn; updated risk status"
                className="w-full bg-[#181b25] border border-[#262a34] rounded p-2 text-white text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding || !newAction.trim()}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
            >
              {isAdding ? "Appending Block..." : "Append to Hash Chain"}
            </button>
          </div>
        </form>
      )}

      {/* Search filter bar */}
      <div className="bg-[#0c0f16] border border-[#262a34] rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <span className="material-symbols-outlined text-[#8c909f] text-sm">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search block #, hash, action, or event..."
            className="w-full bg-[#181b25] border border-[#262a34] rounded px-2.5 py-1 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:border-[#0267b8]"
          />
        </div>
        <span className="text-[10px] text-[#8c909f]">{filteredLogs.length} blocks registered</span>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#0c0f16] border border-[#262a34] rounded-xl p-4 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262a34] text-[#8c909f] uppercase text-[9px]">
                <th className="py-2.5 px-3">Block No.</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3">Associated Incident</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Source Channel</th>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Provenance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a34]/40 text-[#dfe2ef]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8c909f]">
                    No audit records match search filter
                  </td>
                </tr>
              ) : (
                filteredLogs.map((c) => (
                  <tr key={c.id || c.block} className="hover:bg-[#181b25]/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#adc6ff]">#{c.block}</td>
                    <td className="py-3 px-3 text-[#8c909f] text-[10px] font-mono">{c.hash}</td>
                    <td className="py-3 px-3 font-semibold text-white">{c.event}</td>
                    <td className="py-3 px-3 text-slate-300 text-[11px]">{c.action || "Telemetry Ingestion"}</td>
                    <td className="py-3 px-3 text-[#adc6ff] text-[11px]">{c.source}</td>
                    <td className="py-3 px-3 text-[11px]">{c.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-[#4edea3] border border-emerald-900/60 font-bold text-[9px]">
                        {c.status || "VERIFIED"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3 mt-3 border-t border-[#262a34]/40 flex items-center justify-between text-[9px] text-[#8c909f]">
          <span>Hash Algorithm: SHA-256 (Merkle Sequence Simulation)</span>
          <span>Proof-of-Concept Protocol for SIH Evaluation</span>
        </div>
      </div>
    </div>
  );
}
