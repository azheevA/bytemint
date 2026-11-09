"use client";

import { useEffect } from "react";
import { monetization } from "@/config/monetization";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSlot({ slot }: { slot: string | null }) {
  useEffect(() => {
    if (!monetization.adsenseClient || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and incomplete ad configuration should not break the tools.
    }
  }, [slot]);

  if (monetization.adsenseClient && slot) {
    return (
      <div className="ad-frame" aria-label="Advertisement">
        <span className="ad-label">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "90px" }}
          data-ad-client={monetization.adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (process.env.NODE_ENV !== "production") {
    return (
      <div className="ad-placeholder">
        Ad placement · connect an approved ad network to enable
      </div>
    );
  }

  return null;
}
