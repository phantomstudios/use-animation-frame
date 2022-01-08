import { useEffect } from "react";

import { isBrowser } from "browser-or-node";

import { Interval, Observer, AnimationFrameCallback } from "./types";

const observers: Observer[] = [];
let currentFrame: number | undefined;
let previousTime = 0;

const handleIntervalObserverCallback = (
  callback: AnimationFrameCallback,
  interval: Interval
): void => {
  interval.deltaTime = previousTime - interval.elapsedTime;

  // If time since last frame exceeds FPS interval, emit callback
  if (interval.deltaTime >= interval.framesPerSecondInterval) {
    callback(interval.deltaTime);
    interval.elapsedTime =
      previousTime - (interval.deltaTime % interval.framesPerSecondInterval);
  }
};

const handleNextFrame = (timeStamp?: number): void => {
  // If first frame
  if (timeStamp === undefined) timeStamp = 0;

  // Calculate shared time since last frame
  const deltaTime = timeStamp - previousTime;
  previousTime = timeStamp;

  observers.forEach(({ callback, interval }) => {
    !interval
      ? callback(deltaTime)
      : handleIntervalObserverCallback(callback, interval);
  });

  requestFrame();
};

const requestFrame = (firstFrame?: boolean): void => {
  if (!isBrowser || (firstFrame && currentFrame !== undefined)) return;

  currentFrame = requestAnimationFrame(handleNextFrame);
};

const stopRequestingFrames = (): void => {
  if (!isBrowser || currentFrame === undefined) return;

  cancelAnimationFrame(currentFrame);
  currentFrame = undefined;
  previousTime = 0;
};

const addObserver = (observer: Observer): void => {
  // If callback doesn't already exist, add to list of observers
  const index = observers.indexOf(observer);
  if (~index) return;
  observers.push(observer);

  // If this is first observer, start requesting animation frames...
  if (observers.length === 1) requestFrame(true);
};

const removeObserver = (observer: Observer): void => {
  // Remove callback from existing list of observers
  const index = observers.indexOf(observer);
  if (!~index) return;
  observers.splice(index, 1);

  // If this was last observer, stop...
  if (!observers.length) stopRequestingFrames();
};

const createInterval = (framesPerSecond: number): Interval => ({
  framesPerSecondInterval: 1000 / framesPerSecond,
  deltaTime: 0,
  elapsedTime: 0,
});

/**
 * A hook that runs a shared single `requestAnimationFrame()` for all
 * instances of the hook used.
 *
 * @param frame Callback that's called every animation frame window.
 * @param framesPerSecond Optional parameter to control how often callback
 * triggers. By default callback will trigger around ~60 times
 * per second (approximately every ~16ms), though you can change this,
 * for example, `30` can be used to trigger callback ~30 times per second.
 */
const useAnimationFrame = (
  callback: AnimationFrameCallback,
  framesPerSecond?: number
): void => {
  useEffect(() => {
    const observer: Observer = { callback };
    if (framesPerSecond) observer.interval = createInterval(framesPerSecond);
    addObserver(observer);
    return () => removeObserver(observer);
  }, [callback, framesPerSecond]);
};

export default useAnimationFrame;

export { AnimationFrameCallback } from "./types";
