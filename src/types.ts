export type AnimateFrameCallback = (deltaTime: number) => void;

export interface Interval {
  fpsInterval: number;
  elapsedTime: number;
  deltaTime: number;
}

export interface Observer {
  /** Callback that's called every new animation frame window. */
  callback: AnimateFrameCallback;

  /** Custom interval used to control how often callback triggers. */
  interval?: Interval;
}
