import { renderHook } from "@testing-library/react-hooks";

import useAnimationFrame from "../src";
import mockRaf, { STEP_TIME_INCREMENT } from "./utils/mockRaf";

describe("useAnimationFrame", () => {
  beforeEach(() => {
    mockRaf.use();
  });

  afterEach(() => {
    mockRaf.restore();
  });

  it("will increment time after one RAF", async () => {
    let lastDelta: number | null = -10;
    let lastTime: number | null = -10;

    const callback = (delta: number, time: number) => {
      lastDelta = delta;
      lastTime = time;
    };

    renderHook(() => useAnimationFrame(callback));

    mockRaf.step();

    expect(lastDelta).toEqual(STEP_TIME_INCREMENT);
    expect(lastTime).toEqual(STEP_TIME_INCREMENT);
  });

  it("will increment time after multiple RAFs", async () => {
    let lastDelta: number | null = -10;
    let lastTime: number | null = -10;

    const callback = (delta: number, time: number) => {
      lastDelta = delta;
      lastTime = time;
    };

    renderHook(() => useAnimationFrame(callback));

    mockRaf.step();
    mockRaf.step();

    expect(lastDelta).toEqual(STEP_TIME_INCREMENT);
    expect(lastTime).toEqual(STEP_TIME_INCREMENT * 2);
  });

  it("will cleanup after unmounting", async () => {
    const callback = () => null;
    const { unmount } = renderHook(() => useAnimationFrame(callback));
    unmount();
    expect(mockRaf.rafCount()).toEqual(0);
  });
});
