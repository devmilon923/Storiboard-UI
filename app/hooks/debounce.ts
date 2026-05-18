import { useEffect, useState } from "react";

export const useDebounce = (input: string, delay: number) => {
  const [value, setValue] = useState<string>(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(input);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [input, delay]);

  return value;
};
