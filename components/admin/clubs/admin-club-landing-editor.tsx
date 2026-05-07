"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, GripVertical } from "lucide-react";
import Link from "next/link";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JoinContent, LoginContent } from "@/data/club-landing-types";
import {
  DEFAULT_LANDING_SECTION_ORDER,
  DEFAULT_LANDING_SECTION_VISIBILITY,
  type LandingSectionKey,
} from "@/data/club-landing-types";
import { COLOR_THEME_OPTIONS, type ColorThemeId } from "@/lib/color-themes";
import { CLUB_LANDING_PREVIEW_MESSAGE_TYPE } from "@/lib/club-landing-preview";
import {
  getClubLandingTemplatePayload,
  listClubLandingTemplates,
} from "@/lib/club-landing-templates";
import { cn } from "@/lib/utils";
import { clubLandingStoragePayloadSchema } from "@/lib/validators/club-landing";
import type { ClubLandingStoragePayloadInput } from "@/lib/validators/club-landing";

type ClubLandingEditorProps = {
  clubId: string;
};

type WorkspaceClub = {
  id: string;
  name: string;
  slug: string;
  publishedLandingVariationId: string | null;
  publishedLandingRevisionId: string | null;
  legacyLandingContent: unknown;
};

type WorkspaceVariationSummary = {
  id: string;
  key: string;
  displayName: string;
  revisionCount: number;
  isPublishedLive: boolean;
};

type WorkspaceRevisionSummary = {
  id: string;
  variationId: string;
  note: string | null;
  createdAt: string;
  createdByUserId: string | null;
  isPublished: boolean;
};

type WorkspaceResponse = {
  club: WorkspaceClub;
  variations: WorkspaceVariationSummary[];
  selectedVariationId: string;
  selectedRevisionId: string | null;
  revisions: WorkspaceRevisionSummary[];
  landingContent: unknown;
};

const DEFAULT_JOIN: JoinContent = {
  headline: "Member access",
  preHeadline: "Join",
  subheadline: "Complete signup to unlock your membership.",
  form: {
    headline: "Create your account",
    subheadline: "Use your email and a secure password.",
    submitButtonLabel: "Continue",
  },
};

const DEFAULT_LOGIN: LoginContent = {
  headline: "Welcome back",
  preHeadline: "Sign in",
  subheadline: "Access your membership hub.",
  form: {
    headline: "Sign in",
    subheadline: "Use your member credentials.",
    submitButtonLabel: "Continue",
  },
};

const SAVED_TEMPLATE_VALUE = "__saved__";

/** Formats an ISO timestamp for revision picker labels. */
function formatRevisionOptionTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function withDefaultSections(
  payload: ClubLandingStoragePayloadInput,
): ClubLandingStoragePayloadInput {
  return {
    ...payload,
    sections: {
      ...DEFAULT_LANDING_SECTION_VISIBILITY,
      ...(payload.sections ?? {}),
    },
    sectionOrder: payload.sectionOrder ?? DEFAULT_LANDING_SECTION_ORDER,
  };
}

const textareaClass =
  "min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

type LandingFormSectionProps = {
  title: string;
  /** When true, section starts expanded. */
  defaultOpen?: boolean;
  titleClassName?: string;
  contentClassName?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Collapsible card section for the landing editor (collapsed by default unless `defaultOpen`).
 */
function LandingFormSection({
  title,
  defaultOpen = false,
  titleClassName,
  contentClassName,
  headerLeft,
  headerRight,
  children,
}: LandingFormSectionProps): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);
  const headingId = React.useId();
  const panelId = `${headingId}-panel`;

  return (
    <Card>
      <CardHeader className="space-y-0 p-0">
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
          {headerLeft ? <div className="shrink-0">{headerLeft}</div> : null}
          <button
            id={headingId}
            type="button"
            className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
          >
            <CardTitle className={cn(titleClassName)}>{title}</CardTitle>
          </button>
          {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
          >
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </div>
      </CardHeader>
      {open ? (
        <CardContent
          id={panelId}
          aria-labelledby={headingId}
          role="region"
          className={cn(contentClassName)}
        >
          {children}
        </CardContent>
      ) : null}
    </Card>
  );
}

function pushPreview(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  payload: ClubLandingStoragePayloadInput | null,
): void {
  const win = iframeRef.current?.contentWindow;
  if (!win || !payload) {
    return;
  }
  win.postMessage(
    { type: CLUB_LANDING_PREVIEW_MESSAGE_TYPE, payload },
    window.location.origin,
  );
}

/**
 * Structured landing editor with standard templates, theme selection, and live iframe preview.
 */
export function AdminClubLandingEditor({
  clubId,
}: ClubLandingEditorProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const draftRef = React.useRef<ClubLandingStoragePayloadInput | null>(null);

  const templates = React.useMemo(() => listClubLandingTemplates(), []);
  const defaultTemplateSlug = templates[0]?.slug ?? "";

  const [draft, setDraft] =
    React.useState<ClubLandingStoragePayloadInput | null>(null);
  const [templateSlug, setTemplateSlug] =
    React.useState<string>(defaultTemplateSlug);
  const [message, setMessage] = React.useState<string>("");
  const [validationError, setValidationError] = React.useState<string>("");
  const [saveNote, setSaveNote] = React.useState<string>("");
  const [publishAfterSave, setPublishAfterSave] = React.useState(false);
  const [workspaceVariationId, setWorkspaceVariationId] = React.useState<
    string | undefined
  >();
  const [workspaceRevisionId, setWorkspaceRevisionId] = React.useState<
    string | undefined
  >();
  const hydrateKeyRef = React.useRef<string>("");

  draftRef.current = draft;

  const workspaceQuery = useQuery({
    queryKey: [
      "admin-club-landing-workspace",
      clubId,
      workspaceVariationId,
      workspaceRevisionId,
    ],
    queryFn: async (): Promise<WorkspaceResponse> => {
      const params = new URLSearchParams();
      if (workspaceVariationId) params.set("variationId", workspaceVariationId);
      if (workspaceRevisionId) params.set("revisionId", workspaceRevisionId);
      const qs = params.toString();
      const url = `/api/admin/clubs/${clubId}/landing/workspace${qs ? `?${qs}` : ""}`;
      const response = await fetch(url);
      const payload = (await response.json()) as WorkspaceResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load landing workspace.");
      }
      return payload;
    },
  });

  React.useEffect(() => {
    const ws = workspaceQuery.data;
    if (!ws) {
      return;
    }

    const revisionPart = ws.selectedRevisionId ?? "none";
    const nextHydrateKey = `${ws.selectedVariationId}:${revisionPart}`;
    if (hydrateKeyRef.current === nextHydrateKey) {
      return;
    }
    hydrateKeyRef.current = nextHydrateKey;

    const club = ws.club;

    const tryApplyPayload = (payload: unknown): boolean => {
      if (payload == null || typeof payload !== "object") {
        return false;
      }
      const parsed = clubLandingStoragePayloadSchema.safeParse(payload);
      if (!parsed.success) {
        return false;
      }
      setDraft({
        ...withDefaultSections(parsed.data),
        name: parsed.data.name.trim() ? parsed.data.name : club.name,
      });
      setTemplateSlug(SAVED_TEMPLATE_VALUE);
      return true;
    };

    if (tryApplyPayload(ws.landingContent)) {
      return;
    }

    if (tryApplyPayload(club.legacyLandingContent)) {
      return;
    }

    const slug = defaultTemplateSlug;
    const base = slug ? getClubLandingTemplatePayload(slug) : null;
    if (base) {
      setDraft(
        withDefaultSections({ ...structuredClone(base), name: club.name }),
      );
      setTemplateSlug(slug);
    }
  }, [workspaceQuery.data, defaultTemplateSlug]);

  React.useEffect(() => {
    if (!draft) {
      return;
    }
    pushPreview(iframeRef, draft);
  }, [draft]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === `${CLUB_LANDING_PREVIEW_MESSAGE_TYPE}:ready`) {
        pushPreview(iframeRef, draftRef.current);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (input: {
      landingContent: ClubLandingStoragePayloadInput;
      publish: boolean;
      note?: string;
    }) => {
      const ws = workspaceQuery.data;
      if (!ws) {
        throw new Error("Workspace not loaded.");
      }
      const response = await fetch(
        `/api/admin/clubs/${clubId}/landing/revisions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variationId: ws.selectedVariationId,
            landingContent: input.landingContent,
            note: input.note,
            publish: input.publish,
          }),
        },
      );
      const payload = (await response.json()) as {
        error?: string;
        details?: unknown;
      };
      if (!response.ok) {
        const detail =
          payload.details != null ? ` ${JSON.stringify(payload.details)}` : "";
        throw new Error(`${payload.error ?? "Save failed."}${detail}`);
      }
    },
    onSuccess: async (_, variables) => {
      setValidationError("");
      setSaveNote("");
      setPublishAfterSave(false);
      setWorkspaceRevisionId(undefined);
      setMessage(
        variables.publish
          ? "Saved revision and published live."
          : "Saved new revision.",
      );
      await queryClient.invalidateQueries({
        queryKey: ["admin-club-landing-workspace", clubId],
      });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const ws = workspaceQuery.data;
      if (!ws?.selectedRevisionId) {
        throw new Error("Select a revision to publish.");
      }
      const response = await fetch(
        `/api/admin/clubs/${clubId}/landing/publish`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variationId: ws.selectedVariationId,
            revisionId: ws.selectedRevisionId,
          }),
        },
      );
      const payload = (await response.json()) as {
        error?: string;
        details?: unknown;
      };
      if (!response.ok) {
        const detail =
          payload.details != null ? ` ${JSON.stringify(payload.details)}` : "";
        throw new Error(`${payload.error ?? "Publish failed."}${detail}`);
      }
    },
    onSuccess: async () => {
      setMessage("Published selected revision to the live club page.");
      await queryClient.invalidateQueries({
        queryKey: ["admin-club-landing-workspace", clubId],
      });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/admin/clubs/${clubId}/landing/unpublish`,
        {
          method: "DELETE",
        },
      );
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unpublish failed.");
      }
    },
    onSuccess: async () => {
      setMessage(
        "Unpublished — discover will use legacy JSON or static defaults.",
      );
      await queryClient.invalidateQueries({
        queryKey: ["admin-club-landing-workspace", clubId],
      });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const createVariationMutation = useMutation({
    mutationFn: async (body: { key: string; displayName: string }) => {
      const response = await fetch(
        `/api/admin/clubs/${clubId}/landing/variations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const payload = (await response.json()) as {
        error?: string;
        details?: unknown;
        variation?: { id: string };
      };
      if (!response.ok) {
        const detail =
          payload.details != null ? ` ${JSON.stringify(payload.details)}` : "";
        throw new Error(
          `${payload.error ?? "Failed to create variation."}${detail}`,
        );
      }
      if (!payload.variation?.id) {
        throw new Error("Invalid response from server.");
      }
      return payload.variation;
    },
    onSuccess: async (variation, variables) => {
      setValidationError("");
      setMessage(`Created variation “${variables.displayName}”.`);
      setWorkspaceVariationId(variation.id);
      setWorkspaceRevisionId(undefined);
      await queryClient.invalidateQueries({
        queryKey: ["admin-club-landing-workspace", clubId],
      });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const update = React.useCallback(
    (patch: Partial<ClubLandingStoragePayloadInput>): void => {
      setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    [],
  );

  const setSectionVisibility = React.useCallback(
    (
      key: keyof typeof DEFAULT_LANDING_SECTION_VISIBILITY,
      visible: boolean,
    ): void => {
      setDraft((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          sections: {
            ...DEFAULT_LANDING_SECTION_VISIBILITY,
            ...(prev.sections ?? {}),
            [key]: visible,
          },
        };
      });
    },
    [],
  );

  const [draggingSection, setDraggingSection] =
    React.useState<LandingSectionKey | null>(null);

  const setSectionOrder = React.useCallback(
    (nextOrder: LandingSectionKey[]): void => {
      setDraft((prev) => {
        if (!prev) {
          return prev;
        }
        return { ...prev, sectionOrder: nextOrder };
      });
    },
    [],
  );

  const moveSection = React.useCallback(
    (from: LandingSectionKey, to: LandingSectionKey): void => {
      if (from === to) {
        return;
      }
      const currentOrder =
        (draft?.sectionOrder as LandingSectionKey[] | undefined) ??
        DEFAULT_LANDING_SECTION_ORDER;
      const next = currentOrder.slice();
      const fromIndex = next.indexOf(from);
      const toIndex = next.indexOf(to);
      if (fromIndex < 0 || toIndex < 0) {
        return;
      }
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      setSectionOrder(next);
    },
    [draft?.sectionOrder, setSectionOrder],
  );

  if (workspaceQuery.isPending && !workspaceQuery.data) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">Loading club landing…</p>
        </CardContent>
      </Card>
    );
  }

  if (workspaceQuery.isError) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-destructive">
            {(workspaceQuery.error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
  }

  const ws = workspaceQuery.data;
  if (!ws) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">
            Could not load workspace.
          </p>
        </CardContent>
      </Card>
    );
  }

  const club = ws.club;

  if (!draft) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">Preparing editor…</p>
        </CardContent>
      </Card>
    );
  }

  const activeSectionOrder =
    (draft.sectionOrder as LandingSectionKey[] | undefined) ??
    DEFAULT_LANDING_SECTION_ORDER;
  const sectionOrderIndex = Object.fromEntries(
    activeSectionOrder.map((key, index) => [key, index]),
  ) as Record<LandingSectionKey, number>;

  const mutationsBusy =
    saveMutation.isPending ||
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    createVariationMutation.isPending;

  const onPickTemplate = (slug: string): void => {
    if (slug === SAVED_TEMPLATE_VALUE) {
      return;
    }
    if (slug === templateSlug) {
      return;
    }
    const next = getClubLandingTemplatePayload(slug);
    if (!next) {
      return;
    }
    if (
      !window.confirm(
        "Replace all fields with this standard layout? Unsaved edits in the form will be overwritten.",
      )
    ) {
      return;
    }
    setDraft(
      withDefaultSections({ ...structuredClone(next), name: club.name }),
    );
    setTemplateSlug(slug);
    setValidationError("");
    setMessage("");
  };

  const onSaveRevision = (): void => {
    setMessage("");
    if (!draft) {
      setValidationError("Nothing to save yet.");
      return;
    }
    const parsed = clubLandingStoragePayloadSchema.safeParse(draft);
    if (!parsed.success) {
      setValidationError(JSON.stringify(parsed.error.flatten(), null, 2));
      return;
    }
    setValidationError("");
    saveMutation.mutate({
      landingContent: parsed.data,
      publish: publishAfterSave,
      note: saveNote.trim() || undefined,
    });
  };

  const onPublishSelected = (): void => {
    setMessage("");
    publishMutation.mutate();
  };

  const onUnpublishLive = (): void => {
    setMessage("");
    if (
      !window.confirm(
        "Remove the published landing from the live discover page? Visitors will fall back to legacy JSON or bundled defaults.",
      )
    ) {
      return;
    }
    unpublishMutation.mutate();
  };

  const onCreateVariation = (): void => {
    setMessage("");
    const key = window
      .prompt("Variation key (lowercase letters, numbers, hyphens only)", "")
      ?.trim()
      .toLowerCase();
    if (!key) {
      return;
    }
    const displayName = window.prompt("Display name", key)?.trim();
    if (!displayName) {
      return;
    }
    createVariationMutation.mutate({ key, displayName });
  };

  const revisionSelectClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  /* PanelGroup sets inline height:100%; this wrapper uses a definite viewport height so that resolves. */
  return (
    <div className="flex h-[calc(100dvh-8.75rem)] min-h-[480px] w-full min-w-0 shrink-0 flex-col overflow-hidden">
      <PanelGroup
        autoSaveId={`admin-club-landing-split:${clubId}`}
        direction="horizontal"
        className="min-h-0 min-w-0 flex-1"
      >
        <Panel
          defaultSize={52}
          minSize={22}
          maxSize={78}
          className="flex min-h-0 min-w-0 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-3 pb-6 pt-1 sm:px-4">
            <LandingFormSection
              title="Club landing"
              defaultOpen
              contentClassName="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Editing{" "}
                <span className="font-medium text-foreground">{club.name}</span>{" "}
                — slug{" "}
                <span className="font-mono text-foreground">{club.slug}</span> (
                <Link
                  className="underline"
                  href={`/discover/clubs/${club.slug}`}
                >
                  live page
                </Link>
                ).
              </p>

              {club.publishedLandingRevisionId ? (
                <p className="text-xs text-muted-foreground">
                  Live site points at variation{" "}
                  <span className="font-mono">
                    {ws.variations.find(
                      (v) => v.id === club.publishedLandingVariationId,
                    )?.key ?? club.publishedLandingVariationId?.slice(0, 8)}
                  </span>
                  , revision{" "}
                  <span className="font-mono">
                    {club.publishedLandingRevisionId.slice(0, 8)}…
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nothing published — discover uses legacy JSON or bundled
                  defaults until you publish a revision.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="landing-variation">Variation</Label>
                  <div className="flex flex-wrap items-end gap-2">
                    <Select
                      value={ws.selectedVariationId}
                      onValueChange={(id) => {
                        setWorkspaceVariationId(id);
                        setWorkspaceRevisionId(undefined);
                      }}
                    >
                      <SelectTrigger
                        id="landing-variation"
                        className="max-w-md flex-1"
                      >
                        <SelectValue placeholder="Variation" />
                      </SelectTrigger>
                      <SelectContent>
                        {ws.variations.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {`${v.displayName} (${v.key})${v.isPublishedLive ? " — live" : ""}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={mutationsBusy}
                      onClick={onCreateVariation}
                    >
                      New variation
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Variations hold separate histories; publish one revision per
                    club for the public page.
                  </p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="landing-revision">Revision</Label>
                  <select
                    id="landing-revision"
                    className={revisionSelectClass}
                    value={ws.selectedRevisionId ?? ""}
                    disabled={ws.revisions.length === 0}
                    onChange={(event) => {
                      const next = event.target.value;
                      setWorkspaceRevisionId(next ? next : undefined);
                    }}
                  >
                    {ws.revisions.length === 0 ? (
                      <option value="">
                        No revisions yet — save to create the first
                      </option>
                    ) : (
                      ws.revisions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {formatRevisionOptionTimestamp(r.createdAt)}
                          {r.note ? ` — ${r.note}` : ""}
                          {r.isPublished ? " (live)" : ""}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Standard layout</Label>
                  <Select
                    value={templateSlug}
                    onValueChange={(value) => {
                      if (value === SAVED_TEMPLATE_VALUE) {
                        return;
                      }
                      onPickTemplate(value);
                    }}
                  >
                    <SelectTrigger aria-label="Standard landing layout">
                      <SelectValue placeholder="Choose layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateSlug === SAVED_TEMPLATE_VALUE ? (
                        <SelectItem value={SAVED_TEMPLATE_VALUE}>
                          Saved content
                        </SelectItem>
                      ) : null}
                      {templates.map((t) => (
                        <SelectItem key={t.slug} value={t.slug}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Starts from a bundled design; you can edit every field
                    below.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Color theme</Label>
                  <Select
                    value={draft.colorThemeId}
                    onValueChange={(id) =>
                      update({ colorThemeId: id as ColorThemeId })
                    }
                  >
                    <SelectTrigger aria-label="Color theme">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_THEME_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landing-club-name">Display name</Label>
                <Input
                  id="landing-club-name"
                  value={draft.name}
                  onChange={(event) => update({ name: event.target.value })}
                />
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <Label htmlFor="landing-revision-note">
                  Revision note (optional)
                </Label>
                <Input
                  id="landing-revision-note"
                  value={saveNote}
                  placeholder="e.g. Hero copy refresh"
                  disabled={mutationsBusy}
                  onChange={(event) => setSaveNote(event.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input"
                  checked={publishAfterSave}
                  disabled={mutationsBusy}
                  onChange={(event) =>
                    setPublishAfterSave(event.target.checked)
                  }
                />
                Publish immediately after save
              </label>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={onSaveRevision}
                  disabled={mutationsBusy}
                >
                  {saveMutation.isPending ? "Saving…" : "Save new revision"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={mutationsBusy || !ws.selectedRevisionId}
                  onClick={onPublishSelected}
                >
                  {publishMutation.isPending
                    ? "Publishing…"
                    : "Publish selected revision"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={mutationsBusy || !club.publishedLandingRevisionId}
                  onClick={onUnpublishLive}
                >
                  {unpublishMutation.isPending
                    ? "Unpublishing…"
                    : "Unpublish live landing"}
                </Button>
              </div>
              {validationError ? (
                <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-destructive">
                  {validationError}
                </pre>
              ) : null}
              {message ? (
                <p className="text-sm text-muted-foreground">{message}</p>
              ) : null}
            </LandingFormSection>

            <div
              style={{ order: sectionOrderIndex.hero + 1 }}
              className={cn(
                "rounded-xl transition-colors",
                draggingSection === "hero" && "ring-1 ring-primary/40",
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingSection) {
                  moveSection(draggingSection, "hero");
                }
              }}
            >
              <LandingFormSection
                title="Hero"
                titleClassName="text-base"
                contentClassName="grid gap-4 sm:grid-cols-2"
                headerLeft={
                  <button
                    type="button"
                    draggable
                    title="Drag to reorder section"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    onDragStart={(event) => {
                      setDraggingSection("hero");
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", "hero");
                    }}
                    onDragEnd={() => setDraggingSection(null)}
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>
                }
                headerRight={
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="size-3.5 rounded border-input"
                      checked={draft.sections?.hero ?? true}
                      onChange={(event) =>
                        setSectionVisibility("hero", event.target.checked)
                      }
                    />
                    Show
                  </label>
                }
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label>Headline</Label>
                  <Input
                    value={draft.hero.headline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        hero: { ...draft.hero, headline: event.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Subheadline</Label>
                  <textarea
                    className={textareaClass}
                    value={draft.hero.subheadline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        hero: {
                          ...draft.hero,
                          subheadline: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={draft.hero.tagline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        hero: { ...draft.hero, tagline: event.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background image URL</Label>
                  <Input
                    value={draft.hero.backgroundImage.src}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        hero: {
                          ...draft.hero,
                          backgroundImage: {
                            ...draft.hero.backgroundImage,
                            src: event.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Background alt text</Label>
                  <Input
                    value={draft.hero.backgroundImage.alt}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        hero: {
                          ...draft.hero,
                          backgroundImage: {
                            ...draft.hero.backgroundImage,
                            alt: event.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label className="mb-0">Hero buttons</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          hero: {
                            ...draft.hero,
                            cta: {
                              items: [
                                ...draft.hero.cta.items,
                                { label: "New link", href: "/" },
                              ],
                            },
                          },
                        })
                      }
                    >
                      Add button
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {draft.hero.cta.items.map((item, index) => (
                      <li
                        key={`hero-cta-${index}`}
                        className="flex flex-wrap gap-2 rounded-md border border-border p-3"
                      >
                        <Input
                          className="min-w-[8rem] flex-1"
                          placeholder="Label"
                          value={item.label}
                          onChange={(event) => {
                            const items = draft.hero.cta.items.slice();
                            items[index] = {
                              ...items[index],
                              label: event.target.value,
                            };
                            setDraft({
                              ...draft,
                              hero: { ...draft.hero, cta: { items } },
                            });
                          }}
                        />
                        <Input
                          className="min-w-[10rem] flex-[2]"
                          placeholder="URL"
                          value={item.href}
                          onChange={(event) => {
                            const items = draft.hero.cta.items.slice();
                            items[index] = {
                              ...items[index],
                              href: event.target.value,
                            };
                            setDraft({
                              ...draft,
                              hero: { ...draft.hero, cta: { items } },
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={draft.hero.cta.items.length <= 1}
                          onClick={() => {
                            const items = draft.hero.cta.items.filter(
                              (_, i) => i !== index,
                            );
                            setDraft({
                              ...draft,
                              hero: { ...draft.hero, cta: { items } },
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </LandingFormSection>
            </div>

            <div
              style={{ order: sectionOrderIndex.benefits + 1 }}
              className={cn(
                "rounded-xl transition-colors",
                draggingSection === "benefits" && "ring-1 ring-primary/40",
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingSection) {
                  moveSection(draggingSection, "benefits");
                }
              }}
            >
              <LandingFormSection
                title="Benefits"
                titleClassName="text-base"
                contentClassName="space-y-4"
                headerLeft={
                  <button
                    type="button"
                    draggable
                    title="Drag to reorder section"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    onDragStart={(event) => {
                      setDraggingSection("benefits");
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", "benefits");
                    }}
                    onDragEnd={() => setDraggingSection(null)}
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>
                }
                headerRight={
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="size-3.5 rounded border-input"
                      checked={draft.sections?.benefits ?? true}
                      onChange={(event) =>
                        setSectionVisibility("benefits", event.target.checked)
                      }
                    />
                    Show
                  </label>
                }
              >
                <div className="space-y-2">
                  <Label>Section headline</Label>
                  <Input
                    value={draft.benefits.headline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        benefits: {
                          ...draft.benefits,
                          headline: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section subheadline</Label>
                  <textarea
                    className={textareaClass}
                    value={draft.benefits.subheadline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        benefits: {
                          ...draft.benefits,
                          subheadline: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        benefits: {
                          ...draft.benefits,
                          items: [
                            ...draft.benefits.items,
                            {
                              icon: "star",
                              image: { src: "", alt: "" },
                              headline: "New benefit",
                              subheadline: "Describe the benefit.",
                            },
                          ],
                        },
                      })
                    }
                  >
                    Add benefit
                  </Button>
                </div>
                <ul className="space-y-4">
                  {draft.benefits.items.map((item, index) => (
                    <li
                      key={`benefit-${index}`}
                      className="space-y-3 rounded-md border border-border p-4"
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          Benefit {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={draft.benefits.items.length <= 1}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              benefits: {
                                ...draft.benefits,
                                items: draft.benefits.items.filter(
                                  (_, i) => i !== index,
                                ),
                              },
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Icon (Material symbol name)
                          </Label>
                          <Input
                            value={item.icon}
                            onChange={(event) => {
                              const items = draft.benefits.items.slice();
                              items[index] = {
                                ...items[index],
                                icon: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                benefits: { ...draft.benefits, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Image URL</Label>
                          <Input
                            value={item.image.src}
                            onChange={(event) => {
                              const items = draft.benefits.items.slice();
                              items[index] = {
                                ...items[index],
                                image: {
                                  ...items[index].image,
                                  src: event.target.value,
                                },
                              };
                              setDraft({
                                ...draft,
                                benefits: { ...draft.benefits, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Image alt</Label>
                          <Input
                            value={item.image.alt}
                            onChange={(event) => {
                              const items = draft.benefits.items.slice();
                              items[index] = {
                                ...items[index],
                                image: {
                                  ...items[index].image,
                                  alt: event.target.value,
                                },
                              };
                              setDraft({
                                ...draft,
                                benefits: { ...draft.benefits, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Headline</Label>
                          <Input
                            value={item.headline}
                            onChange={(event) => {
                              const items = draft.benefits.items.slice();
                              items[index] = {
                                ...items[index],
                                headline: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                benefits: { ...draft.benefits, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Subheadline</Label>
                          <textarea
                            className={textareaClass}
                            value={item.subheadline}
                            onChange={(event) => {
                              const items = draft.benefits.items.slice();
                              items[index] = {
                                ...items[index],
                                subheadline: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                benefits: { ...draft.benefits, items },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </LandingFormSection>
            </div>

            <div
              style={{ order: sectionOrderIndex.explore + 1 }}
              className={cn(
                "rounded-xl transition-colors",
                draggingSection === "explore" && "ring-1 ring-primary/40",
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingSection) {
                  moveSection(draggingSection, "explore");
                }
              }}
            >
              <LandingFormSection
                title="Explore"
                titleClassName="text-base"
                contentClassName="space-y-4"
                headerLeft={
                  <button
                    type="button"
                    draggable
                    title="Drag to reorder section"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    onDragStart={(event) => {
                      setDraggingSection("explore");
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", "explore");
                    }}
                    onDragEnd={() => setDraggingSection(null)}
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>
                }
                headerRight={
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="size-3.5 rounded border-input"
                      checked={draft.sections?.explore ?? true}
                      onChange={(event) =>
                        setSectionVisibility("explore", event.target.checked)
                      }
                    />
                    Show
                  </label>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Section headline</Label>
                    <Input
                      value={draft.explore.headline}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          explore: {
                            ...draft.explore,
                            headline: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Section subheadline</Label>
                    <textarea
                      className={textareaClass}
                      value={draft.explore.subheadline}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          explore: {
                            ...draft.explore,
                            subheadline: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA label</Label>
                    <Input
                      value={draft.explore.cta.label}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          explore: {
                            ...draft.explore,
                            cta: {
                              ...draft.explore.cta,
                              label: event.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA URL</Label>
                    <Input
                      value={draft.explore.cta.href}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          explore: {
                            ...draft.explore,
                            cta: {
                              ...draft.explore.cta,
                              href: event.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        explore: {
                          ...draft.explore,
                          items: [
                            ...draft.explore.items,
                            {
                              headline: "Club name",
                              preHeadline: "Category",
                              image: { src: "", alt: "" },
                              href: "/discover/clubs",
                            },
                          ],
                        },
                      })
                    }
                  >
                    Add card
                  </Button>
                </div>
                <ul className="space-y-4">
                  {draft.explore.items.map((item, index) => (
                    <li
                      key={`explore-${index}`}
                      className="space-y-3 rounded-md border border-border p-4"
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          Card {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={draft.explore.items.length <= 1}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              explore: {
                                ...draft.explore,
                                items: draft.explore.items.filter(
                                  (_, i) => i !== index,
                                ),
                              },
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Headline</Label>
                          <Input
                            value={item.headline}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              items[index] = {
                                ...items[index],
                                headline: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Pre-headline</Label>
                          <Input
                            value={item.preHeadline}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              items[index] = {
                                ...items[index],
                                preHeadline: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">
                            Subheadline (optional)
                          </Label>
                          <Input
                            value={item.subheadline ?? ""}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              const value = event.target.value.trim();
                              items[index] = {
                                ...items[index],
                                ...(value
                                  ? { subheadline: value }
                                  : { subheadline: undefined }),
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Image URL</Label>
                          <Input
                            value={item.image.src}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              items[index] = {
                                ...items[index],
                                image: {
                                  ...items[index].image,
                                  src: event.target.value,
                                },
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Link URL</Label>
                          <Input
                            value={item.href}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              items[index] = {
                                ...items[index],
                                href: event.target.value,
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Image alt</Label>
                          <Input
                            value={item.image.alt}
                            onChange={(event) => {
                              const items = draft.explore.items.slice();
                              items[index] = {
                                ...items[index],
                                image: {
                                  ...items[index].image,
                                  alt: event.target.value,
                                },
                              };
                              setDraft({
                                ...draft,
                                explore: { ...draft.explore, items },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </LandingFormSection>
            </div>

            <div
              style={{ order: sectionOrderIndex.attention + 1 }}
              className={cn(
                "rounded-xl transition-colors",
                draggingSection === "attention" && "ring-1 ring-primary/40",
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingSection) {
                  moveSection(draggingSection, "attention");
                }
              }}
            >
              <LandingFormSection
                title="Attention"
                titleClassName="text-base"
                contentClassName="space-y-4"
                headerLeft={
                  <button
                    type="button"
                    draggable
                    title="Drag to reorder section"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    onDragStart={(event) => {
                      setDraggingSection("attention");
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", "attention");
                    }}
                    onDragEnd={() => setDraggingSection(null)}
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>
                }
                headerRight={
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="size-3.5 rounded border-input"
                      checked={draft.sections?.attention ?? true}
                      onChange={(event) =>
                        setSectionVisibility("attention", event.target.checked)
                      }
                    />
                    Show
                  </label>
                }
              >
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={draft.attention.headline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        attention: {
                          ...draft.attention,
                          headline: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheadline</Label>
                  <textarea
                    className={textareaClass}
                    value={draft.attention.subheadline}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        attention: {
                          ...draft.attention,
                          subheadline: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        attention: {
                          ...draft.attention,
                          cta: {
                            items: [
                              ...draft.attention.cta.items,
                              { label: "New link", href: "/" },
                            ],
                          },
                        },
                      })
                    }
                  >
                    Add button
                  </Button>
                </div>
                <ul className="space-y-3">
                  {draft.attention.cta.items.map((item, index) => (
                    <li
                      key={`attention-cta-${index}`}
                      className="flex flex-wrap gap-2 rounded-md border border-border p-3"
                    >
                      <Input
                        className="min-w-[8rem] flex-1"
                        placeholder="Label"
                        value={item.label}
                        onChange={(event) => {
                          const items = draft.attention.cta.items.slice();
                          items[index] = {
                            ...items[index],
                            label: event.target.value,
                          };
                          setDraft({
                            ...draft,
                            attention: { ...draft.attention, cta: { items } },
                          });
                        }}
                      />
                      <Input
                        className="min-w-[10rem] flex-[2]"
                        placeholder="URL"
                        value={item.href}
                        onChange={(event) => {
                          const items = draft.attention.cta.items.slice();
                          items[index] = {
                            ...items[index],
                            href: event.target.value,
                          };
                          setDraft({
                            ...draft,
                            attention: { ...draft.attention, cta: { items } },
                          });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={draft.attention.cta.items.length <= 1}
                        onClick={() => {
                          const items = draft.attention.cta.items.filter(
                            (_, i) => i !== index,
                          );
                          setDraft({
                            ...draft,
                            attention: { ...draft.attention, cta: { items } },
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </LandingFormSection>
            </div>

            <div style={{ order: 99 }}>
              <LandingFormSection
                title="Join & sign-in copy"
                titleClassName="text-base"
                contentClassName="space-y-6"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-input"
                    checked={draft.join != null}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        join: event.target.checked
                          ? (draft.join ?? DEFAULT_JOIN)
                          : undefined,
                      })
                    }
                  />
                  Include customized join (sign-up) side panel copy
                </label>
                {draft.join ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Pre-headline</Label>
                      <Input
                        value={draft.join.preHeadline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            join: {
                              ...draft.join!,
                              preHeadline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Headline</Label>
                      <Input
                        value={draft.join.headline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            join: {
                              ...draft.join!,
                              headline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs">Subheadline</Label>
                      <textarea
                        className={textareaClass}
                        value={draft.join.subheadline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            join: {
                              ...draft.join!,
                              subheadline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 border-t border-border pt-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Form panel
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Form headline</Label>
                          <Input
                            value={draft.join.form.headline}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                join: {
                                  ...draft.join!,
                                  form: {
                                    ...draft.join!.form,
                                    headline: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Submit label</Label>
                          <Input
                            value={draft.join.form.submitButtonLabel}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                join: {
                                  ...draft.join!,
                                  form: {
                                    ...draft.join!.form,
                                    submitButtonLabel: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Form subheadline</Label>
                          <textarea
                            className={textareaClass}
                            value={draft.join.form.subheadline}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                join: {
                                  ...draft.join!,
                                  form: {
                                    ...draft.join!.form,
                                    subheadline: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-input"
                    checked={draft.login != null}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        login: event.target.checked
                          ? (draft.login ?? DEFAULT_LOGIN)
                          : undefined,
                      })
                    }
                  />
                  Include customized sign-in side panel copy
                </label>
                {draft.login ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Pre-headline</Label>
                      <Input
                        value={draft.login.preHeadline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            login: {
                              ...draft.login!,
                              preHeadline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Headline</Label>
                      <Input
                        value={draft.login.headline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            login: {
                              ...draft.login!,
                              headline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs">Subheadline</Label>
                      <textarea
                        className={textareaClass}
                        value={draft.login.subheadline}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            login: {
                              ...draft.login!,
                              subheadline: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 border-t border-border pt-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Form panel
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Form headline</Label>
                          <Input
                            value={draft.login.form.headline}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                login: {
                                  ...draft.login!,
                                  form: {
                                    ...draft.login!.form,
                                    headline: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Submit label</Label>
                          <Input
                            value={draft.login.form.submitButtonLabel}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                login: {
                                  ...draft.login!,
                                  form: {
                                    ...draft.login!.form,
                                    submitButtonLabel: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-xs">Form subheadline</Label>
                          <textarea
                            className={textareaClass}
                            value={draft.login.form.subheadline}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                login: {
                                  ...draft.login!,
                                  form: {
                                    ...draft.login!.form,
                                    subheadline: event.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </LandingFormSection>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle
          aria-label="Resize editor and preview"
          className="flex w-3 shrink-0 cursor-col-resize items-center justify-center bg-border/45 outline-none hover:bg-border focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="pointer-events-none h-28 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
        </PanelResizeHandle>

        <Panel
          defaultSize={48}
          minSize={22}
          maxSize={78}
          className="flex min-h-0 min-w-0 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-6 pt-1 sm:px-4">
            <div className="flex shrink-0 items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                Live preview
              </p>
              <span className="text-xs text-muted-foreground">
                Drag the divider to resize
              </span>
            </div>
            <iframe
              ref={iframeRef}
              title="Club landing preview"
              className="min-h-0 w-full min-w-0 flex-1 rounded-lg border border-border bg-background shadow-sm"
              src="/preview/club-landing"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
