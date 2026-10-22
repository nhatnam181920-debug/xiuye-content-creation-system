import React from 'react';
import type {World} from '../types';
import {worldSoft} from './Backdrop';

export const Header: React.FC<{brand: string; chapter?: string; world: World; accent: string}> = ({brand, chapter, world, accent}) => (
  <div style={{position: 'absolute', left: 62, right: 62, top: 35, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Geist Mono","Microsoft YaHei",monospace', fontSize: 18, letterSpacing: 2.2, color: worldSoft(world)}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{width: 10, height: 10, borderRadius: 99, background: accent, boxShadow: world === 'paper' ? 'none' : `0 0 13px ${accent}`}} /><span>{brand}</span></div>
    <span style={{opacity: 0.8}}>{chapter}</span>
  </div>
);
