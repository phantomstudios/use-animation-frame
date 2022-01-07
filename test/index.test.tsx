import { renderHook } from "@testing-library/react-hooks";

import useAnimationFrame from "../src";
import mockRequestAnimationFrame, {
  STEP_TIME_INCREMENT,
} from "./utils/mockRequestAnimationFrame";

describe("The hook", () => {
  beforeEach(() => mockRequestAnimationFrame.use());

  afterEach(() => mockRequestAnimationFrame.restore());

  it("will increment time after one requestAnimationFrame", async () => {
    let lastDeltaTime = 0;

    const callback = (deltaTime: number) => (lastDeltaTime = deltaTime);

    renderHook(() => useAnimationFrame(callback));

    mockRequestAnimationFrame.step();

    expect(lastDeltaTime).toEqual(STEP_TIME_INCREMENT);
  });

  it("will increment time after multiple requestAnimationFrames", async () => {
    let lastDeltaTime = 0;

    const callback = (deltaTime: number) => (lastDeltaTime = deltaTime);

    renderHook(() => useAnimationFrame(callback));

    mockRequestAnimationFrame.step();
    mockRequestAnimationFrame.step();

    expect(lastDeltaTime).toEqual(STEP_TIME_INCREMENT * 2);
  });

  it("will cleanup after unmounting", async () => {
    const callback = () => null;
    const { unmount } = renderHook(() => useAnimationFrame(callback));
    unmount();
    expect(mockRequestAnimationFrame.requestAnimationFrameCount()).toEqual(0);
  });
});
