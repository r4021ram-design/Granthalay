import React, { useState } from 'react';
import {
  SankalpaBlock,
  ViniyogaBlock,
  NyasaBlock,
  UpacharaItem,
  KarmakandaSegment,
} from '../utils/karmakandaParser';

// ============================================================================
// 1. Living Sankalpa Card (सङ्कल्प कार्ड)
// ============================================================================

interface LivingSankalpaCardProps {
  sankalpa: SankalpaBlock;
}

export const LivingSankalpaCard: React.FC<LivingSankalpaCardProps> = ({ sankalpa }) => {
  const [waterOffered, setWaterOffered] = useState(false);
  const [customVars, setCustomVars] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    sankalpa.variables.forEach(v => {
      init[v.label] = v.value;
    });
    return init;
  });
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleVariableChange = (label: string, newVal: string) => {
    setCustomVars(prev => ({ ...prev, [label]: newVal }));
  };

  return (
    <div className="relative my-6 rounded-3xl border-2 border-amber-600/40 bg-gradient-to-br from-[#FBF6EB] via-[#F5EAD6] to-[#EBD8B8] dark:from-neutral-900 dark:via-amber-950/30 dark:to-neutral-900 p-5 md:p-7 shadow-lg shadow-[#8C2D19]/10 transition-all duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#8C2D19]/25 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8C2D19]/15 text-lg text-[#8C2D19] dark:text-amber-300 ring-1 ring-[#8C2D19]/30">
            📜
          </span>
          <div>
            <h3 className="font-serifDevanagari text-lg font-bold tracking-wide text-[#7A2814] dark:text-amber-200">
              ॥ सङ्कल्प विधानम् (Living Cosmic Sankalpa) ॥
            </h3>
            <p className="text-xs text-[#8C2D19]/80 dark:text-amber-400/70 font-devanagari">
              काल-देश-पञ्चाङ्ग एवं यजमान प्रतिज्ञा सूत्र
            </p>
          </div>
        </div>
        <span className="rounded-full border border-amber-600/40 bg-amber-600/10 px-3 py-1 text-xs font-semibold text-[#8C2D19] dark:text-amber-300">
          अपरिवर्तनीय शास्त्रीय क्रम
        </span>
      </div>

      {/* Cosmic Coordinates & Variables */}
      <div className="my-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {sankalpa.variables.map((v, i) => (
          <div
            key={i}
            onClick={() => setEditingKey(v.label)}
            className="group cursor-pointer rounded-xl border border-amber-600/25 bg-white/70 dark:bg-black/30 p-2.5 transition-all duration-200 hover:border-amber-600 hover:bg-white/95 dark:hover:bg-black/50 shadow-2xs"
          >
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
              {v.label}
            </div>
            {editingKey === v.label ? (
              <input
                type="text"
                autoFocus
                value={customVars[v.label] || ''}
                onChange={e => handleVariableChange(v.label, e.target.value)}
                onBlur={() => setEditingKey(null)}
                className="mt-1 w-full rounded border border-amber-500 bg-white dark:bg-neutral-950 px-1.5 py-0.5 text-xs text-[#7A2814] dark:text-amber-200 outline-none focus:ring-1 focus:ring-amber-400"
              />
            ) : (
              <div className="mt-0.5 truncate font-serifDevanagari text-sm font-bold text-[#7A2814] dark:text-amber-100 group-hover:text-sacred-700">
                {customVars[v.label] || v.value}
                <span className="ml-1 text-[10px] text-amber-600/80 opacity-0 group-hover:opacity-100">
                  ✏️
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sankalpa Text Body */}
      <div className="rounded-2xl border border-[#8C2D19]/20 bg-white/70 dark:bg-neutral-950/70 p-4 font-tiro text-base leading-relaxed text-[#2C1810] dark:text-amber-50/90 shadow-inner">
        <p className="whitespace-pre-line text-justify select-text">
          {sankalpa.fullText}
        </p>
      </div>

      {/* Action Instruction & Offering Badge */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sky-600/30 bg-sky-500/[0.08] dark:bg-sky-950/30 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl animate-pulse">💧</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
              पुजारी / यजमान क्रिया निर्देश
            </div>
            <p className="text-sm font-medium text-sky-950 dark:text-sky-100 leading-relaxed font-devanagari">
              {sankalpa.actionInstruction}
            </p>
          </div>
        </div>

        <button
          onClick={() => setWaterOffered(prev => !prev)}
          className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 shadow-md ${
            waterOffered
              ? 'bg-emerald-600 text-white border border-emerald-500'
              : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white border border-sky-400/50 shadow-sky-500/20 active:scale-95'
          }`}
        >
          {waterOffered ? '✓ जल समर्पित (अर्पितम्)' : '🌊 जल ताम्रपात्र में छोड़ें'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. Viniyoga Anatomy Card (विनियोग विज्ञान)
// ============================================================================

interface ViniyogaCardProps {
  viniyoga: ViniyogaBlock;
}

export const ViniyogaCard: React.FC<ViniyogaCardProps> = ({ viniyoga }) => {
  const [activeComponent, setActiveComponent] = useState<number | null>(null);

  return (
    <div className="relative my-5 rounded-3xl border-2 border-amber-600/35 bg-gradient-to-br from-[#FBF6EB] via-[#F4E8D1] to-[#EBD8B8] dark:from-neutral-900 dark:via-amber-950/30 dark:to-neutral-900 p-5 md:p-6 shadow-md shadow-[#8C2D19]/10 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#8C2D19]/25 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8C2D19]/15 text-[#8C2D19] dark:text-amber-300 font-bold">
            🕉️
          </span>
          <h3 className="font-serifDevanagari text-base sm:text-lg font-bold text-[#7A2814] dark:text-amber-200 tracking-wide">
            ॥ ऋष्यादि विनियोग सूत्रम् ॥
          </h3>
        </div>
        <span className="rounded-full bg-[#8C2D19]/10 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold text-[#8C2D19] dark:text-amber-300 border border-[#8C2D19]/25">
          ५ अनिवार्य अङ्ग
        </span>
      </div>

      {/* Raw Sanskrit Text with Tiro Sanskrit typography */}
      <div className="mt-3.5 rounded-xl border border-[#8C2D19]/15 bg-white/60 dark:bg-black/30 p-3.5 text-center">
        <p className="font-tiro text-sm sm:text-base leading-relaxed text-[#2C1810] dark:text-amber-100 select-text">
          {viniyoga.fullText}
        </p>
      </div>

      {/* Anatomy Chips */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {viniyoga.components.map((comp, idx) => {
          const isActive = activeComponent === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveComponent(isActive ? null : idx)}
              className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 select-none ${
                isActive
                  ? 'border-amber-600 bg-amber-100/90 dark:bg-amber-900/50 shadow-md ring-2 ring-amber-500/40'
                  : 'border-amber-600/25 bg-white/70 dark:bg-neutral-900/60 hover:border-amber-500 hover:bg-white/95 dark:hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{comp.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {comp.label}
                </span>
              </div>
              <div className="mt-1.5 font-serifDevanagari text-base font-bold text-[#7A2814] dark:text-amber-100">
                {comp.name}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8C2D19] dark:text-amber-300 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8C2D19] dark:bg-amber-400" />
                <span>स्थान: {comp.touchPoint}</span>
              </div>
              {isActive && (
                <div className="mt-2 rounded-lg bg-[#8C2D19]/10 dark:bg-amber-950/80 p-2 text-xs font-devanagari text-[#6E2211] dark:text-amber-200 border border-[#8C2D19]/20">
                  👉 <strong>क्रिया:</strong> {comp.gesture}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 3. Nyasa Gesture Card (न्यास विधान)
// ============================================================================

interface NyasaCardProps {
  nyasa: NyasaBlock;
}

export const NyasaCard: React.FC<NyasaCardProps> = ({ nyasa }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative my-6 rounded-2xl border-2 border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-neutral-900 to-rose-900/10 p-5 md:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30">
            🛡️
          </span>
          <h3 className="font-serif text-base font-bold text-rose-200">
            {nyasa.title}
          </h3>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs text-rose-300 border border-rose-500/30">
          शरीर रक्षा कवच
        </span>
      </div>

      {/* Nyasa Step Rows */}
      <div className="mt-4 space-y-2.5">
        {nyasa.steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-rose-500/20 bg-rose-950/20 hover:border-rose-400/40 hover:bg-rose-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-lg border border-rose-500/20">
                  {step.icon}
                </span>
                <div>
                  <div className="font-serif text-base font-bold text-rose-100">
                    {step.mantra}
                  </div>
                  <div className="text-xs text-rose-300/80">
                    <strong>स्पर्श स्थल:</strong> {step.gestureTarget} ({step.angam})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-medium text-rose-200/90 bg-rose-900/30 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  {step.instruction}
                </span>
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center border text-[11px] ${
                    isDone
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold'
                      : 'border-rose-500/40 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 4. Upachara Offering Card (Panchopachara, Shodashopachara, Rajopachara, Visheshopachara)
// ============================================================================

interface UpacharaCardProps {
  items: UpacharaItem[];
  title?: string;
  tier?: string;
}

export const UpacharaCard: React.FC<UpacharaCardProps> = ({
  items,
  title = 'उपचारात्मक अर्चनम् (Divine Offerings)',
  tier = 'shodashopachara',
}) => {
  const [offeredIds, setOfferedIds] = useState<Record<string, boolean>>({});

  const toggleOffering = (id: string) => {
    setOfferedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Tier-specific styles
  const isPancho = tier === 'panchopachara';
  const isRajo = tier === 'rajopachara';
  const isVishesha = tier === 'visheshopachara';

  const themeBorder = isPancho
    ? 'border-emerald-500/30'
    : isRajo
    ? 'border-purple-500/30'
    : isVishesha
    ? 'border-cyan-500/30'
    : 'border-amber-500/30';

  const themeBg = isPancho
    ? 'from-emerald-950/20 via-neutral-900 to-emerald-900/10'
    : isRajo
    ? 'from-purple-950/20 via-neutral-900 to-purple-900/10'
    : isVishesha
    ? 'from-cyan-950/20 via-neutral-900 to-cyan-900/10'
    : 'from-amber-950/20 via-neutral-900 to-amber-900/10';

  return (
    <div
      className={`relative my-6 rounded-2xl border-2 ${themeBorder} bg-gradient-to-br ${themeBg} p-5 md:p-6 shadow-xl backdrop-blur-md`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">
            {isPancho ? '🌿' : isRajo ? '👑' : isVishesha ? '💎' : '🌸'}
          </span>
          <h3 className="font-serif text-base font-bold text-neutral-100">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-neutral-300 font-medium">
          {isPancho
            ? 'पञ्चमहाभूत तत्त्व चक्र'
            : isRajo
            ? 'राजसी उत्सव सेवा'
            : isVishesha
            ? 'विशेष तान्त्रिक अर्चन'
            : 'षोडशोपचार चक्र'}
        </span>
      </div>

      {/* Offerings Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const isDone = !!offeredIds[item.id];
          return (
            <div
              key={idx}
              onClick={() => toggleOffering(item.id)}
              className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-white/10 bg-neutral-950/50 hover:border-white/20 hover:bg-neutral-900/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-xl border border-white/10 shadow-inner">
                  {item.sacredIcon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-neutral-100">
                      {item.name}
                    </span>
                    {item.bija && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-300">
                        {item.bija}
                      </span>
                    )}
                    {item.tattva && (
                      <span className="text-[11px] text-neutral-400">
                        ({item.tattva})
                      </span>
                    )}
                  </div>
                  {item.dravya && (
                    <div className="text-xs text-amber-300/80 mt-0.5">
                      <strong>द्रव्य:</strong> {item.dravya}
                    </div>
                  )}
                  {item.vidhiInstruction && (
                    <div className="mt-1 text-xs text-neutral-300 font-medium">
                      👉 {item.vidhiInstruction}
                    </div>
                  )}
                  {item.mantrantaPada && (
                    <div className="mt-1 font-serif text-xs text-amber-400 font-semibold">
                      ॥ {item.mantrantaPada} ॥
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center border text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold'
                    : 'border-white/20 text-transparent hover:border-white/40'
                }`}
              >
                ✓
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 5. Karmakanda Segment Renderer (Master dispatcher)
// ============================================================================

export const KarmakandaSegmentRenderer: React.FC<{ segment: KarmakandaSegment }> = ({
  segment,
}) => {
  switch (segment.type) {
    case 'SANKALPA':
      return segment.sankalpaData ? (
        <LivingSankalpaCard sankalpa={segment.sankalpaData} />
      ) : null;

    case 'VINIYOGA':
      return segment.viniyogaData ? (
        <ViniyogaCard viniyoga={segment.viniyogaData} />
      ) : null;

    case 'NYASA':
      return segment.nyasaData ? <NyasaCard nyasa={segment.nyasaData} /> : null;

    case 'PANCHOPOCHARA':
    case 'SHODASHOPOCHARA':
    case 'RAJOPOCHARA':
    case 'VISHESHOPOCHARA':
      return segment.upacharaItems && segment.upacharaItems.length > 0 ? (
        <UpacharaCard
          items={segment.upacharaItems}
          tier={segment.type.toLowerCase()}
          title={
            segment.type === 'PANCHOPOCHARA'
              ? 'पञ्चोपचार पूजा (The 5 Elements Offerings)'
              : segment.type === 'RAJOPOCHARA'
              ? 'राजोपचार पूजा (Sovereign Royal Offerings)'
              : segment.type === 'VISHESHOPOCHARA'
              ? 'विशेषोपचार पूजा (Special Consecrations)'
              : 'षोडशोपचार पूजा (The 16 Sacred Offerings)'
          }
        />
      ) : null;

    case 'VIDHI_INSTRUCTION':
      return (
        <div className="my-3 flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-950/20 px-4 py-3 text-sky-200">
          <span className="text-xl">👉</span>
          <p className="font-sans text-sm font-medium leading-relaxed">
            {segment.vidhiInstruction || segment.rawText}
          </p>
        </div>
      );

    default:
      return null;
  }
};
