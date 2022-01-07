import { useEffect } from "react";

import { isBrowser } from "browser-or-node";

import { Interval, Observer } from "./types";

const observers: Observer[] = [];
let currentFrame: number | undefined;
let elapsedTime = 0;

const handleNextFrame = (timeStamp?: number) => {
  // If first frame
  if (timeStamp === undefined) timeStamp = 0;

  // Handle new time since last frame
  const deltaTime = timeStamp - elapsedTime;
  elapsedTime = timeStamp;

  observers.forEach(({ callback, interval }) => {
    // If no interval was set, emit standard uncapped callback
    if (!interval) callback(deltaTime);
    else {
      if (!timeStamp) return;

      // Emit callback every time delta time exceeds fps interval
      interval.deltaTime = timeStamp - interval.elapsedTime;
      if (interval.deltaTime >= interval.fpsInterval) {
        callback(interval.deltaTime);
        interval.elapsedTime =
          timeStamp - (interval.deltaTime % interval.fpsInterval);
      }
    }
  });

  // Request next frame
  currentFrame = requestFrame();
};

const requestFrame = () =>
  isBrowser ? requestAnimationFrame(handleNextFrame) : undefined;

const cancelFrame = () =>
  isBrowser && currentFrame ? cancelAnimationFrame(currentFrame) : undefined;

const startRequestingAnimationFrames = () => {
  if (currentFrame) return;

  // Reset frame values, then start new frame
  elapsedTime = 0;
  currentFrame = undefined;
  currentFrame = requestFrame();
};

const stopRequestingAnimationFrames = () => {
  if (!currentFrame) return;
  cancelFrame();
};

const addObserver = (observer: Observer) => {
  // If callback doesn't already exist, add to list of observers
  const index = observers.indexOf(observer);
  if (~index) return;
  observers.push(observer);

  // On this is first observer, start...
  if (observers.length === 1) startRequestingAnimationFrames();
};

const removeObserver = (observer: Observer) => {
  // Remove callback from existing list of observers
  const index = observers.indexOf(observer);
  if (!~index) return;
  observers.splice(index, 1);

  // If this was last observer, stop...
  if (!observers.length) stopRequestingAnimationFrames();
};

const createInterval = (fps: number): Interval => ({
  fpsInterval: 1000 / fps,
  deltaTime: 0,
  elapsedTime: 0,
});

/**
 * A hook that runs a shared single `requestAnimationFrame()` for all
 * instances of the hook used.
 *
 * @param frame Callback that's called every animation frame window.
 * @param fps Optional callback FPS that can be used to control how often
 * callback triggers. By default callback will trigger around ~60 times per
 * second (approximately every ~16ms), though you can change this, for example,
 * `30` can be used to trigger callback ~30 times per second.
 */
const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  fps?: number
) => {
  useEffect(() => {
    const observer: Observer = { callback };
    if (fps) observer.interval = createInterval(fps);
    addObserver(observer);
    return () => removeObserver(observer);
  }, [callback, fps]);
};

export default useAnimationFrame;

export { AnimateFrameCallback } from "./types";
