"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_WIDTH = 640;
const FRAME_HEIGHT = 360;
const FRAME_COUNT = 407;
const FRAMES_PER_SHEET = 10;
const SHEET_COLUMNS = 5;
const SHEET_COUNT = 41;

function sheetSource(index: number) {
  return `/media/sequence/sheet-${String(index + 1).padStart(2, "0")}.webp`;
}

export default function ScrollVideoBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const sheets: Array<HTMLImageElement | undefined> = new Array(SHEET_COUNT);
    const loaded = new Set<number>();
    let desiredFrame = 0;
    let renderedFrame = -1;
    let renderRequest = 0;

    const drawFrame = (force = false) => {
      renderRequest = 0;
      const currentFrame = Math.floor(desiredFrame);
      const nextFrame = Math.min(currentFrame + 1, FRAME_COUNT - 1);
      const blend = desiredFrame - currentFrame;
      const sheetIndex = Math.floor(currentFrame / FRAMES_PER_SHEET);
      const sheet = sheets[sheetIndex];
      if (!sheet || !loaded.has(sheetIndex) || (!force && renderedFrame === desiredFrame)) return;

      const scale = Math.min(canvas.width / FRAME_WIDTH, canvas.height / FRAME_HEIGHT);
      const width = FRAME_WIDTH * scale;
      const height = FRAME_HEIGHT * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      const paintFrame = (frame: number) => {
        const frameSheetIndex = Math.floor(frame / FRAMES_PER_SHEET);
        const frameSheet = sheets[frameSheetIndex];
        if (!frameSheet || !loaded.has(frameSheetIndex)) return false;
        const frameInSheet = frame % FRAMES_PER_SHEET;
        const sourceX = (frameInSheet % SHEET_COLUMNS) * FRAME_WIDTH;
        const sourceY = Math.floor(frameInSheet / SHEET_COLUMNS) * FRAME_HEIGHT;
        context.drawImage(frameSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, x, y, width, height);
        return true;
      };

      context.fillStyle = "#050403";
      context.fillRect(0, 0, canvas.width, canvas.height);
      paintFrame(currentFrame);
      if (blend > 0) {
        context.globalAlpha = blend;
        paintFrame(nextFrame);
        context.globalAlpha = 1;
      }
      canvas.dataset.frame = desiredFrame.toFixed(2);
      renderedFrame = desiredFrame;
    };

    const requestDraw = (force = false) => {
      if (force) {
        drawFrame(true);
        return;
      }
      if (!renderRequest) renderRequest = window.requestAnimationFrame(() => drawFrame());
    };

    const loadSheet = (index: number) => {
      if (index < 0 || index >= SHEET_COUNT || sheets[index]) return;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loaded.add(index);
        const currentSheet = Math.floor(desiredFrame / FRAMES_PER_SHEET);
        const nextSheet = Math.floor(Math.min(Math.floor(desiredFrame) + 1, FRAME_COUNT - 1) / FRAMES_PER_SHEET);
        if (currentSheet === index || nextSheet === index) requestDraw(true);
      };
      image.src = sheetSource(index);
      sheets[index] = image;
    };

    const preloadAround = (frame: number) => {
      const sheetIndex = Math.floor(frame / FRAMES_PER_SHEET);
      loadSheet(sheetIndex);
      loadSheet(sheetIndex + 1);
      loadSheet(sheetIndex + 2);
      loadSheet(sheetIndex + 3);
      loadSheet(sheetIndex - 1);
      loadSheet(sheetIndex - 2);

      for (let index = 0; index < SHEET_COUNT; index += 1) {
        if (Math.abs(index - sheetIndex) > 5 && sheets[index]) {
          sheets[index]!.onload = null;
          sheets[index] = undefined;
          loaded.delete(index);
        }
      }
    };

    const resize = () => {
      const pixelRatio = 1;
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      requestDraw(true);
    };

    resize();
    loadSheet(0);
    loadSheet(1);
    loadSheet(2);

    const preloadTimer = window.setTimeout(() => {
      loadSheet(3);
      loadSheet(4);
    }, 250);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trigger = reducedMotion.matches
      ? undefined
      : ScrollTrigger.create({
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            desiredFrame = progress * (FRAME_COUNT - 1);
            preloadAround(desiredFrame);
            requestDraw();
          },
        });

    window.addEventListener("resize", resize, { passive: true });
    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(preloadTimer);
      window.cancelAnimationFrame(renderRequest);
      window.removeEventListener("resize", resize);
      trigger?.kill();
      for (const sheet of sheets) if (sheet) sheet.onload = null;
    };
  }, []);

  return (
    <div className="video-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="background-video-overlay" />
    </div>
  );
}
