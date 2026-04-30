import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";

export interface ForceFieldBackgroundProps {
  imageUrl?: string;
  hue?: number;
  saturation?: number;
  threshold?: number;
  minStroke?: number;
  maxStroke?: number;
  spacing?: number;
  noiseScale?: number;
  density?: number;
  invertImage?: boolean;
  invertWireframe?: boolean;
  magnifierEnabled?: boolean;
  magnifierRadius?: number;
  forceStrength?: number;
  friction?: number;
  restoreSpeed?: number;
  className?: string;
  ariaHidden?: boolean;
}

/**
 * Interactive p5.js force-field particle background.
 * Fills its parent container — the parent must have explicit dimensions.
 */
export function ForceFieldBackground({
  imageUrl = "https://cdn.pixabay.com/photo/2024/12/13/20/29/alps-9266131_1280.jpg",
  hue = 270,
  saturation = 60,
  threshold = 255,
  minStroke = 1.5,
  maxStroke = 5,
  spacing = 10,
  noiseScale = 0,
  density = 0.6,
  invertImage = true,
  invertWireframe = true,
  magnifierEnabled = true,
  magnifierRadius = 140,
  forceStrength = 8,
  friction = 0.9,
  restoreSpeed = 0.06,
  className = "",
  ariaHidden = true,
}: ForceFieldBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const propsRef = useRef({
    hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
    density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
    forceStrength, friction, restoreSpeed,
  });

  useEffect(() => {
    propsRef.current = {
      hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
      density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
      forceStrength, friction, restoreSpeed,
    };
  }, [hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale, density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius, forceStrength, friction, restoreSpeed]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      let originalImg: p5.Image;
      let img: p5.Image;
      let palette: p5.Color[] = [];
      let points: { pos: p5.Vector; originalPos: p5.Vector; vel: p5.Vector }[] = [];
      let lastHue = -1;
      let lastSaturation = -1;
      let lastSpacing = -1;
      let lastNoiseScale = -1;
      let lastDensity = -1;
      let lastInvertImage: boolean | null = null;
      let magnifierX = 0;
      let magnifierY = 0;
      const magnifierInertia = 0.1;

      p.preload = () => {
        p.loadImage(
          imageUrl,
          (loaded) => {
            originalImg = loaded;
            setIsLoading(false);
          },
          (err) => {
            console.error("ForceFieldBackground: image failed", err);
            setError("배경 이미지를 불러올 수 없습니다.");
            setIsLoading(false);
          }
        );
      };

      p.setup = () => {
        if (!originalImg || !containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        p.createCanvas(Math.max(1, clientWidth), Math.max(1, clientHeight));
        magnifierX = p.width / 2;
        magnifierY = p.height / 2;
        processImage();
        generatePalette(propsRef.current.hue, propsRef.current.saturation);
        generatePoints();
      };

      p.windowResized = () => {
        if (!containerRef.current || !originalImg) return;
        const { clientWidth, clientHeight } = containerRef.current;
        p.resizeCanvas(Math.max(1, clientWidth), Math.max(1, clientHeight));
        processImage();
        generatePoints();
      };

      function processImage() {
        if (!originalImg) return;
        img = originalImg.get();
        if (p.width > 0 && p.height > 0) img.resize(p.width, p.height);
        img.filter(p.GRAY);
        if (propsRef.current.invertImage) {
          img.loadPixels();
          for (let i = 0; i < img.pixels.length; i += 4) {
            img.pixels[i] = 255 - img.pixels[i];
            img.pixels[i + 1] = 255 - img.pixels[i + 1];
            img.pixels[i + 2] = 255 - img.pixels[i + 2];
          }
          img.updatePixels();
        }
        lastInvertImage = propsRef.current.invertImage;
      }

      function generatePalette(h: number, s: number) {
        palette = [];
        p.push();
        p.colorMode(p.HSL);
        for (let i = 0; i < 12; i++) {
          const lightness = p.map(i, 0, 11, 95, 15);
          palette.push(p.color(h, s, lightness));
        }
        p.pop();
      }

      function generatePoints() {
        if (!img) return;
        points = [];
        const { spacing, density, noiseScale } = propsRef.current;
        const safeSpacing = Math.max(2, spacing);
        for (let y = 0; y < img.height; y += safeSpacing) {
          for (let x = 0; x < img.width; x += safeSpacing) {
            if (p.random() > density) continue;
            const nx = p.noise(x * noiseScale, y * noiseScale) - 0.5;
            const ny = p.noise((x + 500) * noiseScale, (y + 500) * noiseScale) - 0.5;
            const px = x + nx * safeSpacing;
            const py = y + ny * safeSpacing;
            points.push({
              pos: p.createVector(px, py),
              originalPos: p.createVector(px, py),
              vel: p.createVector(0, 0),
            });
          }
        }
        lastSpacing = spacing;
        lastNoiseScale = noiseScale;
        lastDensity = density;
      }

      function applyForceField(mx: number, my: number) {
        const props = propsRef.current;
        if (!props.magnifierEnabled) return;
        for (const pt of points) {
          const dir = p5.Vector.sub(pt.pos, p.createVector(mx, my));
          const d = dir.mag();
          if (d < props.magnifierRadius) {
            dir.normalize();
            const force = dir.mult(props.forceStrength / Math.max(1, d));
            pt.vel.add(force);
          }
          pt.vel.mult(props.friction);
          const restore = p5.Vector.sub(pt.pos, pt.originalPos).mult(-props.restoreSpeed);
          pt.vel.add(restore);
          pt.pos.add(pt.vel);
        }
      }

      p.draw = () => {
        if (!img) return;
        p.clear();

        const props = propsRef.current;
        if (props.hue !== lastHue || props.saturation !== lastSaturation) {
          generatePalette(props.hue, props.saturation);
          lastHue = props.hue;
          lastSaturation = props.saturation;
        }
        if (props.invertImage !== lastInvertImage) processImage();
        if (props.spacing !== lastSpacing || props.noiseScale !== lastNoiseScale || props.density !== lastDensity) {
          generatePoints();
        }

        magnifierX = p.lerp(magnifierX, p.mouseX, magnifierInertia);
        magnifierY = p.lerp(magnifierY, p.mouseY, magnifierInertia);

        applyForceField(magnifierX, magnifierY);

        img.loadPixels();
        p.noFill();

        for (const pt of points) {
          const x = pt.pos.x;
          const y = pt.pos.y;
          const d = p.dist(x, y, magnifierX, magnifierY);
          const px = p.constrain(p.floor(x), 0, img.width - 1);
          const py = p.constrain(p.floor(y), 0, img.height - 1);
          const index = (px + py * img.width) * 4;
          const brightness = img.pixels[index];
          if (brightness === undefined) continue;

          const condition = props.invertWireframe
            ? brightness < props.threshold
            : brightness > props.threshold;
          if (!condition) continue;

          let shadeIndex = Math.floor(p.map(brightness, 0, 255, 0, palette.length - 1));
          shadeIndex = p.constrain(shadeIndex, 0, palette.length - 1);

          let strokeSize = p.map(brightness, 0, 255, props.minStroke, props.maxStroke);
          if (props.magnifierEnabled && d < props.magnifierRadius) {
            const factor = p.map(d, 0, props.magnifierRadius, 2, 1);
            strokeSize *= factor;
          }
          if (palette[shadeIndex]) {
            p.stroke(palette[shadeIndex]);
            p.strokeWeight(strokeSize);
            p.point(x, y);
          }
        }
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    p5InstanceRef.current = myP5;

    return () => {
      myP5.remove();
      p5InstanceRef.current = null;
    };
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      aria-hidden={ariaHidden}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.3em] text-muted-foreground">
          LOADING…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.2em] text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}

export default ForceFieldBackground;
