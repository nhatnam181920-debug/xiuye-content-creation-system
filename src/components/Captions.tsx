import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {Caption} from '../types';

export const Captions: React.FC<{captions?: Caption[]}> = ({captions = []}) => {
  const frame = useCurrentFrame();
  const active = captions.find((caption) => frame >= caption.startFrame && frame < caption.endFrame);
  if (!active) return null;
  return (
    <div style={{position: 'absolute', left: 220, right: 220, bottom: 48, zIndex: 200, textAlign: 'center', pointerEvents: 'none'}}>
      <span style={{display: 'inline-block', maxWidth: 1420, padding: '14px 24px 16px', borderRadius: 12, color: '#FFF', background: 'rgba(4,6,8,.82)', boxShadow: '0 10px 35px rgba(0,0,0,.28)', fontFamily: '"Noto Sans SC","Microsoft YaHei",sans-serif', fontSize: 38, fontWeight: 750, lineHeight: 1.25}}>{active.text}</span>
    </div>
  );
};
