"use client";

/**
 * Reference only: React port of the "Clap" face demo from inbox/monklap/index.html.
 * Not imported anywhere. To use it, move it to web/components/ and render it from a
 * route or a new story block. Mirrors the device logic:
 * rest → wake → smile → pulse (1.5 s of mist) → rest.
 */
import {useEffect, useRef, useState} from "react";

type FaceState = "rest" | "wake" | "smile" | "pulse";

const STEPS: {state: FaceState; label: string; ms: number}[] = [
  {state: "wake", label: "Wake — someone near + a clap.", ms: 500},
  {state: "smile", label: "Smile — it recognized the clap.", ms: 600},
  {state: "pulse", label: "Pulse — 1.5 s of mist.", ms: 1500},
  {state: "rest", label: "Rest — nobody near.", ms: 0},
];

export default function ClapDemo() {
  const [state, setState] = useState<FaceState>("rest");
  const [label, setLabel] = useState("Rest — nobody near.");
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function clap() {
    if (busy) return;
    setBusy(true);
    let delay = 0;
    STEPS.forEach((step, i) => {
      timers.current.push(
        setTimeout(() => {
          setState(step.state);
          setLabel(step.label);
          if (i === STEPS.length - 1) setBusy(false);
        }, delay),
      );
      delay += step.ms;
    });
  }

  const awake = state !== "rest";
  const happy = state === "smile" || state === "pulse";

  return (
    <div className="mk-clap" aria-label="Interactive demo of the Monklap face">
      <div className="mk-face" aria-hidden="true" style={{opacity: awake ? 1 : 0.45}}>
        <span className="mk-eye mk-eye-l" style={eyeStyle(state)} />
        <span className="mk-eye mk-eye-r" style={eyeStyle(state)} />
        <span className="mk-mouth" style={{opacity: happy ? 1 : 0}} />
        <span className={state === "pulse" ? "mk-mist mk-mist-on" : "mk-mist"} />
      </div>
      <div>
        <button type="button" onClick={clap} disabled={busy}>
          Clap
        </button>
        <small aria-live="polite">{label}</small>
      </div>
      <style>{CSS}</style>
    </div>
  );
}

function eyeStyle(state: FaceState): React.CSSProperties {
  if (state === "wake") return {height: 16, top: 22};
  if (state === "smile" || state === "pulse") return {height: 5, top: 28, borderRadius: 6};
  return {};
}

const CSS = `
.mk-clap { display: flex; align-items: center; gap: 22px; max-width: 520px; padding: 20px 24px;
  border: 1px solid #ddd2bf; border-radius: 18px; background: #f1eadc; }
.mk-clap button { font: inherit; font-weight: 600; cursor: pointer; border: 0; border-radius: 999px;
  padding: 10px 20px; background: #d9622b; color: #fff; }
.mk-clap button:disabled { opacity: .6; cursor: default; }
.mk-clap small { display: block; margin-top: 8px; color: #6f6558; }
.mk-face { position: relative; flex: none; width: 72px; height: 72px; border-radius: 18px;
  background: #0d0d0d; transition: opacity .3s; }
.mk-eye { position: absolute; top: 24px; width: 12px; height: 12px; border-radius: 50%;
  background: #7ee3ff; transition: height .2s, top .2s; }
.mk-eye-l { left: 18px; } .mk-eye-r { right: 18px; }
.mk-mouth { position: absolute; left: 50%; bottom: 14px; width: 24px; height: 8px;
  transform: translateX(-50%); border-bottom: 3px solid #7ee3ff; border-radius: 0 0 14px 14px;
  transition: opacity .2s; }
.mk-mist { position: absolute; left: 50%; bottom: -14px; width: 36px; height: 14px; opacity: 0;
  transform: translateX(-50%); background: radial-gradient(closest-side, rgba(126,227,255,.55), transparent); }
.mk-mist-on { animation: mk-mist 1.5s ease-out; }
@keyframes mk-mist { 0% { opacity: 0; transform: translate(-50%, 0) scale(.6); } 25% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 14px) scale(1.5); } }
@media (prefers-reduced-motion: reduce) { .mk-mist-on { animation: none; opacity: .8; } }
`;
