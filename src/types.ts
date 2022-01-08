export type AnimationFrameCallback = (deltaTime: number) => void;

export interface Interval {
  /** Interval between callback triggers in seconds. */
  framesPerSecondInterval: number;

  /** Time since callback was last triggered. */
  deltaTime: number;

  /** Used to store elapsed time since previous frames. */
  elapsedTime: number;
}

export interface Observer {
  /** Callback that's called every new animation frame window. */
  callback: AnimationFrameCallback;

  /** Custom interval used to control how often callback triggers. */
  interval?: Interval;
}
