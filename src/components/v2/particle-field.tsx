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
    let visible = true;
    let disposed = false;
    const colors = ["#5684ff", "#6e8cff", "#8a9bff", "#4277ee"];

    const paint = () => {
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;
      const time = elapsed * 0.001;
      context.lineCap = "round";
      for (const particle of particles) {
        // A continuous, wrapping flow: particles fade at the edges before recycling.
        const phase = (particle.progress + time * (0.012 + particle.depth * 0.009)) % 1;
        const y = height * (1.12 - phase * 1.24);
        const wave = Math.sin(phase * 5.2 + particle.scatter * 3 + time * 0.12);
        let x = width * particle.scatter + wave * width * 0.09;
        let py = y;
        const dx = x - pointer.x;
        const dy = py - pointer.y;
        const influence = Math.exp(-(dx * dx + dy * dy) / 48000) * pointer.strength;
        x += influence * (dx * 0.12 + pointer.windX);
        py += influence * (dy * 0.12 + pointer.windY);
        const edge = Math.max(0, Math.min(1, phase * 10, (1 - phase) * 10));
        const textFade = width < 760 ? 0.65 : 0.18 + Math.min(1, Math.max(0, (x / width - 0.3) / 0.35)) * 0.82;
        const length = 1.5 + particle.depth * 5;
        const tilt = Math.cos(phase * 5.2 + particle.scatter * 3 + time * 0.12) * 0.65;
        context.globalAlpha = particle.brightness * edge * textFade;
        context.strokeStyle = colors[particle.stream];
        context.lineWidth = particle.size;
        context.beginPath();
        context.moveTo(x, py);
        context.lineTo(x + tilt * length, py - length);
        context.stroke();
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
      paint();
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
      particles = Array.from({ length: Math.round(Math.min(700, Math.max(180, width * height / 1900))) }, (_, index) => ({
        progress: random(), scatter: random() * 1.2 - 0.1, depth: random(),
        size: 0.7 + random() * 1.8, brightness: 0.25 + random() * 0.65, stream: index % 4,
      }));
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

