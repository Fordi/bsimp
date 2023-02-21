import { useCallback, useEffect } from 'preact/hooks';

export const useEventListener = (target, eventName, handler, deps) => {
  const listener = useCallback(handler, deps);
  useEffect(() => {
    target.addEventListener(eventName, listener);
    return () => target.removeEventListener(eventName, listener);
  }, [target, eventName, listener]);
};
