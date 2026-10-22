import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Captions} from './components/Captions';
import {EditorialScene} from './templates/MultiWorldEditorial';
import type {VideoJob} from './types';

export const FullComposition: React.FC<VideoJob> = (job) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{background: '#090B0C'}}>
      {job.scenes.map((scene) => {
        const from = cursor;
        cursor += scene.durationInFrames;
        return <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames}><EditorialScene job={job} scene={scene} /></Sequence>;
      })}
      <Captions captions={job.captions} />
    </AbsoluteFill>
  );
};

export const SceneClip: React.FC<VideoJob> = (job) => {
  const index = Math.max(0, Math.min(job.selectedSceneIndex ?? 0, job.scenes.length - 1));
  return <EditorialScene job={job} scene={job.scenes[index]} />;
};
