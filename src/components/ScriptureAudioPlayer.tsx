import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ScriptureAudioTrack } from '../data/durgaSaptashatiAudio.js';

interface ScriptureAudioPlayerProps {
  track: ScriptureAudioTrack;
  readingTheme: 'bhojpatra' | 'golden-birch' | 'dark-slate' | 'ivory-white';
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  hasNextTrack?: boolean;
  hasPrevTrack?: boolean;
  onClose?: () => void;
}

export const ScriptureAudioPlayer: React.FC<ScriptureAudioPlayerProps> = ({
  track,
  readingTheme,
  onNextTrack,
  onPrevTrack,
  hasNextTrack,
  hasPrevTrack,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // When track changes, reset and load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setHasError(false);
      setIsLoading(true);
      audioRef.current.load();
    }
  }, [track.audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        setIsLoading(true);
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setHasError(false);
          })
          .catch((err) => {
            console.warn('Audio play interrupted or blocked:', err);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration || 999999);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlaybackRate = () => {
    const rates = [0.75, 1.0, 1.25];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (hasNextTrack && onNextTrack) {
      onNextTrack();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '००:००';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const mm = m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${mm}:${ss}`;
  };

  // Theme styling palette
  const themeClasses = {
    'bhojpatra': {
      container: 'bg-[#2A1810]/95 border-t border-[#8C2D19]/40 text-[#F5EDE0] shadow-[0_-8px_30px_rgba(28,18,12,0.4)]',
      progressTrack: 'bg-[#4A2E1B]',
      progressFill: 'bg-[#C84B31]',
      badge: 'bg-[#8C2D19]/25 text-[#E6C280] border-[#8C2D19]/50',
      activeBtn: 'bg-[#8C2D19] hover:bg-[#A3351D] text-white',
      secondaryBtn: 'text-[#E6C280] hover:bg-[#3D2217] hover:text-white',
      accentText: 'text-[#E6C280]',
      titleText: 'text-white',
      subText: 'text-[#D4C3B3]',
    },
    'golden-birch': {
      container: 'bg-[#241B12]/95 border-t border-[#A45A2A]/40 text-[#FDFBF7] shadow-[0_-8px_30px_rgba(20,15,10,0.4)]',
      progressTrack: 'bg-[#3E2E20]',
      progressFill: 'bg-[#A45A2A]',
      badge: 'bg-[#A45A2A]/25 text-[#EED8AE] border-[#A45A2A]/50',
      activeBtn: 'bg-[#A45A2A] hover:bg-[#BA6730] text-white',
      secondaryBtn: 'text-[#EED8AE] hover:bg-[#362719] hover:text-white',
      accentText: 'text-[#EED8AE]',
      titleText: 'text-white',
      subText: 'text-[#DDD1C3]',
    },
    'dark-slate': {
      container: 'bg-[#0E131F]/95 border-t border-[#1E293B] text-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]',
      progressTrack: 'bg-slate-800',
      progressFill: 'bg-rose-600',
      badge: 'bg-rose-950/60 text-rose-200 border-rose-800/60',
      activeBtn: 'bg-rose-700 hover:bg-rose-600 text-white',
      secondaryBtn: 'text-slate-300 hover:bg-slate-800 hover:text-white',
      accentText: 'text-rose-300',
      titleText: 'text-white',
      subText: 'text-slate-400',
    },
    'ivory-white': {
      container: 'bg-[#FAF7F2]/95 border-t border-[#D9CFC4] text-[#1C120C] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]',
      progressTrack: 'bg-[#E5DCD0]',
      progressFill: 'bg-[#8C2D19]',
      badge: 'bg-[#8C2D19]/10 text-[#8C2D19] border-[#8C2D19]/30',
      activeBtn: 'bg-[#8C2D19] hover:bg-[#7A1505] text-white',
      secondaryBtn: 'text-[#5C4535] hover:bg-[#EFE7DC] hover:text-[#1C120C]',
      accentText: 'text-[#8C2D19]',
      titleText: 'text-[#1C120C]',
      subText: 'text-[#7D6B5D]',
    },
  }[readingTheme];

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md transition-all duration-300 ${themeClasses.container}`}
    >
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setIsPlaying(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      />

      {/* Progress Bar (Clickable & Scrubbable) */}
      <div className="relative w-full h-1.5 sm:h-2 group cursor-pointer">
        <div className={`absolute inset-0 ${themeClasses.progressTrack}`}>
          <div
            className={`h-full ${themeClasses.progressFill} transition-[width] duration-150 ease-out`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek time"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Track Info & Page Indicator */}
          <div className="flex items-center gap-3 min-w-0 flex-1 max-w-[40%] sm:max-w-[30%]">
            <div className="hidden xs:flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/20 border border-white/10 shrink-0 text-lg shadow-inner">
              🌺
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${themeClasses.badge} font-devanagari shrink-0`}>
                  खण्ड {track.pageNumber}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium truncate ${themeClasses.accentText} font-devanagari`}>
                  {track.chanter}
                </span>
              </div>
              <h3 className={`text-xs sm:text-sm font-bold truncate font-serifDevanagari ${themeClasses.titleText} mt-0.5`}>
                {track.titleSa}
              </h3>
              <p className={`hidden sm:block text-[11px] truncate ${themeClasses.subText} font-devanagari`}>
                {track.titleHi}
              </p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Previous Chapter */}
              <button
                onClick={onPrevTrack}
                disabled={!hasPrevTrack}
                aria-label="Previous Chapter"
                title="पिछला अध्याय"
                className={`p-1.5 sm:p-2 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${themeClasses.secondaryBtn}`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Rewind 10s */}
              <button
                onClick={() => handleSkip(-10)}
                aria-label="Rewind 10 seconds"
                title="१० सेकण्ड पीछे"
                className={`p-1.5 sm:p-2 rounded-xl transition-colors ${themeClasses.secondaryBtn}`}
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Play / Pause Main Button */}
              <button
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'विराम' : 'प्रारम्भ'}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${themeClasses.activeBtn}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Fast Forward 10s */}
              <button
                onClick={() => handleSkip(10)}
                aria-label="Fast forward 10 seconds"
                title="१० सेकण्ड आगे"
                className={`p-1.5 sm:p-2 rounded-xl transition-colors ${themeClasses.secondaryBtn}`}
              >
                <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Next Chapter */}
              <button
                onClick={onNextTrack}
                disabled={!hasNextTrack}
                aria-label="Next Chapter"
                title="अगला अध्याय"
                className={`p-1.5 sm:p-2 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${themeClasses.secondaryBtn}`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Time Stamp Display */}
            <div className={`text-[10px] sm:text-xs font-mono font-medium ${themeClasses.subText} flex items-center gap-1`}>
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{duration > 0 ? formatTime(duration) : track.durationLabel}</span>
            </div>
          </div>

          {/* Right: Rate, Volume & Close Controls */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Speed Rate Selector */}
            <button
              onClick={togglePlaybackRate}
              title="पठन गति (Speed)"
              className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg border border-current/20 transition-colors ${themeClasses.secondaryBtn}`}
            >
              {playbackRate}x
            </button>

            {/* Volume Toggle & Slider */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                title={isMuted ? 'ध्वनि चालू' : 'ध्वनि बन्द'}
                className={`p-1.5 rounded-lg transition-colors ${themeClasses.secondaryBtn}`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="w-16 h-1 rounded-lg accent-[#8C2D19] cursor-pointer"
              />
            </div>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                title="ऑडियो बन्द करें"
                className={`p-1.5 sm:p-2 rounded-xl transition-colors ${themeClasses.secondaryBtn}`}
              >
                <span className="text-xs font-semibold">✕</span>
              </button>
            )}
          </div>

        </div>

        {/* Error Notification if Network/Stream fails */}
        {hasError && (
          <div className="mt-2 text-xs text-rose-300 bg-rose-950/70 border border-rose-800/80 px-3 py-1.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>ऑडियो लोड करने में समस्या हुई। इंटरनेट सम्बद्धता जाँचें या पुनः प्रयास करें।</span>
            </div>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                audioRef.current?.load();
                audioRef.current?.play().catch(() => setIsLoading(false));
              }}
              className="text-[11px] underline font-bold hover:text-white"
            >
              पुनः प्रयास
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
