"use client";

import * as React from "react";

import Landing from "@/components/clubs/template/landing";
import type { ClubLandingContent } from "@/data/clubs";
import {
  CLUB_LANDING_PREVIEW_MESSAGE_TYPE,
} from "@/lib/club-landing-preview";
import { clubLandingStoragePayloadSchema } from "@/lib/validators/club-landing";

/**
 * Minimal receiver used inside `/preview/club-landing` iframe; applies theme tokens on `<html>`.
 */
export function ClubLandingPreviewClient(): React.JSX.Element {
  const [model, setModel] = React.useState<ClubLandingContent | null>(null);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const data = event.data as { type?: string; payload?: unknown };
      if (data?.type !== CLUB_LANDING_PREVIEW_MESSAGE_TYPE) {
        return;
      }
      const parsed = clubLandingStoragePayloadSchema.safeParse(data.payload);
      if (!parsed.success) {
        return;
      }
      setModel({
        id: 0,
        ...parsed.data,
      });
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: `${CLUB_LANDING_PREVIEW_MESSAGE_TYPE}:ready` }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  React.useLayoutEffect(() => {
    if (!model) {
      return;
    }
    document.documentElement.setAttribute("data-color-theme", model.colorThemeId);
  }, [model]);

  if (!model) {
    return (
      <div className="flex min-h-[320px] items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        Waiting for preview content from the editor…
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <Landing isAuthenticated={false} clubLandingContent={model} />
    </div>
  );
}
