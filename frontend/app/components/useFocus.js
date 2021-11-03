import { useEffect, useState } from "react";

const useFocus = (ref, defaultState = false) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = () => setState(false);

    const current = ref.current;
    current.addEventListener("focus", onFocus);
    current.addEventListener("blur", onBlur);

    return () => {
      current.removeEventListener("focus", onFocus);
      current.removeEventListener("blur", onBlur);
    };
  }, [ref]);

  return state;
};

export default useFocus;
