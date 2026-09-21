import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  Smartphone,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface QrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentUrl?: string;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({
  isOpen,
  onClose,
  deploymentUrl = 'https://g-55541458-rgb.github.io/Dashboard-Sukan-Tahunan/',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  const activeUrl = deploymentUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = activeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrWrapperRef.current) return;
    const svg = qrWrapperRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // High res output
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 30, 30, size - 60, size - 60);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'QR-Kod-Kejohanan-Sukan-Chung-Hwa-2026.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden z-10 text-white"
        >
          {/* Subtle Ambient Background Accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 mb-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IMBAS KEPUTUSAN LANGSUNG</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              KOD QR PAPARAN AWAM
            </h3>
            <p className="text-xs text-slate-400">
              Halakan kamera telefon pintar anda untuk melihat kedudukan sukan semasa
            </p>
          </div>

          {/* Center QR Code Container */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div
              ref={qrWrapperRef}
              className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-950/50 border-4 border-amber-400/80 relative group"
            >
              <QRCodeSVG
                value={activeUrl}
                size={210}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d97706"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>

            <div className="flex items-center space-x-2 mt-3 text-xs text-slate-400 font-medium">
              <Smartphone className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Sesuai untuk semua telefon Android & iOS (iPhone)</span>
            </div>
          </div>

          {/* URL Box & Copy */}
          <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800 space-y-2 mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
              <span>PAUTAN WEB KEJOHANAN:</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>GITHUB PAGES</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all truncate"
              />

              <button
                onClick={handleCopyLink}
                title="Salin Pautan"
                className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Disalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Open in Tab & Download PNG */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadQr}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:text-white active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Muat Turun QR</span>
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition-all active:scale-95 shadow-md shadow-amber-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Laman</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
