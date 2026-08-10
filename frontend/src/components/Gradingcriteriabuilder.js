// GradingCriteriaBuilder.js
//
// Admin-facing UI for building a `solution_verification` JSON blob without
// hand-writing it. Renders a form driven by `mode` (function / script / static),
// keeps a live JSON preview in sync, and offers a "Test against your solution"
// button that actually runs the criteria through Pyodide against a reference
// solution — so a broken schema gets caught here, not from a confused student.
//
// This intentionally does NOT touch the CodeMirror editor singleton (createEditor/
// editorView) — every field here is a plain controlled input, and the reference
// solution is a plain <textarea>, not a second editor instance.

import React, { useState, useEffect, useMemo, useCallback, useRef, useId } from 'react';
import { usePyodide } from './usePyodide';

// ---------- shared helpers ----------

function tryParseJson(text, fallbackOnEmpty) {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, value: fallbackOnEmpty };
  try {
    return { ok: true, value: JSON.parse(trimmed) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

let __idCounter = 0;
function nextId() {
  __idCounter += 1;
  return `row_${__idCounter}`;
}

// A single JSON-valued field: raw text in, parsed value out, red border on
// invalid JSON so mistakes are visible before the admin tries to save.
function JsonField({ label, value, onChange, placeholder, isLightMode }) {
  const parsed = tryParseJson(value, undefined);
  const invalid = !parsed.ok;
  const fieldId = useId();
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && (
        <label htmlFor={fieldId} style={{ display: 'block', fontSize: '85%', marginBottom: '2px', opacity: 0.85 }}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '6px 8px',
          borderRadius: '4px',
          border: invalid ? '1px solid #dc3545' : '1px solid #6c757d',
          backgroundColor: isLightMode ? '#ffffff' : '#0b1830',
          color: isLightMode ? '#000000' : '#ffffff',
          fontFamily: 'monospace',
          fontSize: '90%',
        }}
      />
      {invalid && (
        <div style={{ color: '#dc3545', fontSize: '75%', marginTop: '2px' }}>
          Invalid JSON: {parsed.error}
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, isLightMode, type = 'text' }) {
  const fieldId = useId();
  //console.log(fieldId);
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && (
        <label htmlFor={fieldId} style={{ display: 'block', fontSize: '85%', marginBottom: '2px', opacity: 0.85 }}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '6px 8px',
          borderRadius: '4px',
          border: '1px solid #6c757d',
          backgroundColor: isLightMode ? '#ffffff' : '#0b1830',
          color: isLightMode ? '#000000' : '#ffffff',
        }}
      />
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '85%', marginBottom: '10px' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function RowShell({ children, onRemove, isLightMode }) {
  return (
    <div
      style={{
        border: '1px solid rgb(96 139 168)',
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: isLightMode ? '#f3f8fd' : '#0e1f3d',
      }}
    >
      {children}
      <button
        type="button"
        onClick={onRemove}
        style={{
          backgroundColor: '#a2170f',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '80%',
          cursor: 'pointer',
        }}
      >
        Remove
      </button>
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: '#0d6efd',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 14px',
        fontSize: '85%',
        cursor: 'pointer',
        marginBottom: '14px',
      }}
    >
      {children}
    </button>
  );
}

// ---------- function-mode test case row ----------

function FunctionTestCaseRow({ row, onUpdate, onRemove, isLightMode }) {
  console.log(row);
  return (
    <RowShell onRemove={onRemove} isLightMode={isLightMode}>
      <JsonField
        label="Args (JSON array)"
        value={row.args}
        onChange={(v) => onUpdate({ ...row, args: v })}
        placeholder="[5, 3]"
        isLightMode={isLightMode}
      />
      <JsonField
        label="Expected return value (JSON — leave blank to skip)"
        value={row.expected}
        onChange={(v) => onUpdate({ ...row, expected: v })}
        placeholder='"A"  or  8  or  [1, 2, 3]'
        isLightMode={isLightMode}
      />
      <TextField
        label="Expected stdout (plain text — leave blank to skip)"
        value={row.expected_stdout}
        onChange={(v) => onUpdate({ ...row, expected_stdout: v })}
        placeholder="5, 10, 15, 20"
        isLightMode={isLightMode}
      />
      {row.expected_stdout && (
        <CheckboxField
          label="Normalize stdout (ignore leading/trailing whitespace)"
          checked={row.normalize}
          onChange={(v) => onUpdate({ ...row, normalize: v })}
        />
      )}
    </RowShell>
  );
}

// ---------- script/static-mode check row ----------

const SCRIPT_CHECK_TYPES = ['stdout', 'variable', 'callable', 'min_lines', 'call'];
const STATIC_CHECK_TYPES = [
  'function_count',
  'min_parameters',
  'uses_return_value',
  'if_elif_else',
  'docstrings_required',
  'calls_using_return',
];

function CheckRow({ row, onUpdate, onRemove, isLightMode, availableTypes }) {
  const set = (patch) => onUpdate({ ...row, ...patch });
  //console.log(set);
  return (
    <RowShell onRemove={onRemove} isLightMode={isLightMode}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor={`check-type-${row.id}`} style={{ display: 'block', fontSize: '85%', marginBottom: '2px', opacity: 0.85 }}>
          Check type
        </label>
        <select
          id={`check-type-${row.id}`}
          value={row.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
          style={{ padding: '6px 8px', borderRadius: '4px', color:"#000" }}
        >
          {availableTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {row.type === 'stdout' && (
        <>
          <TextField label="Expected stdout" value={row.expected || ''} onChange={(v) => set({ expected: v })} isLightMode={isLightMode} />
          <CheckboxField label="Normalize (ignore leading/trailing whitespace)" checked={row.normalize !== false} onChange={(v) => set({ normalize: v })} />
        </>
      )}

      {row.type === 'variable' && (
        <>
          <TextField label="Variable name" value={row.name || ''} onChange={(v) => set({ name: v })} isLightMode={isLightMode} />
          <JsonField label="Expected value (JSON)" value={row.expected || ''} onChange={(v) => set({ expected: v })} placeholder="45" isLightMode={isLightMode} />
        </>
      )}

      {row.type === 'callable' && (
        <TextField label="Function name that must exist" value={row.name || ''} onChange={(v) => set({ name: v })} placeholder="print_menu" isLightMode={isLightMode} />
      )}

      {row.type === 'min_lines' && (
        <TextField label="Minimum non-blank printed lines" type="number" value={row.count || ''} onChange={(v) => set({ count: v })} placeholder="8" isLightMode={isLightMode} />
      )}

      {row.type === 'call' && (
        <>
          <TextField label="Function name to call" value={row.func || ''} onChange={(v) => set({ func: v })} isLightMode={isLightMode} />
          <JsonField label="Args (JSON array)" value={row.args || '[]'} onChange={(v) => set({ args: v })} placeholder="[]" isLightMode={isLightMode} />
          <JsonField label="Expected return value (JSON — leave blank to skip)" value={row.expected || ''} onChange={(v) => set({ expected: v })} isLightMode={isLightMode} />
          <TextField label="Minimum printed lines (leave blank to skip)" type="number" value={row.min_stdout_lines || ''} onChange={(v) => set({ min_stdout_lines: v })} isLightMode={isLightMode} />
        </>
      )}

      {row.type === 'function_count' && (
        <TextField label="Minimum number of functions defined" type="number" value={row.count || ''} onChange={(v) => set({ count: v })} placeholder="3" isLightMode={isLightMode} />
      )}

      {row.type === 'min_parameters' && (
        <TextField label="Minimum parameters on at least one function" type="number" value={row.count || ''} onChange={(v) => set({ count: v })} placeholder="2" isLightMode={isLightMode} />
      )}

      {row.type === 'calls_using_return' && (
        <TextField label="Minimum calls whose return value is used" type="number" value={row.count || ''} onChange={(v) => set({ count: v })} placeholder="3" isLightMode={isLightMode} />
      )}

      {(row.type === 'uses_return_value' || row.type === 'if_elif_else' || row.type === 'docstrings_required') && (
        <div style={{ fontSize: '80%', opacity: 0.75, marginBottom: '10px' }}>No extra fields — this check applies to the whole submission.</div>
      )}
    </RowShell>
  );
}

// ---------- building the final verification object from form state ----------

function buildVerification(mode, funcName, testCaseRows, checkRows) {
  if (mode === 'function') {
    const testCases = testCaseRows.map((row) => {
      const args = tryParseJson(row.args, []).value ?? [];
      const tc = { args };
      const expectedParsed = tryParseJson(row.expected, undefined);
      if (row.expected.trim() !== '') tc.expected = expectedParsed.value;
      if (row.expected_stdout.trim() !== '') {
        tc.expected_stdout = row.expected_stdout;
        tc.normalize = row.normalize !== false;
      }
      return tc;
    });
    return { mode: 'function', funcName, testCases };
  }

  // script and static modes share the same "checks" shape
  const checks = checkRows.map((row) => {
    //console.log(row);
    const c = { type: row.type };
    if (row.name !== undefined && row.name !== '') c.name = row.name;
    if (row.func !== undefined && row.func !== '') c.func = row.func;
    if (row.expected !== undefined && row.expected.trim() !== '') {
      c.expected = tryParseJson(row.expected, undefined).value;
    }
    if (row.args !== undefined && row.args.trim() !== '') {
      c.args = tryParseJson(row.args, []).value ?? [];
    }
    if (row.count !== undefined && row.count !== '') c.count = Number(row.count);
    if (row.min_stdout_lines !== undefined && row.min_stdout_lines !== '') {
      c.min_stdout_lines = Number(row.min_stdout_lines);
    }
    if (row.normalize !== undefined) c.normalize = row.normalize;
    return c;
  });
  //console.log({ mode, checks });
  return { mode, checks };
}

// ---------- results display for the self-test run ----------

function GradedResultsDisplay({ result }) {
  if (!result) return null;
  if (result.error) {
    return (
      <div style={{ color: '#dc3545', fontFamily: 'monospace', fontSize: '85%', whiteSpace: 'pre-wrap' }}>
        Error: {result.error}
      </div>
    );
  }
  if (!result.results) return null;

  return (
    <div>
      {result.results.map((r, i) => (
        <div
          key={i}
          style={{
            padding: '8px',
            marginBottom: '6px',
            borderRadius: '4px',
            backgroundColor: r.passed ? 'rgba(25,135,84,0.15)' : 'rgba(220,53,69,0.15)',
            border: `1px solid ${r.passed ? '#198754' : '#dc3545'}`,
            fontFamily: 'monospace',
            fontSize: '80%',
          }}
        >
          <strong>{r.passed ? 'PASS' : 'FAIL'}</strong>{' '}
          {r.type ? `[${r.type}] ` : ''}
          {r.name ? `${r.name} ` : ''}
          {r.func ? `${r.func}(${JSON.stringify(r.args)}) ` : ''}
          {!r.passed && r.error && <div>{r.error}</div>}
          {!r.passed && r.expected !== undefined && (
            <div>expected: {JSON.stringify(r.expected)} — actual: {JSON.stringify(r.actual)}</div>
          )}
          {!r.passed && r.expected_stdout !== undefined && (
            <div>expected stdout: {JSON.stringify(r.expected_stdout)} — actual: {JSON.stringify(r.actual_stdout)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- main component ----------

export default function GradingCriteriaBuilder({
  initialVerification,     // object or null — existing solution_verification to edit, stored as-is (not stringified)
  referenceSolution,       // string — the admin's known-correct solution, for self-testing
  onChange,                // (verificationObject) => void — fires with the plain object, ready to store directly
  isLightMode = true,
}) {
  const [mode, setMode] = useState('function');
  const [funcName, setFuncName] = useState('');
  const [testCaseRows, setTestCaseRows] = useState([]);
  const [checkRows, setCheckRows] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [testRunning, setTestRunning] = useState(false);

  const { isReady, runGraded } = usePyodide();
  //console.log(initialVerification);
  
  // seed form state from an existing verification object, if editing a lesson that already has one
  useEffect(() => {
    console.log(initialVerification);
    console.log(typeof(initialVerification));
    
    if (!initialVerification) return;
    try {
      // Object is the native, expected shape (matches how this system actually
      // stores solution_verification). Still accepts a JSON string too, just in
      // case any lesson somewhere was saved as text — cheap to support both.
      const parsed =
        typeof initialVerification === 'string'
          ? JSON.parse(initialVerification)
          : initialVerification;
      // Older lessons (written before `mode` was an explicit field) look like
      // { funcName, testCases } with no `mode` key — infer function-mode from
      // shape in that case rather than falling through to an empty script form.
      const inferredMode = parsed.mode || (parsed.testCases ? 'function' : 'script');
      setMode(inferredMode);
      if (inferredMode === 'function') {
        setFuncName(parsed.funcName || '');
        setTestCaseRows(
          (parsed.testCases || []).map((tc) => ({
            id: nextId(),
            args: JSON.stringify(tc.args ?? []),
            expected: tc.expected !== undefined ? JSON.stringify(tc.expected) : '',
            expected_stdout: tc.expected_stdout || '',
            normalize: tc.normalize !== false,
          }))
        );
      } else {
        console.log("Experiment2");
        setCheckRows(
          (parsed.checks || []).map((c) => ({
            id: nextId(),
            type: c.type,
            name: c.name || '',
            func: c.func || '',
            args: c.args !== undefined ? JSON.stringify(c.args) : '',
            expected: c.expected !== undefined ? JSON.stringify(c.expected) : '',
            count: c.count !== undefined ? String(c.count) : '',
            min_stdout_lines: c.min_stdout_lines !== undefined ? String(c.min_stdout_lines) : '',
            normalize: c.normalize,
          }))
        );
      }
    } catch (e) {
      // Genuinely malformed data — log it so this doesn't fail silently again.
      console.error('GradingCriteriaBuilder: could not load existing solution_verification', e, initialVerification);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Complain to claude again that putting initialVerification in the box breaks every goddamn thing

  const verification = useMemo(
    () => buildVerification(mode, funcName, testCaseRows, checkRows),
    [mode, funcName, testCaseRows, checkRows]
  );
  console.log(checkRows)

  // Only used for the read-only preview pane below — never passed to onChange,
  // since the object itself is what actually gets stored.
  const verificationJson = useMemo(() => JSON.stringify(verification, null, 2), [verification]);

  // Skip the very first invocation, AND skip any invocation whose content
  // exactly matches what was last emitted. The first-skip alone isn't enough
  // once onChange sends a plain object: every re-seed (triggered by the
  // parent handing back a new-but-equal object reference) builds brand-new
  // arrays via .map(), so `verification` never reference-equals its previous
  // value — without a content check, seed → emit → parent updates → new
  // initialVerification reference → re-seed → emit again, forever. Comparing
  // stringified content (cheap, and verificationJson is already computed for
  // the preview below) breaks that cycle as soon as content actually stabilizes.
  const hasFiredOnceRef = useRef(false);
  const lastEmittedJsonRef = useRef(null);
  useEffect(() => {
    if (!hasFiredOnceRef.current) {
      hasFiredOnceRef.current = true;
      return;
    }
    if (lastEmittedJsonRef.current === verificationJson) return;
    lastEmittedJsonRef.current = verificationJson;
    if (onChange) onChange(verification);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationJson]);

  const availableCheckTypes = mode === 'static' ? STATIC_CHECK_TYPES : SCRIPT_CHECK_TYPES;

  const addTestCaseRow = useCallback(() => {
    setTestCaseRows((prev) => [...prev, { id: nextId(), args: '[]', expected: '', expected_stdout: '', normalize: true }]);
  }, []);

  const addCheckRow = useCallback(() => {
    setCheckRows((prev) => [...prev, { id: nextId(), type: availableCheckTypes[0] }]);
  }, [availableCheckTypes]);

  // reset check rows to a sensible first type when switching mode, so a
  // "call"/"stdout" row doesn't silently persist into static mode where it's invalid
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCheckRows([]);
    setTestCaseRows([]);
  };

  const handleSelfTest = async () => {
    if (!referenceSolution || !referenceSolution.trim()) {
      setTestResult({ error: 'No reference solution provided to test against.' });
      return;
    }
    setTestRunning(true);
    setTestResult(null);
    const result = await runGraded(referenceSolution, verification);
    setTestResult(result);
    setTestRunning(false);
  };

  const allTestsPassed =
    testResult && testResult.results && testResult.results.every((r) => r.passed);

  return (
    <div style={{ color: isLightMode ? '#000000' : '#ffffff' }}>
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '85%', marginBottom: '4px', opacity: 0.85 }}>
          Grading mode
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['function', 'script', 'static'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === m ? '#0d6efd' : '#6c757d',
                color: '#fff',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '75%', opacity: 0.7, marginTop: '4px' }}>
          {mode === 'function' && 'Calls a specific function with given args and checks its return value and/or printed output.'}
          {mode === 'script' && 'Checks captured stdout, final variable values, function existence, or calls a function directly — for exercises without a single required function signature.'}
          {mode === 'static' && 'Inspects the source code itself (function count, parameters, control flow, docstrings) rather than running it — for open-ended assignments with no fixed correct output.'}
        </div>
      </div>

      {mode === 'function' && (
        <TextField
          label="Function name to test"
          value={funcName}
          onChange={setFuncName}
          placeholder="times_table"
          isLightMode={isLightMode}
        />
      )}

      <div style={{ marginTop: '10px' }}>
        {mode === 'function' ? (
          <>
            {testCaseRows.map((row) => (
              <FunctionTestCaseRow
                key={row.id}
                row={row}
                isLightMode={isLightMode}
                onUpdate={(updated) => setTestCaseRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)))}
                onRemove={() => setTestCaseRows((prev) => prev.filter((r) => r.id !== row.id))}
              />
            ))}
            <AddButton onClick={addTestCaseRow}>+ Add test case</AddButton>
          </>
        ) : (
          <>
            {checkRows.map((row) => (
              <CheckRow
                key={row.id}
                row={row}
                isLightMode={isLightMode}
                availableTypes={availableCheckTypes}
                onUpdate={(updated) => setCheckRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...updated } : r)))}
                onRemove={() => setCheckRows((prev) => prev.filter((r) => r.id !== row.id))}
              />
            ))}
            <AddButton onClick={addCheckRow}>+ Add check</AddButton>
          </>
        )}
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontSize: '85%', marginBottom: '4px', opacity: 0.85 }}>
          Resulting solution_verification JSON
        </label>
        <pre
          style={{
            backgroundColor: isLightMode ? '#f3f8fd' : '#0b1830',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '80%',
            overflowX: 'auto',
            maxHeight: '220px',
          }}
        >
          {verificationJson}
        </pre>
      </div>

      <div style={{ marginTop: '16px', borderTop: '1px solid rgb(96 139 168)', paddingTop: '14px' }}>
        <label style={{ display: 'block', fontSize: '85%', marginBottom: '4px', opacity: 0.85 }}>
          Reference solution (used only for the self-test below — not saved as starter code)
        </label>
        <button
          type="button"
          onClick={handleSelfTest}
          disabled={!isReady || testRunning}
          style={{
            backgroundColor: '#198754',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: !isReady || testRunning ? 'not-allowed' : 'pointer',
            opacity: !isReady || testRunning ? 0.6 : 1,
          }}
        >
          {!isReady ? 'Loading Python runtime…' : testRunning ? 'Testing…' : 'Test against your solution'}
        </button>

        {testResult && (
          <div style={{ marginTop: '12px' }}>
            {testResult.results && (
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: allTestsPassed ? '#198754' : '#dc3545' }}>
                {allTestsPassed ? 'All checks passed against the reference solution.' : 'Some checks failed — review the criteria or the reference solution.'}
              </div>
            )}
            <GradedResultsDisplay result={testResult} />
          </div>
        )}
      </div>
    </div>
  );
}