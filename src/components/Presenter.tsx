import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import type {VideoJob} from '../types';

const Placeholder: React.FC<{label: string}> = ({label}) => (
  <AbsoluteFill style={{display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg,#1B2229,#080B0E)', color: '#C8FF42', fontFamily: 'monospace', fontSize: 25, letterSpacing: 4}}>
    <div style={{textAlign: 'center'}}><div style={{fontSize: 92}}>◎</div>{label}</div>
  </AbsoluteFill>
);

const Media: React.FC<{job: VideoJob; startFrom: number}> = ({job, startFrom}) => job.inputVideo ? (
  <OffthreadVideo
    src={staticFile(job.inputVideo)}
    startFrom={startFrom}
    muted
    style={{position: 'absolute', left: '50%', top: '50%', width: `${job.presenter.scale * 100}%`, height: `${job.presenter.scale * 100}%`, maxWidth: 'none', objectFit: 'cover', objectPosition: `${job.presenter.cropX}% ${job.presenter.cropY}%`, transform: 'translate(-50%,-50%)'}}
  />
) : <Placeholder label="PRESENTER" />;

export const CirclePresenter: React.FC<{job: VideoJob; startFrom: number; size?: number; accent: string}> = ({job, startFrom, size = 315, accent}) => (
  <div style={{position: 'relative', width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${accent}`, background: '#090B0C', boxShadow: '0 28px 72px rgba(0,0,0,.34)'}}>
    <Media job={job} startFrom={startFrom} />
  </div>
);

export const FullPresenter: React.FC<React.PropsWithChildren<{job: VideoJob; startFrom: number}>> = ({job, startFrom, children}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#090B0C'}}>
    <Media job={job} startFrom={startFrom} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(5,8,13,.82) 0%,rgba(5,8,13,.5) 45%,rgba(5,8,13,.08) 78%)'}} />
    {children}
  </AbsoluteFill>
);
