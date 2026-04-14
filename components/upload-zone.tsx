"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { upload as blobUpload } from "@vercel/blob/client";
import { FileText, Plus, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/uuid";

const TERMS_ACCEPTED_KEY = "photosheet.terms_accepted.v1";

const MAX_STAGED = 15;
const TILE_W = "w-[9.5rem] sm:w-40";
const TILE_H = "h-44 sm:h-48";

export interface StagedUploadItem {
  id: string;
  /** Small data URL for image thumbnails; empty string for PDFs. */
  dataUrl: string;
  /** Raw File reference for uploading to blob storage. */
  file: File;
  isPdf: boolean;
  pageCount: number | null;
  fileName: string;
  /** Populated after blob upload, before extraction. */
  blobUrl?: string;
}

interface UploadZoneProps {
  /** Run when user clicks Analyze now. Return true if batch finished and staged files should clear. */
  onAnalyzeItems: (items: StagedUploadItem[]) => Promise<boolean>;
  disabled?: boolean;
  /** Fires when staged file count changes (for hiding marketing sections). */
  onStagedChange?: (hasStagedFiles: boolean) => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

async function getPdfPageCountClient(file: File): Promise<number> {
  try {
    const { PDFDocument } = await import("pdf-lib");
    const buf = await file.arrayBuffer();
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return 1;
  }
}

export function creditCostForItem(item: StagedUploadItem): number {
  if (item.isPdf) return Math.max(1, item.pageCount ?? 1);
  return 1;
}

function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  const isImage =
    file.type.startsWith("image/") || name.endsWith(".heic") || name.endsWith(".heif");
  return isPdf || isImage;
}

export function UploadZone({ onAnalyzeItems, disabled, onStagedChange }: UploadZoneProps) {
  const [staged, setStaged] = useState<StagedUploadItem[]>([]);
  const stagedRef = useRef(staged);
  stagedRef.current = staged;
  const [dragActive, setDragActive] = useState(false);
  const [analyzeBusy, setAnalyzeBusy] = useState(false);
  const [addingFiles, setAddingFiles] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryInputId = useId();

  const [termsAccepted, setTermsAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(TERMS_ACCEPTED_KEY) === "1";
  });

  function handleTermsToggle() {
    setTermsAccepted((prev) => {
      const next = !prev;
      if (next) localStorage.setItem(TERMS_ACCEPTED_KEY, "1");
      else localStorage.removeItem(TERMS_ACCEPTED_KEY);
      return next;
    });
  }

  useEffect(() => {
    onStagedChange?.(staged.length > 0);
  }, [staged.length, onStagedChange]);

  const ingestFiles = useCallback(async (files: File[]) => {
    const valid = files.filter((f) => {
      if (!isAllowedFile(f)) return false;
      if (f.size > 10 * 1024 * 1024) return false;
      return true;
    });
    if (valid.length === 0) {
      if (files.length > 0) {
        alert("Use images (JPG, PNG, WebP, HEIC…) or PDFs under 10MB each.");
      }
      return;
    }

    setAddingFiles(true);
    try {
      const room = Math.max(0, MAX_STAGED - stagedRef.current.length);
      if (room <= 0) return;

      const built: StagedUploadItem[] = [];
      for (const f of valid.slice(0, room)) {
        const name = f.name.toLowerCase();
        const isPdf = f.type === "application/pdf" || name.endsWith(".pdf");
        const dataUrl = isPdf ? "" : await readFileAsDataUrl(f);
        const pageCount = isPdf ? await getPdfPageCountClient(f) : null;
        built.push({
          id: generateId("f"),
          dataUrl,
          file: f,
          isPdf,
          pageCount,
          fileName: f.name || (isPdf ? "document.pdf" : "image"),
        });
      }
      if (built.length) {
        setStaged((prev) => [...prev, ...built]);
      }
    } finally {
      setAddingFiles(false);
      if (inputRef.current) inputRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  }, []);

  const removeStaged = useCallback((id: string) => {
    setStaged((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!staged.length || disabled || analyzeBusy) return;
    setAnalyzeBusy(true);
    try {
      const ok = await onAnalyzeItems(staged);
      if (ok) setStaged([]);
    } finally {
      setAnalyzeBusy(false);
    }
  }, [staged, disabled, analyzeBusy, onAnalyzeItems]);

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (disabled || addingFiles) return;
      const a = document.activeElement;
      if (
        a instanceof HTMLInputElement ||
        a instanceof HTMLTextAreaElement ||
        (a instanceof HTMLElement && a.isContentEditable)
      ) {
        return;
      }
      const items = e.clipboardData?.items;
      if (!items?.length) return;
      for (const item of items) {
        if (item.kind !== "file") continue;
        const file = item.getAsFile();
        if (!file) continue;
        if (isAllowedFile(file)) {
          e.preventDefault();
          void ingestFiles([file]);
          return;
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [disabled, addingFiles, ingestFiles]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (disabled || addingFiles) return;
      const list = e.dataTransfer.files;
      if (!list?.length) return;
      void ingestFiles(Array.from(list));
    },
    [disabled, addingFiles, ingestFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      if (!disabled && !addingFiles) setDragActive(true);
    },
    [disabled, addingFiles]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      if (!disabled && !addingFiles) setDragActive(true);
    },
    [disabled, addingFiles]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list?.length) return;
      void ingestFiles(Array.from(list));
    },
    [ingestFiles]
  );

  const placeholderTileClass = cn(
    TILE_W,
    TILE_H,
    "relative flex shrink-0 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-muted/35",
    (disabled || addingFiles) && "pointer-events-none opacity-50"
  );

  const emptyDropZoneClass = cn(
    "flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-12",
    dragActive
      ? "border-primary bg-primary/5 scale-[1.01]"
      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
    disabled && "pointer-events-none cursor-not-allowed opacity-50"
  );

  function openGalleryPicker() {
    if (disabled || addingFiles) return;
    inputRef.current?.click();
  }

  return (
    <div className={staged.length === 0 ? "space-y-3" : "space-y-5"}>
      {staged.length === 0 ? (
        <>
          <div
            className="w-full"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {disabled ? (
              <div className={emptyDropZoneClass}>
                <UploadZoneInner dragActive={dragActive} />
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                className={emptyDropZoneClass}
                onClick={openGalleryPicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openGalleryPicker();
                  }
                }}
              >
                <UploadZoneInner dragActive={dragActive} />
              </div>
            )}
          </div>

          <div className="flex justify-center sm:hidden">
            <Button
              type="button"
              variant="default"
              size="default"
              className="gap-2"
              disabled={disabled || addingFiles}
              onClick={() => cameraRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden />
              Take photo
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            <span className="sm:hidden">JPG, PNG, WebP, HEIC, PDF · Max 10MB · 1 credit per image; PDFs use 1 credit per page</span>
            <span className="hidden sm:inline">JPG, PNG, WebP, HEIC, PDF · Max 10MB · Paste with Ctrl+V (⌘V) · 1 credit per image; PDFs use 1 credit per page</span>
          </p>
        </>
      ) : (
        <>
          <div
            className="flex flex-wrap items-start justify-center gap-3"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {staged.map((item) => {
              const cost = creditCostForItem(item);
              return (
                <div key={item.id} className="flex shrink-0 flex-col items-center gap-1">
                  <div
                    className={cn(
                      TILE_W,
                      TILE_H,
                      "relative overflow-hidden rounded-xl border border-border bg-muted/30"
                    )}
                  >
                    {item.isPdf ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
                        <FileText className="size-12 text-muted-foreground" strokeWidth={1.25} aria-hidden />
                        <span className="line-clamp-2 px-1 text-center text-[0.65rem] font-medium leading-tight text-muted-foreground">
                          {item.fileName}
                        </span>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          src={item.dataUrl}
                          alt={item.fileName}
                          fill
                          className="object-contain object-center"
                          unoptimized
                          sizes="160px"
                        />
                      </div>
                    )}
                    {!disabled && (
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${item.fileName}`}
                        onClick={() => removeStaged(item.id)}
                      >
                        <X className="size-3.5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {cost} {cost === 1 ? "credit" : "credits"}
                  </span>
                </div>
              );
            })}

            {staged.length < MAX_STAGED && (
              <button
                type="button"
                className={cn(placeholderTileClass, "cursor-pointer")}
                disabled={disabled || addingFiles}
                onClick={openGalleryPicker}
              >
                <Plus className="size-8 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                <Upload className="size-5 text-muted-foreground/80" aria-hidden />
                <span className="sr-only">Add files</span>
              </button>
            )}
          </div>

          {!termsAccepted && (
            <div className="flex items-start justify-center gap-2">
              <input
                type="checkbox"
                id="terms-accept"
                checked={termsAccepted}
                onChange={handleTermsToggle}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              />
              <label htmlFor="terms-accept" className="cursor-pointer text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-foreground">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-foreground">
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto sm:min-w-[12rem]"
              disabled={disabled || analyzeBusy || addingFiles || !termsAccepted}
              onClick={() => void handleAnalyze()}
            >
              {analyzeBusy || addingFiles ? "Working…" : "Analyze now"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              className="gap-2 sm:hidden"
              disabled={disabled || addingFiles}
              onClick={() => cameraRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden />
              Take photo
            </Button>
          </div>
        </>
      )}

      <input
        id={galleryInputId}
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.pdf"
        multiple
        onChange={handleFileInputChange}
        disabled={disabled || addingFiles}
        className="sr-only pointer-events-none"
        tabIndex={-1}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        disabled={disabled || addingFiles}
        className="sr-only pointer-events-none"
        tabIndex={-1}
      />
    </div>
  );
}

function UploadZoneInner({ dragActive }: { dragActive: boolean }) {
  return (
    <>
      <div
        className={cn(
          "rounded-full p-4",
          dragActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Upload className="size-8 text-current" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">
          <span className="sm:hidden">Tap to upload or take a photo</span>
          <span className="hidden sm:inline">Drop your image or PDF here</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="sm:hidden">JPG, PNG, WebP, HEIC, PDF supported.</span>
          <span className="hidden sm:inline">or click to upload (JPG, PNG, WebP, HEIC, PDF). Paste from clipboard with Ctrl+V or ⌘V anywhere on this page.</span>
        </p>
      </div>
    </>
  );
}
