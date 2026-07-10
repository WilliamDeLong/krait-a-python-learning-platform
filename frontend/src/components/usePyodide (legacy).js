// usePyodide.js
import { useEffect, useState } from 'react';

const PYODIDE_VERSION = '314.0.2'; // pin whatever version you're targeting

export function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [outputLines, setOutputLines] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log(window.loadPyodide);
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      const instance = await window.loadPyodide({
        stdout: (text) => setOutputLines((prev) => [...prev, text]),
      });
      if (!cancelled) setPyodide(instance);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const clearOutput = () => setOutputLines([]);

  return { pyodide, outputLines, clearOutput };
}