"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const VIEWPORT_SIZE = 256;
const OUTPUT_SIZE = 800;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type Point = { x: number; y: number };

type ComposerPhotoFieldProps = {
  currentPhotoUrl?: string | null;
  required?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function cropPosition(position: Point, imageWidth: number, imageHeight: number, zoom: number): Point {
  const scale = Math.max(VIEWPORT_SIZE / imageWidth, VIEWPORT_SIZE / imageHeight) * zoom;
  const maxX = Math.max(0, (imageWidth * scale - VIEWPORT_SIZE) / 2);
  const maxY = Math.max(0, (imageHeight * scale - VIEWPORT_SIZE) / 2);

  return {
    x: clamp(position.x, -maxX, maxX),
    y: clamp(position.y, -maxY, maxY),
  };
}

export function ComposerPhotoField({ currentPhotoUrl, required = false }: ComposerPhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropReadyRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const [sourceUrl, setSourceUrl] = useState(currentPhotoUrl ?? "");
  const [localSource, setLocalSource] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sourceUrl) {
      setImageSize(null);
      return;
    }

    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setPosition({ x: 0, y: 0 });
      setZoom(1);
    };
    image.src = sourceUrl;
  }, [sourceUrl]);

  useEffect(() => {
    if (!localSource || !sourceUrl || !imageSize || !inputRef.current) return;

    let cancelled = false;
    setStatus("Preparando o recorte...");

    const image = new Image();
    image.onload = () => {
      if (cancelled || !inputRef.current) return;

      const scale = Math.max(VIEWPORT_SIZE / imageSize.width, VIEWPORT_SIZE / imageSize.height) * zoom;
      const cropWidth = VIEWPORT_SIZE / scale;
      const cropHeight = VIEWPORT_SIZE / scale;
      const rawX = imageSize.width / 2 - cropWidth / 2 - position.x / scale;
      const rawY = imageSize.height / 2 - cropHeight / 2 - position.y / scale;
      const sourceX = clamp(rawX, 0, Math.max(0, imageSize.width - cropWidth));
      const sourceY = clamp(rawY, 0, Math.max(0, imageSize.height - cropHeight));
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      canvas.toBlob((blob) => {
        if (cancelled || !blob || !inputRef.current) return;
        const file = new File([blob], "composer-photo.webp", { type: "image/webp" });
        const transfer = new DataTransfer();
        transfer.items.add(file);
        inputRef.current.files = transfer.files;
        if (cropReadyRef.current) cropReadyRef.current.value = "1";
        setStatus("Recorte pronto. Você pode arrastar a imagem ou ajustar o zoom.");
      }, "image/webp", 0.9);
    };
    image.onerror = () => setError("Não foi possível preparar esta imagem.");
    image.src = sourceUrl;

    return () => {
      cancelled = true;
    };
  }, [imageSize, localSource, position, sourceUrl, zoom]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    setStatus("");
    if (cropReadyRef.current) cropReadyRef.current.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      event.target.value = "";
      setError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setSourceUrl(URL.createObjectURL(file));
    setLocalSource(true);
    setImageSize(null);
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    setStatus("Carregando imagem...");
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!localSource || !imageSize) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: position,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !imageSize) return;
    setPosition(cropPosition({
      x: drag.origin.x + event.clientX - drag.start.x,
      y: drag.origin.y + event.clientY - drag.start.y,
    }, imageSize.width, imageSize.height, zoom));
  }

  function stopDragging() {
    dragRef.current = null;
  }

  const scale = imageSize
    ? Math.max(VIEWPORT_SIZE / imageSize.width, VIEWPORT_SIZE / imageSize.height) * zoom
    : 1;
  const previewStyle = imageSize
    ? {
        width: imageSize.width * scale,
        height: imageSize.height * scale,
        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
      }
    : undefined;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-start gap-4">
        <div
          aria-label="Pré-visualização do recorte quadrado"
          className="relative h-64 w-64 touch-none overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--muted)]"
          onPointerCancel={stopDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
        >
          {sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Pré-visualização da foto do compositor"
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              src={sourceUrl}
              style={previewStyle}
            />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--muted-foreground)]">
              A foto quadrada aparecerá aqui
            </div>
          )}
        </div>
        <div className="grid min-w-52 flex-1 gap-3">
          <div>
            <p className="text-sm font-medium">Foto do compositor</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              JPG, PNG ou WebP, até 5 MB. O recorte será salvo em 800 × 800 px.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Escolher foto
            <Input
              accept="image/jpeg,image/png,image/webp"
              name="photo"
              onChange={handleFileChange}
              ref={inputRef}
              required={required && !currentPhotoUrl}
              type="file"
            />
            <input defaultValue="" name="photo_crop_ready" ref={cropReadyRef} type="hidden" />
          </label>
          {localSource && imageSize ? (
            <label className="grid gap-2 text-sm font-medium">
              Zoom do recorte
              <input
                aria-label="Zoom do recorte"
                className="accent-[var(--primary)]"
                max="2.5"
                min="1"
                onChange={(event) => {
                  const nextZoom = Number(event.target.value);
                  setZoom(nextZoom);
                  setPosition(cropPosition(position, imageSize.width, imageSize.height, nextZoom));
                }}
                step="0.05"
                type="range"
                value={zoom}
              />
            </label>
          ) : null}
        </div>
      </div>
      {localSource ? <p className="text-xs text-[var(--muted-foreground)]">Arraste a imagem dentro do quadrado para escolher o enquadramento.</p> : null}
      {status ? <p className="text-sm text-[var(--muted-foreground)]">{status}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
