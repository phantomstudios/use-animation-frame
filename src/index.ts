import { useCallback, useEffect, useRef } from "react";

export type RafCallback = (delta: number, time: number) => void;

const useAnimationFrame = (callback: RafCallback) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);
  const mounted = useRef(false);

  const animate = useCallback(
    (time: number) => {
      if (!mounted.current) return;
      const delta = time - previousTimeRef.current;
      callback(delta, time);
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    mounted.current = true;
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      mounted.current = false;
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    };
  }, [animate]); // Make sure the effect runs only once
};

export default useAnimationFrame;
