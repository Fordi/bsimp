import { useEffect, useState } from 'preact/hooks';
import { useEventListener } from "./useEventListener.mjs";

export const useSharedState = (stateKey, defaultValue) => {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(stateKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    localStorage.setItem(stateKey, JSON.stringify(defaultValue));
    return defaultValue;
  });

  const [json, setJson] = useState(() => JSON.stringify(state));

  useEventListener(window, 'storage', ({ key, newValue }) => {
    if (stateKey !== key) return;
    if (newValue === json) return;
    try {
      setState(JSON.parse(newValue));
    } catch (e) {
      setState(defaultValue);
    }
  }, [stateKey, json, defaultValue]);

  useEffect(() => setJson(JSON.stringify(state)), [state]);

  useEffect(() => {
    if (json === localStorage.getItem(stateKey)) return;
    localStorage.setItem(stateKey, json);
  }, [json, stateKey]);

  return [state, setState];
};