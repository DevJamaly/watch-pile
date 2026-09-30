import { useEffect } from 'react';

export function useKey(keyCode: string, callback: () => void) {
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.code.toLowerCase() === keyCode.toLowerCase()) {
        callback?.();
      }
    }

    document.addEventListener('keydown', handleKeyPress);

    return function cleanUp() {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [keyCode, callback]);
}
