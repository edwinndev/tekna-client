"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  KeyboardFlashState,
  KeyDefinition,
  KeyboardLayoutRow,
} from "../types/auth";

export interface InteractiveKeyboardHandle {
  flash: (kind: "error" | "success") => void;
  lightKeyByChar: (char: string) => void;
  lightRandomKey: () => void;
}

interface InteractiveKeyboardProps {
  className?: string;
}

const rawLayout: KeyboardLayoutRow[] = [
  { keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], offsetFactor: 0 },
  { keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"], offsetFactor: 0.5 },
  { keys: ["Z", "X", "C", "V", "B", "N", "M"], offsetFactor: 1.1 },
  { keys: [" "], offsetFactor: 2.4 },
];

export const InteractiveKeyboard = forwardRef<
  InteractiveKeyboardHandle,
  InteractiveKeyboardProps
>(function InteractiveKeyboard({ className = "" }: InteractiveKeyboardProps, ref) {
  const [litKeys, setLitKeys] = useState<Record<string, boolean>>({});
  const [flashState, setFlashState] = useState<KeyboardFlashState>("wave");

  const keysList: KeyDefinition[] = useMemo(() => {
    const list: KeyDefinition[] = [];
    let runningIndex = 0;

    rawLayout.forEach((rowDef: KeyboardLayoutRow, rowIndex: number) => {
      rowDef.keys.forEach((char: string, colIndex: number) => {
        const isSpace = char === " ";
        const percentage = Math.min(
          100,
          Math.max(
            0,
            Math.round(((colIndex + rowDef.offsetFactor) / 10.4) * 100)
          )
        );

        list.push({
          id: isSpace ? "space" : char,
          char: isSpace ? " " : char,
          displayLabel: isSpace ? "" : char,
          row: rowIndex,
          col: colIndex,
          index: runningIndex,
          colorMixPercentage: percentage,
          isSpace,
        });

        runningIndex += 1;
      });
    });

    return list;
  }, []);

  const keysByChar = useMemo(() => {
    const map = new Map<string, KeyDefinition>();
    keysList.forEach((k: KeyDefinition) => {
      map.set(k.char.toUpperCase(), k);
    });
    return map;
  }, [keysList]);

  const lightKey = useCallback((targetKey: KeyDefinition | null) => {
    if (!targetKey) {
      return;
    }
    const keyId = targetKey.id;
    setLitKeys((prev: Record<string, boolean>) => ({
      ...prev,
      [keyId]: true,
    }));

    window.setTimeout(() => {
      setLitKeys((prev: Record<string, boolean>) => {
        if (!prev[keyId]) {
          return prev;
        }
        const updated: Record<string, boolean> = { ...prev };
        delete updated[keyId];
        return updated;
      });
    }, 160);
  }, []);

  const lightRandomKey = useCallback(() => {
    if (keysList.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * keysList.length);
    lightKey(keysList[randomIndex]);
  }, [keysList, lightKey]);

  const lightKeyByChar = useCallback(
    (char: string) => {
      const match = keysByChar.get(char.toUpperCase()) || null;
      if (match) {
        lightKey(match);
      } else {
        lightRandomKey();
      }
    },
    [keysByChar, lightKey, lightRandomKey]
  );

  const flash = useCallback((kind: "error" | "success") => {
    setFlashState(kind);
    window.setTimeout(() => {
      setFlashState("idle");
    }, 1200);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      flash,
      lightKeyByChar,
      lightRandomKey,
    }),
    [flash, lightKeyByChar, lightRandomKey]
  );

  useEffect(() => {
    const waveTimer = window.setTimeout(() => {
      setFlashState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(waveTimer);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (event.key.length !== 1 && event.key !== " ") {
        return;
      }

      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (isInput && activeElement.type === "password") {
        lightRandomKey();
      } else {
        lightKeyByChar(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightKeyByChar, lightRandomKey]);

  const flashColor =
    flashState === "error"
      ? "#ff7a88"
      : flashState === "success"
      ? "#2ee6d6"
      : null;

  return (
    <div
      className={`relative select-none py-6 [perspective:1200px] flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div
        className="grid gap-2.5 origin-[50%_60%] transition-transform duration-700 ease-out [transform:rotateX(26deg)_rotateZ(-7deg)]"
        style={{
          filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.45))",
        }}
      >
        {rawLayout.map((rowDef: KeyboardLayoutRow, rowIndex: number) => {
          const rowKeys = keysList.filter(
            (k: KeyDefinition) => k.row === rowIndex
          );

          const rowMarginLeft =
            rowIndex === 1
              ? "ml-[24px] sm:ml-[30px]"
              : rowIndex === 2
              ? "ml-[52px] sm:ml-[66px]"
              : rowIndex === 3
              ? "ml-[115px] sm:ml-[144px]"
              : "";

          return (
            <div
              key={`row-${rowIndex}`}
              className={`flex gap-2 sm:gap-2.5 ${rowMarginLeft}`}
            >
              {rowKeys.map((keyDef: KeyDefinition) => {
                const isLit = Boolean(litKeys[keyDef.id]);
                const glowColor = `color-mix(in srgb, #2ee6d6 ${
                  100 - keyDef.colorMixPercentage
                }%, #ff4d8d)`;
                const isWaveOrFlashing = flashState !== "idle";

                const keyWidth = keyDef.isSpace
                  ? "w-[240px] sm:w-[300px]"
                  : "w-[42px] h-[42px] sm:w-[54px] sm:h-[54px]";

                const pulseStyle = isWaveOrFlashing
                  ? {
                      animationDelay: `${keyDef.index * 26}ms`,
                      ["--pulse-color" as string]: flashColor || glowColor,
                      ["--glow-color" as string]: glowColor,
                    }
                  : {
                      ["--glow-color" as string]: glowColor,
                    };

                return (
                  <button
                    key={keyDef.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => lightKey(keyDef)}
                    style={pulseStyle}
                    className={`
                      ${keyWidth}
                      relative flex items-center justify-center
                      rounded-[10px] sm:rounded-[12px]
                      font-['Chakra_Petch',sans-serif] font-bold text-sm sm:text-base
                      transition-all duration-150 ease-out cursor-pointer
                      ${
                        isWaveOrFlashing
                          ? "animate-tekna-pulse"
                          : isLit
                          ? "translate-y-[3px] text-white shadow-[0_2px_0_#07050f,0_0_20px_3px_var(--glow-color),inset_0_0_0_1px_var(--glow-color)] bg-gradient-to-b from-[#2e2652] to-[#1d173b]"
                          : "text-[#a8a3c4] hover:text-white bg-gradient-to-b from-[#272047] to-[#1b1634] shadow-[0_5px_0_#07050f,inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_5px_0_#07050f,inset_0_1px_0_rgba(255,255,255,0.15),0_0_12px_rgba(46,230,214,0.15)]"
                      }
                    `}
                  >
                    <span>{keyDef.displayLabel}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
