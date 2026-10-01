import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  Check,
  BookOpen,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';
import { identifyVerseMeter, analyzePada, MeterVerificationReport } from '../utils/chhandasEngine.js';

interface ChhandasPaniniStudioProps {
  text: string;
  onApplyFix?: (fixedText: string) => void;
}

export const ChhandasPaniniStudio: React.FC<ChhandasPaniniStudioProps> = ({
  text,
  onApplyFix,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chhandas' | 'panini'>('chhandas');
  const [hasAppliedFix, setHasAppliedFix] = useState<boolean>(false);

  // 1. Live Metrical Analysis
  const meterReport: MeterVerificationReport = useMemo(() => {
    return identifyVerseMeter(text || '');
  }, [text]);

  // 2. Paninian Orthography & Sandhi Analysis
  const paninianAudit = useMemo(() => {
    const raw = text || '';
    const suggestions: { original: string; corrected: string; rule: string; sutra: string }[] = [];

    // Rule P-1: 'सः' before consonant -> 'स' (6.1.132)
    const saMatches = raw.match(/सः\s+([क-ह])/g);
    if (saMatches) {
      saMatches.forEach(m => {
        suggestions.push({
          original: m,
          corrected: m.replace('सः', 'स'),
          rule: "व्यञ्जन परे होने पर 'सः' के विसर्ग का नित्य लोप",
          sutra: 'एतत्तदोः सुलोपोऽकोरनञ्पमासे हलि (६.१.१३२)',
        });
      });
    }

    // Rule P-2: 'एषः' before consonant -> 'एष'
    const eshaMatches = raw.match(/एषः\s+([क-ह])/g);
    if (eshaMatches) {
      eshaMatches.forEach(m => {
        suggestions.push({
          original: m,
          corrected: m.replace('एषः', 'एष'),
          rule: "व्यञ्जन परे होने पर 'एषः' के विसर्ग का नित्य लोप",
          sutra: 'एतत्तदोः सुलोपोऽकोरनञ्पमासे हलि (६.१.१३२)',
        });
      });
    }

    // Rule P-3: Anusvara to Parasavarna in root syllables
    const parasavarnaMap: Record<string, string> = {
      'गंगा': 'गङ्गा',
      'शंख': 'शङ्ख',
      'पंच': 'पञ्च',
      'पंडित': 'पण्डित',
      'संत': 'सन्त',
      'अंबा': 'अम्बा',
      'मंगल': 'मङ्गल',
      'अंग': 'अङ्ग',
    };

    Object.entries(parasavarnaMap).forEach(([improper, proper]) => {
      if (raw.includes(improper)) {
        suggestions.push({
          original: improper,
          corrected: proper,
          rule: 'पदान्तर्गत पञ्चमाक्षर (परसवर्ण) विधान',
          sutra: 'अनुस्वारस्य ययि परसवर्णः (८.४.५८)',
        });
      }
    });

    // Rule P-4: ASCII Vedic accent artifacts
    if (raw.includes('_') || raw.includes(' -') || raw.includes(' "') || raw.includes(" '")) {
      suggestions.push({
        original: 'ASCII हाइफन / कोटेशन मार्क',
        corrected: 'शुद्ध वैदिक अनुदात्त (॒) एवं स्वरित (॑)',
        rule: 'वैदिक स्वर-चिह्न शुद्धीकरण',
        sutra: 'उच्चैरुदात्तः (१.२.२९) एवं नीचैरनुदात्तः (१.२.३०)',
      });
    }

    // Generate auto-healed text
    let healed = raw
      .replace(/सः\s+([क-ह])/g, 'स $1')
      .replace(/एषः\s+([क-ह])/g, 'एष $1')
      .replace(/गंगा/g, 'गङ्गा')
      .replace(/शंख/g, 'शङ्ख')
      .replace(/पंच/g, 'पञ्च')
      .replace(/पंडित/g, 'पण्डित')
      .replace(/संत/g, 'सन्त')
      .replace(/अंबा/g, 'अम्बा')
      .replace(/मंगल/g, 'मङ्गल')
      .replace(/अंग/g, 'अङ्ग')
      .replace(/_/g, '\u0952')
      .replace(/'/g, '\u0951');

    return {
      suggestions,
      healedText: healed,
      hasCorrections: suggestions.length > 0 && healed !== raw,
    };
  }, [text]);

  const handleApplyPaninianHeal = () => {
    if (onApplyFix && paninianAudit.hasCorrections) {
      onApplyFix(paninianAudit.healedText);
      setHasAppliedFix(true);
      setTimeout(() => setHasAppliedFix(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Studio Header & Sub-Tabs */}
      <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-sacred-950 border border-sacred-700/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sacred-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-100 font-devanagari flex items-center space-x-2">
              <span>छन्द व शास्त्र-शोधक प्रयोगशाला</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-sacred-900/60 text-sacred-300 border border-sacred-700/50">
                Panini & Pingala Core
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 font-devanagari">
              अक्षर-मापन, लघु-गुरु गण एवं पाणिनीय विसर्ग व सन्धि शुद्धि
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center space-x-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveSubTab('chhandas')}
            className={`px-3 py-1 rounded-md font-medium transition-colors font-devanagari ${
              activeSubTab === 'chhandas'
                ? 'bg-sacred-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            छन्द विश्लेषण ({meterReport.meterNameDevanagari.split(' ')[0]})
          </button>

          <button
            onClick={() => setActiveSubTab('panini')}
            className={`px-3 py-1 rounded-md font-medium transition-colors font-devanagari flex items-center space-x-1.5 ${
              activeSubTab === 'panini'
                ? 'bg-sacred-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>पाणिनीय शुद्धि</span>
            {paninianAudit.hasCorrections && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SUBTAB 1: CHHANDAS & METRICS */}
        {activeSubTab === 'chhandas' && (
          <div className="space-y-4">
            {/* Meter Overview Banner */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400 font-devanagari">निर्धारित छन्द:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-sm font-devanagari flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{meterReport.meterNameDevanagari}</span>
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ({meterReport.meterName})
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-neutral-400">
                    कुल पाद: <strong className="text-neutral-200">{meterReport.totalPadas}</strong>
                  </span>
                  <span className="text-neutral-400">
                    विश्वसनीयता: <strong className="text-emerald-400">{Math.round(meterReport.confidence * 100)}%</strong>
                  </span>
                </div>
              </div>

              {/* Diagnostics Notes */}
              {meterReport.diagnostics.length > 0 && (
                <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                  {meterReport.diagnostics.map((diag, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-neutral-300 font-devanagari">
                      <Info className="w-3.5 h-3.5 text-sacred-400 mt-0.5 shrink-0" />
                      <span>{diag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Padas Breakdown (Syllables, Weights, Ganas) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-devanagari">
                चरणवार लघु-गुरु एवं गण विश्लेषण (Pādas Syllabic Breakdown)
              </h4>

              {meterReport.padas.map((pada, pIdx) => {
                const isNonVerse = pada.category && pada.category !== 'verse';
                const isAnushtubhExpected8 = meterReport.meterName === 'Anushtubh';
                const hasSyllableWarning = !isNonVerse && isAnushtubhExpected8 && pada.syllableCount !== 8;

                if (isNonVerse) {
                  const categoryBadgeStyles: Record<string, { bg: string; text: string; border: string; desc: string }> = {
                    header: {
                      bg: 'bg-blue-950/60',
                      text: 'text-blue-300',
                      border: 'border-blue-800/80',
                      desc: '(ग्रन्थ शीर्षक • छन्द लागू नहीं)',
                    },
                    uvacha: {
                      bg: 'bg-purple-950/60',
                      text: 'text-purple-300',
                      border: 'border-purple-800/80',
                      desc: '(संवाद / वक्ता-निर्देश • छन्द लागू नहीं)',
                    },
                    invocation: {
                      bg: 'bg-sacred-950',
                      text: 'text-sacred-300',
                      border: 'border-sacred-800/80',
                      desc: '(नमस्कारोक्ति / मङ्गलम् • छन्द लागू नहीं)',
                    },
                    karmakanda_vidhi: {
                      bg: 'bg-amber-950/60',
                      text: 'text-amber-300',
                      border: 'border-amber-800/80',
                      desc: '(अनुष्ठान विधि / न्यास • छन्द लागू नहीं)',
                    },
                    colophon: {
                      bg: 'bg-neutral-800/80',
                      text: 'text-neutral-300',
                      border: 'border-neutral-700',
                      desc: '(पुष्पिका / समाप्ति • छन्द लागू नहीं)',
                    },
                  };

                  const badge = categoryBadgeStyles[pada.category] || categoryBadgeStyles.header;

                  return (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-[10px]">
                          {pIdx + 1}
                        </span>
                        <span className="font-devanagari font-bold text-sm text-neutral-200">
                          {pada.rawText}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border} font-devanagari text-[11px] font-semibold`}>
                          {pada.categoryLabel}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-devanagari italic">
                          {badge.desc}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={pIdx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      hasSyllableWarning
                        ? 'bg-red-950/20 border-red-800/60'
                        : 'bg-neutral-900/60 border-neutral-800'
                    }`}
                  >
                    {/* Pada Header */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-[11px]">
                          {pIdx + 1}
                        </span>
                        <span className="font-devanagari font-bold text-sm text-neutral-100">
                          {pada.rawText}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {pada.localMeter && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-devanagari font-semibold bg-sacred-950/80 text-sacred-300 border border-sacred-800/60">
                            {pada.localMeter}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            hasSyllableWarning
                              ? 'bg-red-900/60 text-red-300 border border-red-700'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {pada.syllableCount} अक्षर
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {pada.totalMatras} मात्रा
                        </span>
                      </div>
                    </div>

                    {/* Syllables Laghu/Guru Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/60">
                      {pada.syllables.map((syl, sIdx) => {
                        const isGuru = syl.weight === 'G';
                        return (
                          <div
                            key={sIdx}
                            className={`flex flex-col items-center px-2 py-1 rounded-md border text-xs transition-transform hover:scale-105 ${
                              isGuru
                                ? 'bg-amber-950/40 border-amber-800/50 text-neutral-100'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                            }`}
                            title={`अक्षर: ${syl.text} | भार: ${isGuru ? 'गुरु (२ मात्रा)' : 'लघु (१ मात्रा)'} | स्वर: ${syl.vowel}`}
                          >
                            <span className="font-devanagari font-medium text-xs text-neutral-100">
                              {syl.text}
                            </span>
                            <div className="flex items-center space-x-1 mt-0.5">
                              <span
                                className={`text-[11px] font-bold ${
                                  isGuru ? 'text-amber-400' : 'text-neutral-400'
                                }`}
                              >
                                {isGuru ? 'ऽ' : '।'}
                              </span>
                              <span className="text-[9px] text-neutral-500 font-mono">
                                {syl.matra}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Gana notation bar */}
                    {pada.ganaNotation && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-800/40 flex items-center justify-between text-[11px] text-neutral-400 font-devanagari">
                        <span>गण विन्यास:</span>
                        <span className="font-bold text-sacred-300 font-mono tracking-wider">
                          {pada.ganaNotation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 2: PANINIAN HEALING STUDIO */}
        {activeSubTab === 'panini' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-100 font-devanagari">
                  अष्टाध्यायी पाणिनीय व्याकरण परीक्षा
                </h4>
                <p className="text-xs text-neutral-400 font-devanagari mt-0.5">
                  विसर्ग-सन्धि (सुलोप), परसवर्ण (पञ्चमाक्षर), एवं वैदिक स्वर चिह्नों का शास्त्रसम्मत परीक्षण
                </p>
              </div>

              {paninianAudit.hasCorrections && onApplyFix && (
                <button
                  onClick={handleApplyPaninianHeal}
                  disabled={hasAppliedFix}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-devanagari flex items-center space-x-2 transition-all shadow-lg shadow-emerald-950"
                >
                  {hasAppliedFix ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>शुद्धिकरण सम्पन्न!</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>एक-क्लिक शास्त्रसम्मत शुद्धि करें</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Suggestions List */}
            {paninianAudit.suggestions.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-neutral-900/50 border border-neutral-800 text-neutral-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-devanagari font-bold text-neutral-200">
                  पाठ पूर्णतः पाणिनीय व्याकरणसम्मत है!
                </p>
                <p className="text-xs font-devanagari text-neutral-400 mt-1">
                  विसर्ग-लोप, परसवर्ण पञ्चमाक्षर एवं सन्धि नियमों का कोई उल्लंघन नहीं मिला।
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-devanagari">
                  चिह्नित शास्त्रीय सुधार बिन्दु ({paninianAudit.suggestions.length})
                </h5>

                {paninianAudit.suggestions.map((sug, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-devanagari font-bold text-sacred-400">
                        {sug.rule}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {sug.sutra}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-sm font-devanagari">
                      <div className="px-2.5 py-1 rounded bg-red-950/40 border border-red-800/60 text-red-300 font-medium line-through">
                        {sug.original}
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-500" />
                      <div className="px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-bold">
                        {sug.corrected}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
