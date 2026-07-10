// usePyodide.js — worker-backed version
import { useEffect, useRef, useState, useCallback } from 'react';

const WORKER_TIMEOUT_MS = 8000;

export function usePyodide() {
  const workerRef = useRef(null);
  const readyPromiseRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [outputLines, setOutputLines] = useState([]);

  const spawnWorker = useCallback(() => {
    // Served from /public — NOT imported from src — so webpack never touches it.
    // CRA's default webpack config can't emit true ESM worker bundles, which causes
    // Pyodide's classic-worker detection to misfire if this file is bundled instead.
    const worker = new Worker('/pyodideWorker.js', { type: 'module' });
    worker.onmessage = (event) => {
      if (event.data.type === 'stdout') {
        //console.log(event.data.text);
        setOutputLines((prev) => [...prev, event.data.text]);
      }
    };
    workerRef.current = worker;

    readyPromiseRef.current = new Promise((resolve) => {
      const id = crypto.randomUUID();
      const handler = (event) => {
        if (event.data.id === id && event.data.type === 'ready') {
          worker.removeEventListener('message', handler);
          setIsReady(true);
          resolve();
        }
      };
      worker.addEventListener('message', handler);
      worker.postMessage({ id, type: 'init' });
    });
  }, []);

  useEffect(() => {
    spawnWorker();
    return () => workerRef.current?.terminate();
  }, [spawnWorker]);

  // generic request/response helper — every call gets a fresh id so
  // overlapping calls (shouldn't normally happen, but just in case) don't cross-resolve
  const sendRequest = useCallback((type, payload, timeoutMs = WORKER_TIMEOUT_MS) => {
    return new Promise(async (resolve) => {
      await readyPromiseRef.current;
      const worker = workerRef.current;
      const id = crypto.randomUUID();

      const timeout = setTimeout(() => {
        worker.removeEventListener('message', handler);
        worker.terminate();
        setIsReady(false);
        resolve({ error: 'Time limit exceeded' });
        // respawn for next time, since terminate() is permanent
        spawnWorker();
      }, timeoutMs);

      const handler = (event) => {
        if (event.data.id !== id) return;
        clearTimeout(timeout);
        worker.removeEventListener('message', handler);
        if (event.data.type === 'error') {
          resolve({ error: event.data.error });
        } else {
          resolve(event.data.result);
        }
      };
      worker.addEventListener('message', handler);
      worker.postMessage({ id, type, payload });
    });
  }, [spawnWorker]);

  const runCode = useCallback((code) => {
    //console.log("sending Request");
    //console.log(sendRequest('runCode', { code }));
    return sendRequest('runCode', { code });
    
  }, [sendRequest]);

  const runGraded = useCallback((studentCode, funcName, testCases) => {
    //console.log(sendRequest('runGraded', { studentCode, funcName, testCases }));
    return sendRequest('runGraded', { studentCode, funcName, testCases });
  }, [sendRequest]);

  const clearOutput = () => setOutputLines([]);

  return { isReady, outputLines, clearOutput, runCode, runGraded };
}