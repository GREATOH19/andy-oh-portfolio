"use client";

import { useEffect } from "react";

export function DebugBodyStyleReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const body = document.body;
    const computed = window.getComputedStyle(body);

    // #region agent log
    fetch("/api/debug-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "8e6652",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "web/components/DebugBodyStyleReporter.tsx:17",
        message: "Computed body background styles",
        data: {
          backgroundColor: computed.backgroundColor,
          backgroundImage: computed.backgroundImage,
          backgroundAttachment: computed.backgroundAttachment,
          backgroundSize: computed.backgroundSize,
          backgroundPosition: computed.backgroundPosition,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}

