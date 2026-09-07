import React, { useState, useEffect } from 'react';
import { X, History, Clock, FileText, CheckCircle2, Upload, Trash2, Edit3, Loader2 } from 'lucide-react';
import { api } from '../api.js';
import type { AuditLogEntry } from '../../shared/types.js';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.getAuditLogs().then(data => {
        setLogs(data);
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getActionBadge = (action: string) => {
    if (action.includes('VERIFIED')) {
      return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">VERIFICATION</span>;
    }
    if (action.includes('OCR')) {
      return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">OCR ENGINE</span>;
    }
    if (action.includes('UPLOAD') || action.includes('CREATED')) {
      return <span className="px-2 py-0.5 rounded bg-sacred-950 text-sacred-400 border border-sacred-800 text-[10px] font-bold">INGESTION</span>;
    }
    if (action.includes('EXPORT')) {
      return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 text-[10px] font-bold">EXPORT</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px] font-bold">SYSTEM</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sacred-950 border border-sacred-800 flex items-center justify-center text-sacred-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100 font-devanagari">
                लेखा परीक्षा एवं सत्यापन इतिहास (Audit Trail)
              </h2>
              <p className="text-xs text-neutral-400">प्रत्येक पृष्ठ का अक्षर-परिवर्तन एवं सत्यापन रिकॉर्ड</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Log Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-neutral-400">
              <Loader2 className="w-6 h-6 mx-auto text-sacred-500 animate-spin mb-2" />
              <p className="text-xs">ऑडिट लॉग लोड हो रहे हैं...</p>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center py-12 text-neutral-500 text-sm">अभी कोई गतिविधि दर्ज नहीं है।</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getActionBadge(log.action)}
                    <span className="font-mono text-[11px] text-neutral-400">
                      {new Date(log.timestamp).toLocaleString('hi-IN')}
                    </span>
                  </div>
                  <p className="text-neutral-200 font-devanagari mt-1">
                    {log.details}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
