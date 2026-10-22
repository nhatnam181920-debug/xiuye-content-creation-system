import React from 'react';
import {Composition} from 'remotion';
import {demoJob, totalFrames} from './demoJob';
import {FullComposition, SceneClip} from './FullComposition';
import type {VideoJob} from './types';

export const Root: React.FC = () => (
  <>
    <Composition
      id="XiuyeAnimationFull"
      component={FullComposition}
      durationInFrames={totalFrames(demoJob)}
      fps={demoJob.fps}
      width={demoJob.width}
      height={demoJob.height}
      defaultProps={demoJob}
      calculateMetadata={({props}: {props: VideoJob}) => ({durationInFrames: totalFrames(props), fps: props.fps, width: props.width, height: props.height})}
    />
    <Composition
      id="XiuyeAnimationScene"
      component={SceneClip}
      durationInFrames={demoJob.scenes[0].durationInFrames}
      fps={demoJob.fps}
      width={demoJob.width}
      height={demoJob.height}
      defaultProps={demoJob}
      calculateMetadata={({props}: {props: VideoJob}) => {
        const index = Math.max(0, Math.min(props.selectedSceneIndex ?? 0, props.scenes.length - 1));
        return {durationInFrames: props.scenes[index].durationInFrames, fps: props.fps, width: props.width, height: props.height};
      }}
    />
  </>
);
