import React from 'react';
import { motion } from 'framer-motion';
import { seededRandom } from '../utils/seededRandom';

interface SwissPosterArtProps {
  family: string;
  colors: { primary: string; secondary: string; accent: string; background: string; text: string };
  index: number;
  currentTime: number;
  variant: number;
  profile?: {
    japaneseLength: number;
    englishLength: number;
    englishWords: number;
    duration: number;
    density: number;
    intensity: number;
    repetition: number;
    hasPunctuation: boolean;
    hasQuestion: boolean;
    isShort: boolean;
    isLong: boolean;
    isQuiet: boolean;
    isDramatic: boolean;
  };
  dna?: { density: number; symmetry: number; overlap: number; whitespace: number; backgroundIntensity: number; geometryScale: number; motionIntensity: number };
  layout?: string;
  typography?: string;
}

/**
 * Swiss/Bauhaus poster generator.
 *
 * The important difference from the old version is that a "family" is no
 * longer a single arrangement. Each lyric also receives one of 16 poster
 * compositions. Shapes are composed as a hierarchy (field -> structure ->
 * accent), rather than being sprinkled independently around the viewport.
 */
const SwissPosterArt: React.FC<SwissPosterArtProps> = ({ family, colors, index, currentTime, variant, profile, dna, layout, typography }) => {
  const { primary: p, secondary: s, accent: a, text: ink } = colors;
  const t = currentTime;
  const seed = index * 137 + variant * 17;
  const r1 = seededRandom(seed + 1);
  const r2 = seededRandom(seed + 2);
  const angle = -14 + r1 * 28;
  const common = 'absolute pointer-events-none select-none';
  const artDensity = dna?.density ?? profile?.density ?? 0.5;
  const artIntensity = dna?.backgroundIntensity ?? profile?.intensity ?? 0.5;
  const artScale = dna?.geometryScale ?? 1;
  const quiet = profile?.isQuiet ?? false;
  const dramatic = profile?.isDramatic ?? false;
  const repeated = (profile?.repetition ?? 0) > 0.2;
  const semanticOpacity = quiet ? 0.72 : Math.min(1, 0.78 + artIntensity * 0.3);
  const grammarAngle = layout === 'diagonal' ? -8 : layout === 'vertical' ? 0 : dramatic ? -3 : 0;

  const rule = (style: React.CSSProperties, key: string, color = ink) => (
    <div key={key} className={common} style={{ background: color, ...style }} />
  );

  const frame = (style: React.CSSProperties, key: string, color = ink) => (
    <div key={key} className={common} style={{ border: `1px solid ${color}`, ...style }} />
  );

  const circle = (style: React.CSSProperties, key: string, color: string, opacity = 1) => (
    <div key={key} className={common} style={{ borderRadius: '50%', background: color, opacity, ...style }} />
  );

  const ring = (style: React.CSSProperties, key: string, color: string, width = 12, opacity = 1) => (
    <div key={key} className={common} style={{ borderRadius: '50%', border: `${width}px solid ${color}`, opacity, ...style }} />
  );

  const square = (style: React.CSSProperties, key: string, color: string, opacity = 1) => (
    <div key={key} className={common} style={{ background: color, opacity, ...style }} />
  );

  const diagonal = (style: React.CSSProperties, key: string, color: string, width = 'clamp(18px, 3vw, 54px)') => (
    <div key={key} className={common} style={{ background: color, height: width, transform: `rotate(${angle}deg)`, ...style }} />
  );

  const tinyCross = (left: string, top: string, key: string, color = ink) => (
    <div key={key} className={common} style={{ left, top, width: 18, height: 18 }}>
      {rule({ left: 8, top: 0, width: 2, height: 18 }, `${key}-v`, color)}
      {rule({ left: 0, top: 8, width: 18, height: 2 }, `${key}-h`, color)}
    </div>
  );

  const grid = (opacity = 0.1) => (
    <div className="absolute inset-[6%_5%]" style={{ opacity }}>
      <div className="absolute inset-0 grid grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="border-r" style={{ borderColor: ink }} />)}
      </div>
      <div className="absolute inset-0 grid grid-rows-8">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="border-b" style={{ borderColor: ink }} />)}
      </div>
    </div>
  );

  // Keep the visual system behind the lyric-safe center band. The artwork can
  // approach the text, but it should never become a noisy texture underneath it.

  const variants: React.ReactNode[] = [
    // 0 — Swiss red block / blue counterform
    <>
      {grid(0.075)}
      {square({ left: '0%', top: '12%', width: '34%', height: '22%' }, 'v0-red', p)}
      {square({ right: '0%', bottom: '10%', width: '30%', height: '27%' }, 'v0-blue', s)}
      {circle({ left: '25%', top: '-12%', width: '24vw', height: '24vw' }, 'v0-circle', a)}
      {rule({ left: '8%', top: '37%', width: '31%', height: 3 }, 'v0-rule')}
      {rule({ right: '8%', top: '63%', width: '27%', height: 2 }, 'v0-rule2')}
      {tinyCross('7%', '12%', 'v0-cross', a)}
    </>,

    // 1 — Modular Swiss mosaic
    <>
      {grid(0.055)}
      <div className={common} style={{ left: '6%', top: '10%', width: '32%', height: '25%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)' }}>
        {[p, ink, a, s, s, p, p, ink, a, s, ink, p].map((c, i) => <div key={i} style={{ background: c, opacity: i === 5 || i === 8 ? 1 : 0.9 }} />)}
      </div>
      <div className={common} style={{ right: '7%', top: '14%', width: '23%', height: '45%', display: 'grid', gridTemplateRows: '1fr 1fr 2fr' }}>
        <div style={{ background: a }} />
        <div style={{ background: colors.background, border: `2px solid ${ink}` }} />
        <div style={{ background: p }} />
      </div>
      {rule({ left: '6%', right: '6%', bottom: '14%', height: 4 }, 'v1-bottom', ink)}
    </>,

    // 2 — Diagonal tension / red-blue split
    <>
      {square({ left: '-10%', top: '18%', width: '62%', height: '18%', transform: `rotate(${angle}deg)` }, 'v2-red', p)}
      {square({ right: '-9%', bottom: '18%', width: '58%', height: '20%', transform: `rotate(${angle}deg)` }, 'v2-blue', s)}
      {circle({ right: '7%', top: '7%', width: '18vw', height: '18vw' }, 'v2-yellow', a)}
      {frame({ left: '10%', top: '15%', width: '28%', height: '52%', transform: 'rotate(6deg)' }, 'v2-frame', ink)}
      {rule({ left: '8%', top: '72%', width: '25%', height: 3 }, 'v2-rule', ink)}
    </>,

    // 3 — Concentric crop / Bauhaus without floating blobs
    <>
      {ring({ left: '-16vw', top: '8%', width: '45vw', height: '45vw' }, 'v3-ring1', p, 24)}
      {ring({ left: '-9vw', top: '15%', width: '31vw', height: '31vw' }, 'v3-ring2', a, 18)}
      {circle({ right: '-6vw', bottom: '7%', width: '25vw', height: '25vw' }, 'v3-circle', s)}
      {square({ right: '14%', top: '17%', width: '7vw', height: '7vw', transform: 'rotate(45deg)' }, 'v3-diamond', ink)}
      {rule({ left: '8%', right: '8%', top: '80%', height: 2 }, 'v3-rule')}
    </>,

    // 4 — Three-column editorial poster
    <>
      {grid(0.045)}
      {square({ left: '7%', top: '8%', width: '22%', height: '76%' }, 'v4-red', p)}
      {square({ left: '29%', top: '8%', width: '18%', height: '76%' }, 'v4-paper', colors.background, 1)}
      {frame({ left: '29%', top: '8%', width: '18%', height: '76%' }, 'v4-paper-frame', ink)}
      {square({ right: '7%', top: '8%', width: '28%', height: '76%' }, 'v4-blue', s)}
      {square({ right: '18%', top: '15%', width: '7%', height: '15%' }, 'v4-yellow', a)}
      {rule({ left: '29%', top: '18%', width: '13%', height: 4 }, 'v4-rule', ink)}
    </>,

    // 5 — Oversized typographic counterforms / editorial scale
    <>
      <div className={`${common} font-black leading-[.72] tracking-[-.13em]`} style={{ left: '-4%', top: '-12%', fontSize: 'clamp(240px, 38vw, 620px)', color: p, opacity: 0.95 }}>R</div>
      <div className={`${common} font-black leading-[.72] tracking-[-.13em]`} style={{ right: '-7%', bottom: '-15%', fontSize: 'clamp(230px, 36vw, 590px)', color: s, opacity: 0.95 }}>O</div>
      {square({ left: '44%', top: '12%', width: '9vw', height: '9vw' }, 'v5-yellow', a)}
      {rule({ left: '7%', top: '28%', width: '25%', height: 3 }, 'v5-rule', ink)}
      {tinyCross('87%', '12%', 'v5-cross', ink)}
    </>,

    // 6 — Swiss frame / inset poster
    <>
      {frame({ left: '5%', top: '7%', width: '90%', height: '86%', borderWidth: '2px' }, 'v6-outer', ink)}
      {frame({ left: '12%', top: '14%', width: '76%', height: '72%' }, 'v6-inner', p)}
      {square({ left: '12%', top: '14%', width: '16%', height: '16%' }, 'v6-red', p)}
      {square({ right: '12%', bottom: '14%', width: '18%', height: '22%' }, 'v6-blue', s)}
      {circle({ right: '22%', top: '20%', width: '9vw', height: '9vw' }, 'v6-yellow', a)}
      {rule({ left: '12%', right: '12%', bottom: '22%', height: 2 }, 'v6-rule')}
    </>,

    // 7 — Checkerboard / primary-color rhythm
    <>
      <div className={common} style={{ left: '0', top: '9%', width: '37%', height: '38%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)' }}>
        {[ink, p, colors.background, a, s, ink, p, colors.background, a].map((c, i) => <div key={i} style={{ background: c }} />)}
      </div>
      <div className={common} style={{ right: '0', bottom: '8%', width: '39%', height: '35%', display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 2fr' }}>
        <div style={{ background: s }} /><div style={{ background: colors.background }} />
        <div style={{ background: a }} /><div style={{ background: ink }} />
      </div>
      {rule({ left: '5%', right: '5%', top: '49%', height: 3 }, 'v7-rule', p)}
    </>,

    // 8 — Staircase / ascending modules
    <>
      {[0, 1, 2, 3, 4].map(i => square({ left: `${5 + i * 7}%`, bottom: `${12 + i * 5}%`, width: '7%', height: `${12 + i * 5}%` }, `v8-step-${i}`, i % 2 ? p : s))}
      {square({ right: '7%', top: '12%', width: '16%', height: '16%' }, 'v8-yellow', a)}
      {frame({ right: '8%', top: '10%', width: '25%', height: '28%', transform: `rotate(${8 + r2 * 5}deg)` }, 'v8-frame', ink)}
      {rule({ left: '5%', top: '29%', width: '30%', height: 2 }, 'v8-rule', ink)}
    </>,

    // 9 — Registration / print-mark composition
    <>
      {tinyCross('8%', '12%', 'v9-c1', p)}
      {tinyCross('91%', '12%', 'v9-c2', s)}
      {tinyCross('8%', '84%', 'v9-c3', a)}
      {tinyCross('91%', '84%', 'v9-c4', ink)}
      {ring({ left: '17%', top: '13%', width: '20vw', height: '20vw' }, 'v9-ring', p, 10)}
      {square({ right: '12%', top: '20%', width: '13vw', height: '13vw', transform: 'rotate(45deg)' }, 'v9-diamond', a)}
      {rule({ left: '17%', top: '40%', width: '19%', height: 2 }, 'v9-rule', ink)}
      {rule({ right: '12%', bottom: '25%', width: '20%', height: 3 }, 'v9-rule2', s)}
    </>,

    // 10 — Split-field poster
    <>
      {square({ left: '0', top: '0', width: '52%', height: '100%' }, 'v10-field1', p)}
      {square({ right: '0', top: '0', width: '48%', height: '100%' }, 'v10-field2', colors.background)}
      {square({ left: '52%', top: '0', width: '11%', height: '100%' }, 'v10-strip', a)}
      {circle({ right: '-6vw', top: '8%', width: '28vw', height: '28vw' }, 'v10-circle', s)}
      {rule({ left: '52%', top: '15%', width: '28%', height: 3 }, 'v10-rule', ink)}
    </>,

    // 11 — Cut-paper geometry
    <>
      {square({ left: '-4%', top: '12%', width: '36%', height: '44%', transform: 'rotate(-5deg)' }, 'v11-red', p)}
      {circle({ left: '15%', top: '20%', width: '22vw', height: '22vw' }, 'v11-hole', colors.background)}
      {square({ right: '-3%', bottom: '12%', width: '37%', height: '42%', transform: 'rotate(7deg)' }, 'v11-blue', s)}
      {square({ right: '20%', bottom: '23%', width: '10vw', height: '10vw', transform: 'rotate(45deg)' }, 'v11-yellow', a)}
      {rule({ left: '7%', right: '7%', top: '71%', height: 2 }, 'v11-rule')}
    </>,

    // 12 — Dense micro-grid with one dominant mark
    <>
      <div className={common} style={{ left: '6%', top: '9%', width: '29%', height: '74%', backgroundImage: `repeating-linear-gradient(90deg, ${ink} 0 1px, transparent 1px 14px), repeating-linear-gradient(0deg, ${ink} 0 1px, transparent 1px 14px)`, opacity: .17 }} />
      {circle({ right: '-5vw', top: '-4vw', width: '36vw', height: '36vw' }, 'v12-main', p, .95)}
      {circle({ right: '9%', top: '17%', width: '9vw', height: '9vw' }, 'v12-accent', a)}
      {rule({ left: '41%', top: '18%', width: '23%', height: 3 }, 'v12-rule', ink)}
      {frame({ left: '42%', bottom: '15%', width: '27%', height: '17%' }, 'v12-frame', s)}
    </>,

    // 13 — Kinetic bands / strong horizontal rhythm
    <>
      {[14, 23, 32, 67, 76, 85].map((y, i) => rule({ left: i % 2 ? '12%' : '4%', width: i % 2 ? '52%' : '72%', top: `${y}%`, height: i === 0 || i === 5 ? 5 : 2, transform: `translateX(${Math.sin(t / (3.5 + i) + index) * 8}px)` }, `v13-rule-${i}`, i % 3 === 0 ? p : ink))}
      {square({ right: '8%', top: '38%', width: '11vw', height: '11vw' }, 'v13-yellow', a)}
      {square({ left: '18%', top: '38%', width: '8vw', height: '8vw', transform: 'rotate(45deg)' }, 'v13-blue', s)}
    </>,

    // 14 — Vertical type-system architecture
    <>
      {rule({ left: '8%', top: '8%', width: 5, height: '84%' }, 'v14-v1', p)}
      {rule({ left: '13%', top: '8%', width: 1, height: '84%' }, 'v14-v2', ink)}
      {rule({ right: '12%', top: '8%', width: 5, height: '84%' }, 'v14-v3', s)}
      {square({ left: '8%', top: '26%', width: '18%', height: '20%' }, 'v14-red', p)}
      {square({ right: '12%', top: '55%', width: '18%', height: '24%' }, 'v14-blue', s)}
      {circle({ right: '31%', top: '13%', width: '8vw', height: '8vw' }, 'v14-yellow', a)}
      {rule({ left: '13%', top: '76%', width: '30%', height: 2 }, 'v14-rule', ink)}
    </>,

    // 15 — Asymmetric poster collage
    <>
      {square({ left: '5%', top: '8%', width: '22%', height: '25%' }, 'v15-red', p)}
      {square({ left: '27%', top: '8%', width: '11%', height: '25%' }, 'v15-paper', colors.background)}
      {frame({ left: '27%', top: '8%', width: '11%', height: '25%' }, 'v15-paper-frame', ink)}
      {circle({ right: '6%', top: '7%', width: '19vw', height: '19vw' }, 'v15-circle', s)}
      {square({ left: '7%', bottom: '10%', width: '17%', height: '29%', transform: 'rotate(5deg)' }, 'v15-blue', s)}
      {square({ left: '24%', bottom: '12%', width: '12%', height: '17%', transform: 'rotate(-8deg)' }, 'v15-yellow', a)}
      {diagonal({ right: '-4%', bottom: '31%', width: '45%' }, 'v15-diagonal', ink, 'clamp(14px,2vw,32px)')}
      {rule({ right: '7%', bottom: '15%', width: '25%', height: 3 }, 'v15-rule', p)}
    </>,

    // 16 — Full-bleed color field with oversized cutout window
    <>
      {square({ left: '0', top: '0', width: '100%', height: '100%' }, 'v16-field', p)}
      {square({ left: '9%', top: '11%', width: '44%', height: '68%', background: colors.background, transform: `rotate(${-2 + r1 * 4}deg)` }, 'v16-window', colors.background)}
      {circle({ right: '-7vw', top: '-6vw', width: '34vw', height: '34vw' }, 'v16-circle', s)}
      {square({ right: '11%', bottom: '12%', width: '17%', height: '25%', transform: 'rotate(-9deg)' }, 'v16-accent', a)}
      {rule({ left: '9%', bottom: '20%', width: '32%', height: 5 }, 'v16-rule', ink)}
    </>,

    // 17 — Swiss magazine cover: image-window + headline bars
    <>
      {frame({ left: '7%', top: '8%', width: '52%', height: '76%', borderWidth: '3px' }, 'v17-frame', ink)}
      {square({ left: '11%', top: '13%', width: '44%', height: '46%' }, 'v17-image', s)}
      {circle({ left: '25%', top: '24%', width: '15vw', height: '15vw' }, 'v17-hole', colors.background)}
      {rule({ left: '7%', top: '89%', width: '62%', height: 7 }, 'v17-headline', p)}
      {rule({ right: '8%', top: '17%', width: '18%', height: 3 }, 'v17-rule1', a)}
      {rule({ right: '8%', top: '23%', width: '11%', height: 2 }, 'v17-rule2', ink)}
      {square({ right: '9%', bottom: '14%', width: '12%', height: '18%' }, 'v17-block', p)}
    </>,

    // 18 — Giant diagonal split with counter-strip
    <>
      {square({ left: '-12%', top: '36%', width: '124%', height: '30%', transform: `rotate(${-7 + r2 * 4}deg)` }, 'v18-band', p)}
      {square({ left: '6%', top: '11%', width: '30%', height: '23%' }, 'v18-blue', s)}
      {square({ right: '6%', bottom: '12%', width: '26%', height: '25%' }, 'v18-yellow', a)}
      {circle({ right: '17%', top: '9%', width: '14vw', height: '14vw' }, 'v18-circle', ink)}
      {rule({ left: '8%', bottom: '24%', width: '24%', height: 3 }, 'v18-rule', ink)}
    </>,

    // 19 — Bullseye / target system with offset rectangles
    <>
      {circle({ left: '6%', top: '10%', width: '35vw', height: '35vw' }, 'v19-c1', p)}
      {circle({ left: '13.5%', top: '17.5%', width: '20vw', height: '20vw' }, 'v19-c2', colors.background)}
      {circle({ left: '20%', top: '24%', width: '7vw', height: '7vw' }, 'v19-c3', a)}
      {square({ right: '8%', top: '13%', width: '20%', height: '31%' }, 'v19-blue', s)}
      {square({ right: '15%', bottom: '11%', width: '11%', height: '16%', transform: 'rotate(45deg)' }, 'v19-diamond', p)}
      {rule({ left: '48%', top: '74%', width: '35%', height: 2 }, 'v19-rule', ink)}
    </>,

    // 20 — L-shaped architectural frame
    <>
      {rule({ left: '7%', top: '8%', width: '2vw', minWidth: 10, height: '72%' }, 'v20-v', p)}
      {rule({ left: '7%', top: '8%', width: '54%', height: '2vw', minHeight: 10 }, 'v20-h', p)}
      {rule({ right: '9%', bottom: '10%', width: '38%', height: 3 }, 'v20-rule', s)}
      {square({ left: '16%', bottom: '10%', width: '22%', height: '23%' }, 'v20-blue', s)}
      {square({ right: '9%', top: '14%', width: '12%', height: '19%' }, 'v20-yellow', a)}
      {circle({ right: '21%', top: '35%', width: '12vw', height: '12vw' }, 'v20-circle', p)}
    </>,

    // 21 — Layered paper strips / editorial collage
    <>
      {square({ left: '3%', top: '17%', width: '61%', height: '18%', transform: 'rotate(-4deg)' }, 'v21-strip1', p)}
      {square({ left: '14%', top: '37%', width: '70%', height: '16%', transform: 'rotate(3deg)' }, 'v21-strip2', s)}
      {square({ left: '4%', top: '58%', width: '55%', height: '19%', transform: 'rotate(-2deg)' }, 'v21-strip3', a)}
      {frame({ right: '8%', top: '12%', width: '20%', height: '70%', transform: 'rotate(6deg)' }, 'v21-frame', ink)}
      {circle({ right: '13%', top: '29%', width: '10vw', height: '10vw' }, 'v21-circle', colors.background)}
    </>,

    // 22 — Modular Swiss staircase with alternating color rhythm
    <>
      {[0,1,2,3,4,5].map(i => square({ left: `${6 + i * 8}%`, top: `${62 - i * 7}%`, width: '8%', height: `${13 + i * 5}%` }, `v22-step-${i}`, [p, s, a, ink, p, s][i]))}
      {square({ right: '7%', top: '10%', width: '19%', height: '18%' }, 'v22-top', a)}
      {rule({ left: '6%', top: '84%', width: '54%', height: 2 }, 'v22-rule', ink)}
      {tinyCross('88%', '83%', 'v22-cross', ink)}
    </>,

    // 23 — Oversized cropped circle + narrow text rails
    <>
      {circle({ left: '-17vw', top: '8%', width: '52vw', height: '52vw' }, 'v23-big', s)}
      {circle({ left: '-2vw', top: '23%', width: '22vw', height: '22vw' }, 'v23-hole', colors.background)}
      {rule({ right: '8%', top: '12%', width: '34%', height: 5 }, 'v23-rail1', p)}
      {rule({ right: '8%', top: '19%', width: '24%', height: 2 }, 'v23-rail2', ink)}
      {rule({ right: '8%', bottom: '18%', width: '38%', height: 3 }, 'v23-rail3', a)}
      {square({ right: '12%', bottom: '27%', width: '10%', height: '16%' }, 'v23-block', p)}
    </>,

    // 24 — Black/ink field with bright paper cutout and primary accents
    <>
      {square({ left: '0', top: '0', width: '100%', height: '100%' }, 'v24-field', ink)}
      {square({ left: '10%', top: '14%', width: '58%', height: '62%' }, 'v24-paper', colors.background)}
      {circle({ right: '5%', top: '10%', width: '19vw', height: '19vw' }, 'v24-red', p)}
      {square({ right: '11%', bottom: '12%', width: '12%', height: '21%' }, 'v24-yellow', a)}
      {rule({ left: '10%', bottom: '17%', width: '39%', height: 4 }, 'v24-rule', s)}
    </>,

    // 25 — Offset grid / poster crop
    <>
      <div className={common} style={{ left: '-4%', top: '8%', width: '60%', height: '82%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(6,1fr)', transform: 'rotate(-3deg)' }}>
        {Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ background: [colors.background, p, colors.background, ink, s, colors.background][i % 6], border: `1px solid ${colors.background}55` }} />)}
      </div>
      {circle({ right: '-4vw', top: '18%', width: '31vw', height: '31vw' }, 'v25-circle', a)}
      {frame({ right: '9%', bottom: '12%', width: '23%', height: '24%' }, 'v25-frame', ink)}
    </>,

    // 26 — Swiss flag-inspired cross abstraction
    <>
      {square({ left: '10%', top: '11%', width: '46%', height: '70%' }, 'v26-field', p)}
      {rule({ left: '27%', top: '19%', width: '12%', height: '54%' }, 'v26-cross-v', colors.background)}
      {rule({ left: '16%', top: '40%', width: '34%', height: '12%' }, 'v26-cross-h', colors.background)}
      {circle({ right: '9%', top: '10%', width: '17vw', height: '17vw' }, 'v26-circle', s)}
      {square({ right: '13%', bottom: '14%', width: '11%', height: '20%', transform: 'rotate(-15deg)' }, 'v26-accent', a)}
      {rule({ right: '8%', bottom: '10%', width: '25%', height: 3 }, 'v26-rule', ink)}
    </>,

    // 27 — Dense editorial matrix with one disruptive diagonal
    <>
      <div className={common} style={{ left: '7%', top: '10%', width: '76%', height: '72%', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gridTemplateRows: 'repeat(5,1fr)', gap: 3, opacity: .95 }}>
        {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ background: [colors.background, p, colors.background, s, ink, a, colors.background][(i * 3 + index) % 7] }} />)}
      </div>
      {diagonal({ left: '-7%', top: '47%', width: '118%' }, 'v27-diagonal', ink, 'clamp(10px,1.5vw,24px)')}
      {circle({ right: '9%', top: '11%', width: '8vw', height: '8vw' }, 'v27-circle', a)}
      {tinyCross('8%', '83%', 'v27-cross', p)}
    </>,
  ];

  const variantNode = variants[Math.abs(Math.floor(variant)) % variants.length];

  // A poster should not only change its ingredients; its underlying spatial
  // grammar should change too. These layout mutations deliberately rearrange
  // the same visual vocabulary into different editorial structures.
  const layoutSeed = seed + 701 + Math.floor(r1 * 997);
  const layoutMode = Math.abs(Math.floor(layoutSeed)) % 14;
  const shiftX = [-2.5, 1.8, -1.2, 2.2, 0, -3.4, 3.1, -1.8, 2.8, 0.9, -2.1, 1.4, -3.8, 2.6][layoutMode];
  const shiftY = [1.5, -1.8, 2.4, -2.2, 0, 2.8, -2.6, 1.1, -1.4, 2.1, -2.9, 0.8, 2.3, -1.7][layoutMode];
  const rotate = [-1.5, 1.2, -2.2, 1.8, 0, 2.5, -1.1, 1.6, -2.8, 0.8, -1.7, 2.1, -0.9, 1.3][layoutMode];
  const scale = [1.04, 1.08, 1.02, 1.1, 1, 1.12, 1.06, 1.03, 1.09, 1.02, 1.07, 1.04, 1.11, 1.05][layoutMode];

  const layoutScaffold = [
    // Edge-heavy left field
    square({ left: '-5%', top: '8%', width: '30%', height: '84%' }, 'layout-left', p, .72),
    // Offset right field
    square({ right: '-7%', top: '18%', width: '35%', height: '58%' }, 'layout-right', s, .72),
    // Top editorial band
    square({ left: '0%', top: '-4%', width: '100%', height: '25%' }, 'layout-top', p, .55),
    // Bottom editorial band
    square({ left: '0%', bottom: '-5%', width: '100%', height: '28%' }, 'layout-bottom', s, .55),
    // Split-axis structure
    <>
      {rule({ left: '11%', top: '7%', width: '2px', height: '86%', opacity: .65 }, 'layout-axis-v', ink)}
      {rule({ left: '8%', top: '74%', width: '84%', height: '2px', opacity: .65 }, 'layout-axis-h', ink)}
    </>,
    // Corner crop / diagonal field
    square({ left: '-18%', top: '46%', width: '72%', height: '42%', transform: 'rotate(-8deg)' }, 'layout-crop', a, .6),
    // Counterweight corner
    square({ right: '-4%', top: '-6%', width: '43%', height: '38%', transform: 'rotate(5deg)' }, 'layout-counter', p, .62),
    // Vertical spine
    square({ left: '42%', top: '-4%', width: '16%', height: '108%' }, 'layout-spine', colors.background, .38),
    // Horizontal spine
    square({ left: '-4%', top: '42%', width: '108%', height: '17%' }, 'layout-spine-h', colors.background, .38),
    // Offset window
    frame({ left: '14%', top: '11%', width: '66%', height: '72%', borderWidth: '3px', opacity: .72 }, 'layout-window', ink),
    // Cropped circular counterform
    circle({ left: '-14vw', bottom: '-11vw', width: '42vw', height: '42vw' }, 'layout-orbit', a, .68),
    // Narrow asymmetric rail
    <>
      {rule({ left: '6%', top: '12%', width: '72%', height: 5, opacity: .65 }, 'layout-rail-1', p)}
      {rule({ left: '19%', top: '19%', width: '42%', height: 2, opacity: .55 }, 'layout-rail-2', ink)}
    </>,
    // Full-bleed offset field
    square({ left: '-3%', top: '15%', width: '106%', height: '54%', transform: 'skewX(-5deg)' }, 'layout-field', p, .42),
    // Asymmetric bottom-right block
    square({ right: '7%', bottom: '8%', width: '31%', height: '31%', transform: 'rotate(-4deg)' }, 'layout-block', a, .65),
  ][layoutMode];

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.92, scale: 1.01, rotate: grammarAngle * 0.18 }}
        animate={{ opacity: semanticOpacity, scale: 1, rotate: 0 }}
        transition={{ duration: quiet ? 1.1 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        {layoutScaffold}
        <div
          className="absolute inset-[-4%]"
          style={{ transform: `translate(${shiftX}%, ${shiftY}%) rotate(${rotate}deg) scale(${scale})`, transformOrigin: 'center center' }}
        >
          {variantNode}
        </div>
      </motion.div>

      {/* Lyric-aware secondary grammar. These marks are generated from the lyric
          profile, so they reinforce the typography instead of acting as random
          decoration. */}
      {quiet && (
        <>
          {rule({ left: '10%', right: '10%', top: '82%', height: 1, opacity: 0.38 }, 'grammar-quiet-rule', ink)}
          {tinyCross('10%', '82%', 'grammar-quiet-cross', p)}
        </>
      )}

      {profile?.isShort && !quiet && (
        <>
          {circle({ right: '9%', top: '12%', width: `${Math.max(7, 9 * artScale)}vw`, height: `${Math.max(7, 9 * artScale)}vw` }, 'grammar-short-circle', a, 0.92)}
          {rule({ right: '9%', top: '24%', width: '18%', height: 3, transform: `rotate(${grammarAngle}deg)` }, 'grammar-short-rule', ink)}
        </>
      )}

      {profile?.isLong && (
        <div className={common} style={{ left: '7%', right: '7%', bottom: '10%', height: `${Math.max(7, 9 * artScale)}%`, display: 'grid', gridTemplateColumns: `repeat(${Math.min(12, Math.max(6, Math.round(profile.japaneseLength / 2)))}, 1fr)`, opacity: Math.min(0.42, 0.16 + artDensity * 0.3) }}>
          {Array.from({ length: Math.min(12, Math.max(6, Math.round(profile.japaneseLength / 2))) }).map((_, i) => (
            <div key={i} style={{ borderRight: `1px solid ${ink}` }} />
          ))}
        </div>
      )}

      {repeated && (
        <div className={common} style={{ left: '7%', top: '8%', display: 'flex', gap: 6, opacity: 0.45 }}>
          {Array.from({ length: Math.min(7, Math.max(3, Math.round((profile?.repetition ?? 0) * 18))) }).map((_, i) => (
            <div key={i} style={{ width: 8 + i * 2, height: 8 + i * 2, background: i % 2 ? a : p, transform: `translateY(${i % 2 ? 5 : 0}px) rotate(${i * 7 - 10}deg)` }} />
          ))}
        </div>
      )}

      {profile?.hasQuestion && (
        <div className={common} style={{ right: '7%', bottom: '9%', fontSize: 'clamp(24px, 5vw, 72px)', fontWeight: 800, color: a, lineHeight: 0.7, opacity: 0.9 }}>
          ?
        </div>
      )}

      {/* Family-specific finishing device: subtle, never enough to compete with lyrics. */}
      {family === 'typographic-monument' && (
        <div className={`${common} font-black tracking-[-0.1em]`} style={{ right: '4%', top: '4%', fontSize: 'clamp(10px, 1vw, 15px)', color: ink, opacity: .7 }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      )}
      {family === 'kinetic-rules' && (
        <motion.div className={common} style={{ left: '5%', top: '5%', width: '12%', height: 3, background: p }} animate={{ scaleX: [1, .7, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
      )}

      {/* Tiny editorial registration marks make the composition feel printed rather than generically digital. */}
      <div className={common} style={{ left: '5%', bottom: '5%', fontSize: 8, letterSpacing: '.28em', color: ink, opacity: .35 }}>
        R / {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
};

export default SwissPosterArt;
