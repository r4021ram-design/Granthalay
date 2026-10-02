/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - श्लोक-चयन हुक (Interactive Shloka Selection Hook)
 * Detects user text selection / taps on shlokas with bounding rectangles & context
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';

export interface ShlokaSelectionState {
  selectedText: string;
  selectionRect: DOMRect | null;
  isActive: boolean;
  shlokaNumber?: number;
}

export function useShlokaSelection(containerRef?: React.RefObject<HTMLElement | null>) {
  const [selectionState, setSelectionState] = useState<ShlokaSelectionState>({
    selectedText: '',
    selectionRect: null,
    isActive: false,
  });

  const clearSelection = useCallback(() => {
    setSelectionState({
      selectedText: '',
      selectionRect: null,
      isActive: false,
    });
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
      }
    }
  }, []);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 3) {
      return;
    }

    // Verify selection is within container if containerRef is provided
    if (containerRef && containerRef.current) {
      const anchorNode = selection.anchorNode;
      if (anchorNode && !containerRef.current.contains(anchorNode)) {
        return;
      }
    }

    // Extract shloka number if present in text (e.g. ॥ १ ॥, ॥ १२ ॥, or [1], 1.)
    let shlokaNum: number | undefined;
    const devanagariNumMatch = text.match(/॥\s*([०-९\d]+)\s*॥/);
    if (devanagariNumMatch) {
      const rawNum = devanagariNumMatch[1];
      const parsed = parseInt(
        rawNum.replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d))),
        10
      );
      if (!isNaN(parsed)) shlokaNum = parsed;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectionState({
        selectedText: text,
        selectionRect: rect,
        isActive: true,
        shlokaNumber: shlokaNum,
      });
    } catch {
      // Ignore range error if selection is destroyed mid-drag
    }
  }, [containerRef]);

  useEffect(() => {
    const onMouseUp = () => {
      // Give a tiny timeout for selection to settle
      setTimeout(handleSelection, 20);
    };

    const onTouchEnd = () => {
      setTimeout(handleSelection, 50);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [handleSelection, clearSelection]);

  return {
    ...selectionState,
    clearSelection,
    setDirectSelection: (text: string, rect: DOMRect, shlokaNum?: number) => {
      setSelectionState({
        selectedText: text,
        selectionRect: rect,
        isActive: true,
        shlokaNumber: shlokaNum,
      });
    },
  };
}
