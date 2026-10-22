export type World = 'paper' | 'academic' | 'practice' | 'money' | 'plum';
export type SceneKind = 'hook' | 'cards' | 'process' | 'network' | 'summary';
export type PresenterMode = 'full' | 'circle' | 'none';

export type Point = {
  label: string;
  detail?: string;
};

export type Caption = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type VideoScene = {
  id: string;
  kind: SceneKind;
  world: World;
  durationInFrames: number;
  kicker?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  presenterMode: PresenterMode;
  sourceStartFrame: number;
  points?: Point[];
};

export type VideoJob = {
  version: '1';
  template: 'multi-world-editorial';
  title: string;
  inputVideo?: string;
  subtitles?: string;
  fps: number;
  width: number;
  height: number;
  brand: {
    name: string;
    accent: string;
    secondary: string;
  };
  presenter: {
    cropX: number;
    cropY: number;
    scale: number;
  };
  captions?: Caption[];
  scenes: VideoScene[];
  selectedSceneIndex?: number;
};
