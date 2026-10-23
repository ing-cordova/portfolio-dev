"use client";

import { useEffect, useRef } from "react";

type ParticleFieldProps = { className?: string; paused?: boolean };
type FlowParticle = { progress: number; scatter: number; depth: number; size: number; brightness: number; stream: number };

export function ParticleField({ className, paused = false }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const synchronizeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    synchronizeRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactionTarget = canvas.parentElement;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0, windX: 0, windY: 0 };
    let width = 0;
    let height = 0;
    let particles: FlowParticle[] = [];
    let frame = 0;
    let elapsed = 0;
    let previousTime: number | null = null;
    let lastPaint = 0;
    let visible = true;
    let disposed = false;
    const sample = { x: 0, y: 0 };
    const colors = ["#88b8ff", "#a18bfa", "#c1adff", "#8299c8"];

    const sampleStream = (progress: number, stream: number, time: number) => {
      if (stream === 0) {
        sample.x = width * (-0.25 + progress * 1.5);
        sample.y = height * (1.08 - progress * 0.8 + Math.sin(progress * Math.PI * 1.6 + time * 0.16) * 0.14);
      } else if (stream === 1) {
        sample.x = width * (0.82 + Math.sin(progress * Math.PI * 0.9 - 0.8 + time * 0.1) * 0.22);
        sample.y = height * (1.25 - progress * 1.5);
      } else {
        sample.x = width * (-0.2 + progress * 1.5);
        sample.y = height * (0.94 + Math.sin(progress * Math.PI * 1.7 + 1.1 + time * 0.12) * 0.2 - progress * 0.08);
      }
    };

    const paint = () => {
      context.globalAlpha = 1;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;
      const compact = width < 760;
      const time = elapsed * 0.00015;
      const spread = compact ? 54 : Math.min(120, width * 0.08);
      const blue = context.createRadialGradient(width * 0.95, height * 0.24, 0, width * 0.95, height * 0.24, width * 0.65);
      blue.addColorStop(0, "rgba(53, 90, 205, 0.16)");
      blue.addColorStop(0.5, "rgba(56, 78, 176, 0.055)");
      blue.addColorStop(1, "rgba(56, 78, 176, 0)");
      context.fillStyle = blue;
      context.fillRect(0, 0, width, height);
      const violet = context.createRadialGradient(width * 0.72, height * 1.1, 0, width * 0.72, height * 1.1, width * 0.66);
      violet.addColorStop(0, "rgba(122, 65, 214, 0.2)");
      violet.addColorStop(0.5, "rgba(99, 67, 195, 0.07)");
      violet.addColorStop(1, "rgba(99, 67, 195, 0)");
      context.fillStyle = violet;
      context.fillRect(0, 0, width, height);

      for (let stream = 0; stream < 3; stream += 1) {
        const gradient = context.createLinearGradient(width * 0.35, height, width, 0);
        gradient.addColorStop(0, "rgba(157, 117, 245, 0)");
        gradient.addColorStop(0.4, "rgba(143, 132, 248, 0.12)");
        gradient.addColorStop(1, "rgba(128, 175, 255, 0.04)");
        context.strokeStyle = gradient;
        for (let strand = 0; strand < 3; strand += 1) {
          context.beginPath();
          for (let step = 0; step <= 90; step += 1) {
            sampleStream(-0.2 + step / 90 * 1.4, stream, time);
            const offset = (strand - 1) * spread * 0.11;
            const x = sample.x + (stream === 1 ? offset : offset * 0.2);
            const y = sample.y + (stream === 1 ? offset * 0.2 : offset);
            if (step === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.lineWidth = strand === 1 ? 0.65 : 0.35;
          context.stroke();
        }
      }

      for (const particle of particles) {
        let x: number;
        let y: number;
        if (particle.stream === 3) {
          x = width * particle.progress / 1.4 + Math.sin(time * 0.2 + particle.depth * 9) * 12;
          y = height * particle.scatter + Math.cos(time * 0.16 + particle.depth * 7) * 10;
        } else {
          const progress = (particle.progress + elapsed * (0.000009 + particle.stream * 0.000002)) % 1.4 - 0.2;
          sampleStream(progress, particle.stream, time);
          const breadth = spread * (0.65 + Math.sin(progress * Math.PI) * 0.25);
          const offset = particle.scatter * breadth;
          const flutter = Math.sin(progress * 12 + particle.depth * 5 + time * 0.7) * 8 * particle.depth;
          x = sample.x + offset * (particle.stream === 1 ? 1 : 0.25) + flutter;
          y = sample.y + offset * (particle.stream === 1 ? 0.25 : 1) + particle.depth * 16;
        }
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
        const fade = Math.min(1, Math.max(0, (x / width - 0.24) / 0.38));
        if (fade < 0.01) continue;
        let influence = 0;
        if (pointer.strength > 0.001) {
          const dx = (x - pointer.x) / Math.max(90, width * 0.16);
          const dy = (y - pointer.y) / Math.max(120, height * 0.3);
          influence = Math.exp(-dx * dx - dy * dy) * pointer.strength;
          x += influence * (pointer.windX + Math.sin(y / height * 5 + time) * 5);
          y += influence * (pointer.windY + Math.sin(x / width * 4 - time) * 4);
        }
        const density = particle.stream === 3 ? 0.28 : 0.5 + Math.exp(-particle.scatter * particle.scatter * 2) * 0.5;
        const glimmer = 0.75 + Math.sin(particle.depth * 12 + time * 0.7) * 0.15;
        context.globalAlpha = Math.min(0.8, particle.brightness * fade * density * glimmer * (compact ? 0.8 : 1) + influence * 0.035);
        context.fillStyle = colors[particle.stream];
        context.fillRect(x, y, particle.size, particle.size);
      }
      context.globalAlpha = 1;
    };

    const canAnimate = () => !disposed && visible && !document.hidden && !motionPreference.matches && !pausedRef.current;
    const animate = (timestamp: number) => {
      frame = 0;
      if (!canAnimate()) return;
      const delta = previousTime === null ? 0 : Math.min(timestamp - previousTime, 80);
      elapsed += delta;
      previousTime = timestamp;
      const easing = 1 - Math.exp(-delta / 160);
      pointer.windX = Math.max(-18, Math.min(18, (pointer.targetX - pointer.x) * 0.2));
      pointer.windY = Math.max(-14, Math.min(14, (pointer.targetY - pointer.y) * 0.2));
      pointer.x += (pointer.targetX - pointer.x) * easing;
      pointer.y += (pointer.targetY - pointer.y) * easing;
      pointer.strength += (pointer.targetStrength - pointer.strength) * (1 - Math.exp(-delta / 240));
      if (timestamp - lastPaint >= 1000 / 30) {
        paint();
        lastPaint = timestamp;
      }
      frame = window.requestAnimationFrame(animate);
    };
    const synchronize = () => {
      previousTime = null;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (canAnimate()) frame = window.requestAnimationFrame(animate);
      else {
        pointer.strength = 0;
        pointer.targetStrength = 0;
        if (!document.hidden && visible) paint();
      }
    };
    const releasePointer = () => { pointer.targetStrength = 0; };
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || !canAnimate()) {
        releasePointer();
        return;
      }
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - bounds.left) * width / Math.max(1, bounds.width);
      pointer.targetY = (event.clientY - bounds.top) * height / Math.max(1, bounds.height);
      pointer.targetStrength = pointer.targetX > width * 0.3 ? 1 : 0;
      if (pointer.strength < 0.001) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pointer.strength = 0;
      pointer.targetStrength = 0;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      let seed = 48271;
      const random = () => {
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
      };
      particles = Array.from({ length: width < 760 ? 6500 : 18000 }, (_, index) => {
        const stream = index % 10 === 0 ? 3 : index % 3;
        return { progress: random() * 1.4, scatter: stream === 3 ? random() : (random() + random() + random() - 1.5) * 2, depth: random() * 2 - 1, size: 0.6 + random() * 0.85, brightness: 0.4 + Math.pow(random(), 1.8) * 0.6, stream };
      });
      paint();
      synchronize();
    };

    synchronizeRef.current = synchronize;
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      synchronize();
    }, { rootMargin: "80px" });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", synchronize);
    motionPreference.addEventListener("change", synchronize);
    finePointer.addEventListener("change", releasePointer);
    interactionTarget?.addEventListener("pointermove", movePointer, { passive: true });
    interactionTarget?.addEventListener("pointerleave", releasePointer);
    interactionTarget?.addEventListener("pointercancel", releasePointer);
    window.addEventListener("scroll", releasePointer, { passive: true });
    window.addEventListener("blur", releasePointer);
    resize();
    return () => {
      disposed = true;
      synchronizeRef.current = null;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", synchronize);
      motionPreference.removeEventListener("change", synchronize);
      finePointer.removeEventListener("change", releasePointer);
      interactionTarget?.removeEventListener("pointermove", movePointer);
      interactionTarget?.removeEventListener("pointerleave", releasePointer);
      interactionTarget?.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("scroll", releasePointer);
      window.removeEventListener("blur", releasePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

