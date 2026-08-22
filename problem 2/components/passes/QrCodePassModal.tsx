"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { 
  QrCode, 
  X, 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  Sparkles,
  Ticket,
  Clock
} from "lucide-react";

export interface RegistrationPassData {
  registrationId: string;
  eventName: string;
  eventDate: string;
  eventTime?: string;
  eventVenue: string;
  studentName: string;
  studentId: string;
  department?: string;
  year?: string;
  pricePaid?: number;
  priceFormatted?: string;
  paymentStatus?: string;
}

interface QrCodePassModalProps {
  passData: RegistrationPassData | null;
  onClose: () => void;
}

export function QrCodePassModal({ passData, onClose }: QrCodePassModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (passData) {
      // Generate clean QR code string
      const payload = JSON.stringify({
        id: passData.registrationId,
        student: passData.studentName,
        sid: passData.studentId,
        event: passData.eventName,
        date: passData.eventDate,
        venue: passData.eventVenue,
        status: "VERIFIED_ACTIVE"
      });

      QRCode.toDataURL(payload, {
        width: 320,
        margin: 1.5,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [passData]);

  if (!passData) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(passData.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${passData.registrationId}-${passData.eventName.replace(/\s+/g, "_")}_Pass.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl">
        {/* Pass Header Graphic */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-100">
                Official Campus Entry Pass
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-black/20 p-1.5 text-white/80 hover:bg-black/40 hover:text-white transition"
              aria-label="Close pass"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <h2 className="text-xl font-black tracking-tight text-white">{passData.eventName}</h2>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {passData.eventDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {passData.eventVenue}
              </span>
            </div>
          </div>
        </div>

        {/* Pass Body with QR Code */}
        <div className="p-6 space-y-5">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-inner border border-slate-200">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Registration QR Pass"
                className="h-48 w-48 rounded-lg object-contain"
              />
            ) : (
              <div className="h-48 w-48 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            )}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Scan at Venue Perimeter Gate</span>
            </div>
          </div>

          {/* Pass ID Badge */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 border border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Pass Registration ID</p>
              <p className="font-mono text-sm font-black text-blue-400 tracking-wider">
                {passData.registrationId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition border border-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Student Info Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Attendee Name</p>
              <p className="font-bold text-white truncate">{passData.studentName}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Student ID</p>
              <p className="font-bold text-blue-400 font-mono">{passData.studentId}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Ticket Tier / Fee</p>
              <p className="font-bold text-emerald-400">{passData.priceFormatted || (passData.pricePaid ? `₹${passData.pricePaid}` : "Free Pass")}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Gate Status</p>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Entry</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDownloadQr}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 p-3 text-xs font-bold text-white transition shadow-lg shadow-blue-500/20 active:scale-98"
            >
              <Download className="h-4 w-4" />
              <span>Download Pass PNG</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-3 text-xs font-bold text-slate-300 transition border border-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
