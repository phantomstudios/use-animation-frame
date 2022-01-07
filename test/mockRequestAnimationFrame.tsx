type requestID = number;

interface RequestAnimationFrameRef {
  requestId: requestID;
  callback: FrameRequestCallback;
}

export const STEP_TIME_INCREMENT = 16;

let originalRequestAnimationFrame: (callback: FrameRequestCallback) => number;
let originalCancelAnimationFrame: (requestId: requestID) => void;
let requestAnimationFrames: RequestAnimationFrameRef[] = [];
let currentTime = 0;
let lastRequestID = 0;

const fakeRequestAnimationFrame = (
  callback: FrameRequestCallback
): requestID => {
  const requestId = lastRequestID++;
  requestAnimationFrames.push({ requestId, callback });
  return requestId;
};

const fakeCancelAnimationFrame = (requestId: requestID): void => {
  const index = requestAnimationFrames.findIndex(
    (frame) => frame.requestId === requestId
  );
  requestAnimationFrames.splice(index, 1);
};

const use = () => {
  originalRequestAnimationFrame = window.requestAnimationFrame;
  originalCancelAnimationFrame = window.cancelAnimationFrame;
  window.requestAnimationFrame = fakeRequestAnimationFrame;
  window.cancelAnimationFrame = fakeCancelAnimationFrame;
};

const restore = () => {
  currentTime = 0;
  lastRequestID = 0;
  requestAnimationFrames = [];
  window.requestAnimationFrame = originalRequestAnimationFrame;
  window.cancelAnimationFrame = originalCancelAnimationFrame;
};

const step = () => {
  currentTime += STEP_TIME_INCREMENT;
  const currentRequestAnimationFrames = requestAnimationFrames;
  requestAnimationFrames = [];
  currentRequestAnimationFrames.forEach((ref) => ref.callback(currentTime));
};

export default {
  use,
  restore,
  step,
  requestAnimationFrameCount: () => requestAnimationFrames.length,
};
