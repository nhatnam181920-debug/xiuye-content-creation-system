import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Point, VideoJob, VideoScene} from '../types';
import {Backdrop, worldInk, worldSoft} from '../components/Backdrop';
import {CirclePresenter, FullPresenter} from '../components/Presenter';
import {Header} from '../components/Header';

const palette = ['#5B8FFF', '#52D9E6', '#FF9F43', '#FF4A91', '#C8FF42'];

const enter = (frame: number, delay = 0, distance = 34) => {
  const p = interpolate(frame, [delay, delay + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

const HighlightedTitle: React.FC<{scene: VideoScene; accent: string}> = ({scene, accent}) => {
  if (!scene.highlight || !scene.title.includes(scene.highlight)) return <>{scene.title}</>;
  const [before, after] = scene.title.split(scene.highlight);
  return <>{before}<span style={{color: accent, position: 'relative'}}>{scene.highlight}<span style={{position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: accent, transform: 'rotate(-1deg)'}} /></span>{after}</>;
};

const EditorialTitle: React.FC<{job: VideoJob; scene: VideoScene; width?: number}> = ({job, scene, width = 1150}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 76, top: 138, width, ...enter(frame, 0)}}>
      {scene.kicker ? <div style={{fontFamily: 'monospace', color: job.brand.accent, fontSize: 21, letterSpacing: 4, marginBottom: 20}}>{scene.kicker}</div> : null}
      <div style={{fontSize: scene.kind === 'hook' ? 98 : 78, fontWeight: 930, letterSpacing: -3, lineHeight: 1.08}}><HighlightedTitle scene={scene} accent={job.brand.secondary} /></div>
      {scene.subtitle ? <div style={{fontSize: 31, color: worldSoft(scene.world), marginTop: 22, fontWeight: 680, lineHeight: 1.35}}>{scene.subtitle}</div> : null}
    </div>
  );
};

const PointCards: React.FC<{scene: VideoScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const points = scene.points ?? [];
  return (
    <div style={{position: 'absolute', left: 78, right: 78, top: 510, display: 'flex', gap: 20}}>
      {points.map((point, i) => <div key={`${point.label}-${i}`} style={{position: 'relative', flex: 1, minHeight: 250, padding: '34px 34px', boxSizing: 'border-box', borderRadius: 18, color: '#F7FAFC', background: 'rgba(5,12,20,.82)', border: `1px solid ${palette[i % palette.length]}66`, borderTop: `7px solid ${palette[i % palette.length]}`, boxShadow: '0 24px 55px rgba(0,0,0,.2)', ...enter(frame, 28 + i * 16, 48)}}>
        <div style={{fontFamily: 'monospace', color: palette[i % palette.length], fontSize: 18}}>0{i + 1}</div>
        <div style={{fontSize: 49, fontWeight: 900, marginTop: 30, lineHeight: 1.1}}>{point.label}</div>
        {point.detail ? <div style={{fontSize: 25, color: '#C9D1D8', marginTop: 18, lineHeight: 1.3}}>{point.detail}</div> : null}
      </div>)}
    </div>
  );
};

const Process: React.FC<{points: Point[]; accent: string}> = ({points, accent}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [20, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 100, right: 100, top: 545, height: 300}}>
      <div style={{position: 'absolute', left: 58, right: 58, top: 83, height: 6, background: '#FFFFFF25'}} />
      <div style={{position: 'absolute', left: 58, top: 83, height: 6, width: `${progress * 91}%`, background: `linear-gradient(90deg,${accent},#52D9E6,#FF4A91)`}} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>{points.map((point, i) => <div key={`${point.label}-${i}`} style={{width: 320, ...enter(frame, 24 + i * 18)}}><div style={{width: 74, height: 74, borderRadius: '50%', background: palette[i % palette.length], border: '7px solid rgba(255,255,255,.9)', color: '#090B0C', display: 'grid', placeItems: 'center', fontFamily: 'monospace', fontSize: 22, fontWeight: 900}}>0{i + 1}</div><div style={{fontSize: 34, fontWeight: 900, marginTop: 23}}>{point.label}</div>{point.detail ? <div style={{fontSize: 23, color: '#C7D0D0', marginTop: 9}}>{point.detail}</div> : null}</div>)}</div>
    </div>
  );
};

const Network: React.FC<{points: Point[]; accent: string}> = ({points, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 16, stiffness: 90}});
  const positions = [[270, 610], [650, 500], [1050, 660], [1430, 515], [1620, 750]];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.65}}>{points.slice(0, 5).map((_, i) => i === 0 ? null : <line key={i} x1={positions[0][0]} y1={positions[0][1]} x2={positions[i][0]} y2={positions[i][1]} stroke={i === points.length - 1 ? accent : '#FFFFFF55'} strokeWidth={5} strokeDasharray="10 14" />)}</svg>
      {points.slice(0, 5).map((point, i) => <div key={`${point.label}-${i}`} style={{position: 'absolute', left: positions[i][0] - 105, top: positions[i][1] - 105, width: 210, height: 210, borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', background: i === 0 ? accent : 'rgba(5,8,12,.92)', color: i === 0 ? '#090B0C' : '#FFF', border: `5px solid ${i === 0 ? '#FFF' : palette[i % palette.length]}`, boxShadow: '0 20px 50px rgba(0,0,0,.35)', fontSize: 29, fontWeight: 900, opacity: interpolate(frame, [18 + i * 14, 42 + i * 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `scale(${0.75 + scale * 0.25})`}}>{point.label}</div>)}
    </div>
  );
};

const Summary: React.FC<{job: VideoJob; scene: VideoScene}> = ({job, scene}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 80, right: 80, bottom: 150, display: 'flex', gap: 24}}>{(scene.points ?? []).map((point, i) => <div key={`${point.label}-${i}`} style={{padding: '19px 28px', border: `3px solid ${i === 1 ? job.brand.secondary : worldInk(scene.world)}`, borderRadius: 999, fontFamily: 'monospace', fontSize: 24, fontWeight: 850, ...enter(frame, 35 + i * 16)}}>{point.label}</div>)}</div>;
};

const SceneBody: React.FC<{job: VideoJob; scene: VideoScene}> = ({job, scene}) => {
  if (scene.kind === 'cards' || scene.kind === 'hook') return <PointCards scene={scene} />;
  if (scene.kind === 'process') return <Process points={scene.points ?? []} accent={job.brand.accent} />;
  if (scene.kind === 'network') return <Network points={scene.points ?? []} accent={job.brand.accent} />;
  return <Summary job={job} scene={scene} />;
};

export const EditorialScene: React.FC<{job: VideoJob; scene: VideoScene}> = ({job, scene}) => {
  const content = (
    <Backdrop world={scene.world} accent={job.brand.accent}>
      <Header brand={job.brand.name} chapter={scene.kicker} world={scene.world} accent={job.brand.accent} />
      <EditorialTitle job={job} scene={scene} width={scene.presenterMode === 'circle' ? 1220 : 1540} />
      <SceneBody job={job} scene={scene} />
      {scene.presenterMode === 'circle' ? <div style={{position: 'absolute', right: 105, top: 128}}><CirclePresenter job={job} startFrom={scene.sourceStartFrame} accent={job.brand.accent} /></div> : null}
    </Backdrop>
  );
  if (scene.presenterMode !== 'full') return content;
  return <FullPresenter job={job} startFrom={scene.sourceStartFrame}><div style={{position: 'absolute', inset: 0}}><Header brand={job.brand.name} chapter={scene.kicker} world="academic" accent={job.brand.accent} /><EditorialTitle job={job} scene={{...scene, world: 'academic'}} width={920} /></div></FullPresenter>;
};
