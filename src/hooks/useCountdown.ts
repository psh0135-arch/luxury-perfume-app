import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  ended: boolean;
};

const compute = (target: number): Countdown => {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, ended: true };
  }
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, totalMs: diff, ended: false };
};

export const useCountdown = (endAt: string) => {
  const target = new Date(endAt).getTime();
  const [state, setState] = useState<Countdown>(() => compute(target));

  useEffect(() => {
    setState(compute(target));
    const t = setInterval(() => setState(compute(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  return state;
};
