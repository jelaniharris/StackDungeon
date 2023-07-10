import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownParams {
  onComplete?: () => void;
}

export const useCountdown = ({ onComplete }: UseCountdownParams) => {
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [active, setActive] = useState(true);
  const intervalRef = useRef<number>();
  intervalRef.current = counter;

  const interrupt = useCallback(() => {
    if (timer) {
      clearInterval(timer);
    }
  }, [timer]);

  const startTimer = useCallback((initialValue: number) => {
    setCounter(initialValue);
    setActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    console.log('Creating timer.');
    const timer = setInterval(() => {
      if (intervalRef.current == 0) {
        console.log("Timer's done");
        if (onComplete) {
          onComplete();
        }
        clearInterval(timer);
      } else if (intervalRef.current && active) {
        setCounter(intervalRef.current - 1);
      }
    }, 1000);

    setTimer(timer);

    return () => clearInterval(timer);
  }, [active, onComplete]);

  return { counter, interrupt, startTimer, stopTimer };
};
