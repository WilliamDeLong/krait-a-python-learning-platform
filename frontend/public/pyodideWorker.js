/* eslint-disable no-restricted-globals */
// pyodideWorker.js — MODULE WORKER. Must be instantiated with { type: 'module' }.
// Pyodide 314.x dropped support for classic workers / importScripts() entirely —
// see https://blog.pyodide.org/posts/314-release/ ("Classic (non-module) workers: No longer supported")

import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';

let pyodide = null;

const FUNCTION_HARNESS = `
import json, traceback, io, contextlib

def __run_tests__():
    func = __student_ns__.get(__func_name__)
    if func is None:
        return json.dumps({"error": f"Function '{__func_name__}' not found in your code"})
    results = []
    for case in __test_cases__.to_py():
        args = case.get("args", [])
        expected_stdout = case.get("expected_stdout")
        expected_return = case.get("expected", "__NO_CHECK__")
        normalize = case.get("normalize", True)
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                actual_return = func(*args)
            actual_stdout = buf.getvalue()

            passed = True
            detail = {"args": args}

            if expected_stdout is not None:
                so_passed = (actual_stdout.strip() == expected_stdout.strip()) if normalize else (actual_stdout == expected_stdout)
                passed = passed and so_passed
                detail["expected_stdout"] = expected_stdout
                detail["actual_stdout"] = actual_stdout

            if expected_return != "__NO_CHECK__":
                ret_passed = actual_return == expected_return
                passed = passed and ret_passed
                detail["expected"] = expected_return
                detail["actual"] = actual_return

            detail["passed"] = passed
            results.append(detail)
        except Exception:
            results.append({"args": args, "passed": False, "error": traceback.format_exc()})
    return json.dumps({"results": results})

__run_tests__()
`;

// Script-mode: no function to call, so checks run against captured stdout
// and/or the final state of variables left in the student's namespace.
const SCRIPT_HARNESS = `
import json, io, contextlib

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
        elif ctype == "callable":
          name = check.get("name")
          target = __student_ns__.get(name)
          actual = __captured_stdout__
          passed = callable(target)
          result = {"type": "callable", "name": name, "passed": passed, "actual": actual}
          if not passed:
              result["error"] = f"'{name}' was not found or is not a function"
          results.append(result)

        elif ctype == "min_lines":
            min_count = check.get("count", 1)
            lines = [l for l in __captured_stdout__.split("\\n") if l.strip()]
            passed = len(lines) >= min_count
            results.append({
                "type": "min_lines",
                "expected_min": min_count,
                "actual": len(lines),
                "passed": passed
            })
        elif ctype == "call":
          func_name = check.get("func")
          args = check.get("args", [])
          expected = check.get("expected", "__NO_CHECK__")
          min_stdout_lines = check.get("min_stdout_lines")

          func = __student_ns__.get(func_name)
          if func is None or not callable(func):
              results.append({"type": "call", "func": func_name, "passed": False,
                              "error": f"Function '{func_name}' not found or is not callable"})
              continue

          buf = io.StringIO()
          try:
              with contextlib.redirect_stdout(buf):
                  actual = func(*args)
              actual_stdout = buf.getvalue()
              passed = True
              detail = {"type": "call", "func": func_name, "args": args}

              if expected != "__NO_CHECK__":
                  passed = passed and (actual == expected)
                  detail["expected"] = expected
                  detail["actual"] = actual

              if min_stdout_lines is not None:
                  line_count = len([l for l in actual_stdout.split("\\n") if l.strip()])
                  passed = passed and (line_count >= min_stdout_lines)
                  detail["expected_min_stdout_lines"] = min_stdout_lines
                  detail["actual_stdout_lines"] = line_count

              detail["passed"] = passed
              results.append(detail)
          except Exception:
              results.append({"type": "call", "func": func_name, "passed": False, "error": traceback.format_exc()})
        else:
            results.append({"type": ctype, "passed": False, "error": f"Unknown check type '{ctype}'"})

    return json.dumps({"results": results})

__run_script_checks__()
`;

const STATIC_HARNESS = `
import ast, json

def __run_static_checks__():
    results = []
    try:
        tree = ast.parse(__source__)
    except SyntaxError as e:
        return json.dumps({"error": f"Could not parse your code: {e}"})

    func_defs = [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]

    def has_full_if_elif_else(node):
        current = node
        while True:
            if not current.orelse:
                return False
            if len(current.orelse) == 1 and isinstance(current.orelse[0], ast.If):
                current = current.orelse[0]
                continue
            return True  # non-empty orelse that isn't another elif => final else

    def uses_return_with_value(fn):
        return any(isinstance(n, ast.Return) and n.value is not None for n in ast.walk(fn))

    def function_has_if_elif_else(fn):
        return any(isinstance(n, ast.If) and has_full_if_elif_else(n) for n in ast.walk(fn))

    for check in __checks__.to_py():
        ctype = check.get("type")

        if ctype == "function_count":
            min_count = check.get("count", 1)
            passed = len(func_defs) >= min_count
            results.append({"type": ctype, "expected_min": min_count, "actual": len(func_defs), "passed": passed})

        elif ctype == "min_parameters":
            min_count = check.get("count", 2)
            best = max((len(fn.args.args) for fn in func_defs), default=0)
            passed = best >= min_count
            results.append({"type": ctype, "expected_min": min_count, "actual": best, "passed": passed})

        elif ctype == "uses_return_value":
            passed = any(uses_return_with_value(fn) for fn in func_defs)
            results.append({"type": ctype, "passed": passed})

        elif ctype == "if_elif_else":
            passed = any(function_has_if_elif_else(fn) for fn in func_defs)
            results.append({"type": ctype, "passed": passed})

        elif ctype == "docstrings_required":
            missing = [fn.name for fn in func_defs if ast.get_docstring(fn) is None]
            results.append({"type": ctype, "passed": len(missing) == 0, "missing": missing})

        elif ctype == "calls_using_return":
            min_count = check.get("count", 3)
            # A call "uses" its return value unless it's the direct expression of
            # a bare statement (result thrown away) — e.g. \`func()\` alone on a line
            # doesn't count, but \`x = func()\` or \`print(func())\` do.
            bare_call_ids = {id(n.value) for n in ast.walk(tree)
                              if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)}
            used_count = sum(1 for n in ast.walk(tree)
                              if isinstance(n, ast.Call) and id(n) not in bare_call_ids)
            passed = used_count >= min_count
            results.append({"type": ctype, "expected_min": min_count, "actual": used_count, "passed": passed})

        else:
            results.append({"type": ctype, "passed": False, "error": f"Unknown check type '{ctype}'"})

    return json.dumps({"results": results})

__run_static_checks__()
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
      console.log(checks)
      pyodide.globals.set('__checks__', checks);
      pyodide.globals.set('__captured_stdout__', capturedChunks.join('\n'));
      if (capturedChunks.length<1) return { error: `Script contains no output, cannot parse solution without an output (print statement).` };
      const resultJson = await pyodide.runPythonAsync(SCRIPT_HARNESS);
      console.log(await pyodide.runPythonAsync(SCRIPT_HARNESS));
      console.log("Post result chunks:");console.log(capturedChunks);
      
      return JSON.parse(resultJson);
    }
    if (mode === 'static') {
      await pyodide.runPythonAsync(studentCode, { globals: namespace });
      pyodide.globals.set('__student_ns__', namespace);
      pyodide.globals.set('__source__', studentCode);
      pyodide.globals.set('__checks__', payload.checks);
      const resultJson = await pyodide.runPythonAsync(STATIC_HARNESS);
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