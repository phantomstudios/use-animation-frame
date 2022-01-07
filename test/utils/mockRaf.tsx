type requestID = number;

interface RafRef {
  requestId: requestID;
  callback: FrameRequestCallback;
}

export const STEP_TIME_INCREMENT = 16;

let originalRaf: (callback: FrameRequestCallback) => number;
let originalCaf: (handle: number) => void;
let rafs: RafRef[] = [];
let currentTime = 0;
let lastRequestID = 0;

const fakeRaf = (callback: FrameRequestCallback): requestID => {
  const requestId = lastRequestID++;
  rafs.push({ requestId, callback });
  return requestId;
};

const fakeCaf = (requestId: requestID): void => {
  const index = rafs.findIndex((r) => r.requestId === requestId);
  rafs.splice(index, 1);
};

const use = () => {
  originalRaf = window.requestAnimationFrame;
  originalCaf = window.cancelAnimationFrame;
  window.requestAnimationFrame = fakeRaf;
  window.cancelAnimationFrame = fakeCaf;
};

const restore = () => {
  currentTime = 0;
  lastRequestID = 0;
  rafs = [];
  window.requestAnimationFrame = originalRaf;
  window.cancelAnimationFrame = originalCaf;
};

const step = () => {
  currentTime += STEP_TIME_INCREMENT;
  const currentRafs = rafs;
  rafs = [];
  currentRafs.foreach((ref) => ref.callback(currentTime));
};

export default {
  use,
  restore,
  step,
  rafCount: () => rafs.length,
};
