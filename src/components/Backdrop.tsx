import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {World} from '../types';

const backgrounds: Record<World, string> = {
  paper: 'radial-gradient(circle at 72% 24%,#FFFFFF 0%,#F7F2EA 42%,#EDE6DA 100%)',
  academic: 'radial-gradient(circle at 78% 22%,#244A83 0%,#0A2549 38%,#061323 82%)',
  practice: 'radial-gradient(circle at 22% 35%,#20473E 0%,#112925 38%,#080F10 80%)',
  money: 'radial-gradient(circle at 76% 28%,#4C3511 0%,#21190D 34%,#090908 78%)',
  plum: 'radial-gradient(circle at 24% 35%,#43213C 0%,#211529 38%,#090B12 82%)',
};

export const worldInk = (world: World) => world === 'paper' ? '#090B0C' : '#F4F7F8';
export const worldSoft = (world: World) => world === 'paper' ? '#625F59' : '#C4CCD2';

export const Backdrop: React.FC<React.PropsWithChildren<{world: World; accent: string}>> = ({world, accent, children}) => {
  const frame = useCurrentFrame();
  const light = world === 'paper';
  const drift = interpolate(Math.sin(frame / 60), [-1, 1], [-18, 18]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', color: worldInk(world), background: backgrounds[world], fontFamily: '"Noto Sans SC","Microsoft YaHei",sans-serif'}}>
      <AbsoluteFill style={{opacity: light ? 0.07 : 0.12, backgroundImage: `linear-gradient(${light ? '#111' : '#FFF'} 1px,transparent 1px),linear-gradient(90deg,${light ? '#111' : '#FFF'} 1px,transparent 1px)`, backgroundSize: '96px 96px', transform: `translate(${drift}px,${drift * -0.35}px)`, maskImage: 'linear-gradient(to bottom,black,transparent 90%)'}} />
      <div style={{position: 'absolute', width: 650, height: 650, right: -240, top: -280, borderRadius: '50%', border: `2px solid ${light ? '#1112' : '#FFF2'}`, boxShadow: `0 0 130px ${accent}22`}} />
      {children}
    </AbsoluteFill>
  );
};
