/* eslint-disable no-restricted-globals */
// pyodideWorker.js — MODULE WORKER. Must be instantiated with { type: 'module' }.
// Pyodide 314.x dropped support for classic workers / importScripts() entirely —
// see https://blog.pyodide.org/posts/314-release/ ("Classic (non-module) workers: No longer supported")

import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';
 
let pyodide = null;

const HARNESS_CODE = `
import json, traceback

def __run_tests__():
    func = __student_ns__.get(__func_name__)
    if func is None:
        return json.dumps({"error": f"Function '{__func_name__}' not found in your code"})
    results = []
    for case in __test_cases__.to_py():
        args = case.get("args", [])
        expected = case.get("expected")
        try:
            actual = func(*args)
            results.append({
                "args": args,
                "expected": expected,
                "actual": actual,
                "passed": actual == expected,
            })
        except Exception:
            results.append({
                "args": args,
                "expected": expected,
                "passed": False,
                "error": traceback.format_exc(),
            })
    return json.dumps({"results": results})

__run_tests__()
`;

async function initPyodide() {
  console.log("Loading Pyodide");
  pyodide = await loadPyodide({
    stdout: (text) => self.postMessage({ type: 'stdout', text }),
  });
}

async function runCode(code) {
  // plain "Run Code" behavior — shared namespace, stdout streams via the callback above
  await pyodide.runPythonAsync(code);
}

async function runGraded({ studentCode, funcName, testCases }) {
  // isolated namespace so grading never touches the interactive session's state
  const namespace = pyodide.globals.get('dict')();
  try {
    console.log("Running student code");
    await pyodide.runPythonAsync(studentCode, { globals: namespace });

    pyodide.globals.set('__student_ns__', namespace);
    pyodide.globals.set('__func_name__', funcName);
    pyodide.globals.set('__test_cases__', testCases);
    console.log("Running 'harness'");
    const resultJson = await pyodide.runPythonAsync(HARNESS_CODE);
    return JSON.parse(resultJson);
  } catch (err) {
    return { error: err.message };
  } finally {
    namespace.destroy();
  }
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  try {
    if (type === 'init') {
      await initPyodide();
      self.postMessage({ id, type: 'ready' });
      return;
    }

    if (type === 'runCode') {
      await runCode(payload.code);
      self.postMessage({ id, type: 'result', result: { done: true } });
      return;
    }

    if (type === 'runGraded') {
      const result = await runGraded(payload);
      self.postMessage({ id, type: 'result', result });
      return;
    }
  } catch (err) {
    self.postMessage({ id, type: 'error', error: err.message });
  }
};