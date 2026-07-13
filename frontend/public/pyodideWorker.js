/* eslint-disable no-restricted-globals */
// pyodideWorker.js — MODULE WORKER. Must be instantiated with { type: 'module' }.
// Pyodide 314.x dropped support for classic workers / importScripts() entirely —
// see https://blog.pyodide.org/posts/314-release/ ("Classic (non-module) workers: No longer supported")

import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';

let pyodide = null;

const FUNCTION_HARNESS = `
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

// Script-mode: no function to call, so checks run against captured stdout
// and/or the final state of variables left in the student's namespace.
const SCRIPT_HARNESS = `
import json

def __run_script_checks__():
    results = []
    for check in __checks__.to_py():
        ctype = check.get("type")

        if ctype == "stdout":
            expected = check.get("expected", "")
            actual = __captured_stdout__
            normalize = check.get("normalize", True)
            passed = (actual.strip() == expected.strip()) if normalize else (actual == expected)
            results.append({
                "type": "stdout",
                "expected": expected,
                "actual": actual,
                "passed": passed,
            })

        elif ctype == "variable":
            name = check.get("name")
            expected = check.get("expected")
            if name not in __student_ns__:
                results.append({
                    "type": "variable",
                    "name": name,
                    "passed": False,
                    "error": f"Variable '{name}' was not defined by your script",
                })
                continue
            actual = __student_ns__[name]
            results.append({
                "type": "variable",
                "name": name,
                "expected": expected,
                "actual": actual,
                "passed": actual == expected,
            })

        else:
            results.append({"type": ctype, "passed": False, "error": f"Unknown check type '{ctype}'"})

    return json.dumps({"results": results})

__run_script_checks__()
`;

function streamStdoutToMain(text) {
  self.postMessage({ type: 'stdout', text });
}

async function initPyodide() {
  pyodide = await loadPyodide({
    stdout: streamStdoutToMain,
  });
}

async function runCode(code) {
  // plain "Run Code" behavior — shared namespace, stdout streams via the callback above
  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    return { error: err.message};
  }
  
}

async function runGraded(payload) {
  const { studentCode, mode } = payload;
  // isolated namespace so grading never touches the interactive session's state
  const namespace = pyodide.globals.get('dict')();

  // capture stdout locally during grading instead of streaming it live —
  // needed for stdout-based script checks, and stops graded-run prints
  // from leaking into the visible terminal.
  //const capturedChunks = [];
  //pyodide.setStdout({ batched: (text) => capturedChunks.push(text) });

  try {
    //DeleteMeForMoreTesting//console.log(`THE BELOW LINES ARE FOR A ${mode}.`)
    //DeleteMeForMoreTesting//console.log(`payload: `);console.log(payload);
    //DeleteMeForMoreTesting//console.log(`captured output chunks: `);console.log(capturedChunks);
    if (mode === 'function') {
      await pyodide.runPythonAsync(studentCode, { globals: namespace });
      pyodide.globals.set('__student_ns__', namespace);
      const { funcName, testCases } = payload;
      //console.log(payload);
      pyodide.globals.set('__func_name__', funcName);
      pyodide.globals.set('__test_cases__', testCases);
      const resultJson = await pyodide.runPythonAsync(FUNCTION_HARNESS);
      //DeleteMeForMoreTesting//console.log(`result Json: ${resultJson}`);
      //DeleteMeForMoreTesting//console.log("Post result chunks:");console.log(capturedChunks);
      return JSON.parse(resultJson);
    }

    if (mode === 'script') {
      const capturedChunks = [];
      pyodide.setStdout({ batched: (text) => capturedChunks.push(text) });
      await pyodide.runPythonAsync(studentCode, { globals: namespace });
      pyodide.globals.set('__student_ns__', namespace);
      const { checks } = payload;
      pyodide.globals.set('__checks__', checks);
      pyodide.globals.set('__captured_stdout__', capturedChunks.join('\n'));
      const resultJson = await pyodide.runPythonAsync(SCRIPT_HARNESS);
      //DeleteMeForMoreTesting//console.log(`result Json: ${resultJson}`);
      console.log("Post result chunks:");console.log(capturedChunks);
      return JSON.parse(resultJson);
    }

    return { error: `Unknown grading mode: '${mode}'` };
  } catch (err) {
    return { error: err.message };
  } finally {
    namespace.destroy();
    // restore live stdout streaming for the interactive "Run Code" flow
    pyodide.setStdout({ batched: streamStdoutToMain });
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
      var result = true;
      const errResult = await runCode(payload.code);
      if (errResult!==undefined) {
        result = errResult
      }
      //console.log("code ran");
      //console.log(errResult);
      //console.log(errResult!==undefined);
      self.postMessage({ id, type: 'result', result });
      return;
    }

    if (type === 'runGraded') {
      const result = await runGraded(payload);
      //console.log("code graded");
      //console.log(result);
      self.postMessage({ id, type: 'result', result });
      return;
    }
  } catch (err) {
    console.log(err.message);
    self.postMessage({ id, type: 'error', error: err.message });
  }
};