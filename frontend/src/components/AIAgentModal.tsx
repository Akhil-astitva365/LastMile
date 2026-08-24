import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, CheckCircle2, UserCheck, Bell, DollarSign, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface AIAgentResponse {
  aiExplanation: string;
  generatedOrderNumber: string;
  pickupAddress: string;
  dropAddress: string;
  billableWeight: number;
  finalCharge: number;
  assignedAgentName: string;
  notificationStatus: string;
}

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export const AIAgentModal: React.FC<AIAgentModalProps> = ({ isOpen, onClose, onOrderCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AIAgentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSamplePrompt = (sample: string) => {
    setPrompt(sample);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await api.post<AIAgentResponse>('/ai/create-order', { prompt });
      setResult(res.data);
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'AI Agent failed to process logistics order prompt.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl ios-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-black border border-white/30 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white text-black font-bold shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" /> AUTONOMOUS DISPATCH ENGINE
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">AI LOGISTICS AGENT MODE</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">💡 SAMPLE AI PROMPT TEMPLATES</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSamplePrompt("Book an urgent 8kg package 50x40x30cm from Bhopal 462001 to Indore 452001 COD")}
              className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-white text-left text-[11px] text-neutral-300 hover:text-white transition-all"
            >
              🚚 Bhopal ➔ Indore (8kg COD)
            </button>
            <button
              type="button"
              onClick={() => handleSamplePrompt("Ship a 5kg parcel from Connaught Place Delhi 110001 to Bandra West Mumbai 400050 Prepaid")}
              className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-white text-left text-[11px] text-neutral-300 hover:text-white transition-all"
            >
              ✈️ Delhi ➔ Mumbai (5kg Prepaid)
            </button>
            <button
              type="button"
              onClick={() => handleSamplePrompt("Create a 12kg B2B enterprise shipment from Bengaluru 560001 to Chennai 600001")}
              className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-white text-left text-[11px] text-neutral-300 hover:text-white transition-all"
            >
              🏢 B2B Bengaluru ➔ Chennai
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe your shipment in natural language (e.g. Ship an 8kg parcel length 50cm, breadth 40cm from Delhi to Mumbai COD)..."
              className="w-full ios-input rounded-2xl p-4 text-xs font-medium text-white placeholder:text-neutral-600 focus:outline-none"
              required
            />
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !prompt.trim()}
            className="w-full py-3.5 rounded-full ios-button-primary text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <span>AI AGENT EXECUTING AUTO-DISPATCH...</span>
            ) : (
              <>
                <Send className="w-4 h-4" /> EXECUTE AI ORDER CREATION & AUTO-ASSIGN
              </>
            )}
          </button>
        </form>

        {/* AI Execution Results */}
        {result && (
          <div className="p-5 rounded-2xl bg-neutral-950 border border-white/40 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-white" /> AI ORDER CREATED & DISPATCHED
              </span>
              <span className="text-xs font-bold text-white">#{result.generatedOrderNumber}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-black p-2.5 rounded-xl border border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block">Calculated Charge</span>
                <span className="font-bold text-white flex items-center gap-1 text-sm">
                  <DollarSign className="w-3.5 h-3.5" /> ₹{result.finalCharge}
                </span>
              </div>

              <div className="bg-black p-2.5 rounded-xl border border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block">Billable Weight</span>
                <span className="font-bold text-white text-xs">{result.billableWeight} kg</span>
              </div>

              <div className="bg-black p-2.5 rounded-xl border border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block">Assigned Agent</span>
                <span className="font-bold text-white flex items-center gap-1 text-xs">
                  <UserCheck className="w-3.5 h-3.5" /> {result.assignedAgentName}
                </span>
              </div>

              <div className="bg-black p-2.5 rounded-xl border border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block">Notification</span>
                <span className="font-bold text-white flex items-center gap-1 text-xs">
                  <Bell className="w-3.5 h-3.5" /> SMS & Email Sent
                </span>
              </div>
            </div>

            <div className="text-xs font-mono bg-black p-3 rounded-xl border border-neutral-800 text-neutral-300 whitespace-pre-line leading-relaxed">
              {result.aiExplanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
