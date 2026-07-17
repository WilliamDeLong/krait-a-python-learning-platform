import { UserContext } from '../App';
import React, { useState, useEffect, useContext, useRef } from 'react';
//import "../css/Instructions .css";
//import { loadPyodide } from "pyodide";




const LessonInstructions = ({ tableData, columns }) => {
  const { isLightMode } = useContext(UserContext);
  //const output = document.getElementById("output");
  
    /* async function hello_python() {
    let pyodide = await loadPyodide();
    return pyodide.runPythonAsync("1+1");
  };
    const rez = await hello_python();
  console.log("Python says that 1+1 =", rez);  */
  return (
    <>
    <div className='container'>
      <style>
        {`
.Instructions * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

.Instructions body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0f0f1a;
            color: #e0e0f0;
            line-height: 1.7;
            font-size: 16px;
        }
/* ── LAYOUT ── */
.Instructions .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0px 24px;
}

/* ── HERO HEADER ── */
.Instructions .hero {
    text-align: center;
    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
    border: 2px solid #4fc3f7;
    border-radius: 16px;
    padding: 48px 32px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
}

.Instructions .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(79,195,247,0.05) 0%, transparent 60%);
    pointer-events: none;
}

.Instructions .hero h1 {
    font-size: 2.6rem;
    color: #4fc3f7;
    margin-bottom: 12px;
    text-shadow: 0 0 20px rgba(79,195,247,0.4);
}

.Instructions .hero .subtitle {
    font-size: 1.1rem;
    color: #90caf9;
    font-style: italic;
}

.Instructions .hero .snake-banner {
    font-size: 3rem;
    margin-bottom: 16px;
    display: block;
}

/* ── SECTION HEADERS ── */
.Instructions .part-header {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(90deg, #1e3a5f, transparent);
    border-left: 5px solid #4fc3f7;
    border-radius: 8px;
    padding: 20px 24px;
    margin: 48px 0 24px 0;
}

.Instructions .part-header .part-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.Instructions .part-header h2 {
    font-size: 1.7rem;
    color: #4fc3f7;
    margin-bottom: 4px;
}

.Instructions .part-header .part-subtitle {
    font-size: 0.9rem;
    color: #78909c;
    font-style: italic;
}

/* ── SECTION SUBHEADERS ── */
.Instructions h3 {
    font-size: 1.25rem;
    color: #81d4fa;
    margin: 32px 0 12px 0;
    padding-bottom: 6px;
    border-bottom: 1px solid #1e3a5f;
}

.Instructions h4 {
    font-size: 1.05rem;
    color: #b0bec5;
    margin: 20px 0 10px 0;
}

/* ── PARAGRAPHS & TEXT ── */
.Instructions p {
    margin-bottom: 14px;
    color: #cfd8dc;
}

.Instructions strong {
    color: #e0f7fa;
}

.Instructions em {
    color: #b0bec5;
}

/* ── CALLOUT BOXES ── */
.Instructions .callout {
    border-radius: 10px;
    padding: 16px 20px;
    margin: 20px 0;
    border-left: 4px solid;
    font-size: 0.95rem;
}

.Instructions .callout-tip {
    background-color: #0d2b1e;
    border-color: #66bb6a;
    color: #c8e6c9;
}

.Instructions .callout-tip .callout-icon::before { content: "💡 "; }

.Instructions .callout-warning {
    background-color: #2b1a0d;
    border-color: #ffa726;
    color: #ffe0b2;
}

.Instructions .callout-warning .callout-icon::before { content: "⚠️ "; }

.Instructions .callout-danger {
    background-color: #2b0d0d;
    border-color: #ef5350;
    color: #ffcdd2;
}

.Instructions .callout-danger .callout-icon::before { content: "🚨 "; }

.Instructions .callout-fun {
    background-color: #1a1a2e;
    border-color: #ce93d8;
    color: #e1bee7;
}

.Instructions .callout-fun .callout-icon::before { content: "😂 "; }

.Instructions .callout-title {
    font-weight: bold;
    margin-bottom: 6px;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
}

/* ── CODE BLOCKS ── */
.Instructions pre {
    background-color: #0d1117;
    border: 1px solid #1e3a5f;
    border-radius: 10px;
    padding: 20px 24px;
    overflow-x: auto;
    margin: 16px 0;
    position: relative;
}

.Instructions pre::before {
    content: 'Python';
    position: absolute;
    top: 8px;
    right: 14px;
    font-size: 0.7rem;
    color: #4fc3f7;
    opacity: 0.6;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.Instructions code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.88rem;
    line-height: 1.8;
    color: #e0e0f0;
}

.Instructions pre, .Instructions pre code {
  white-space: pre;
  display: block; /* pre is block by default too, but resets sometimes touch this */
}


.Instructions p code, .Instructions li code {
    background-color: #1a1a2e;
    border: 1px solid #2a3f5f;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 0.85rem;
    color: #80cbc4;
}

/* ── SYNTAX HIGHLIGHTING (manual) ── */
.Instructions .kw   { color: #c792ea; }   /* keywords: def, if, for, while, etc */
.Instructions .fn   { color: #82aaff; }   /* function names */
.Instructions .str  { color: #c3e88d; }   /* strings */
.Instructions .num  { color: #f78c6c; }   /* numbers */
.Instructions .cm   { color: #546e7a; font-style: italic; }  /* comments */
.Instructions .op   { color: #89ddff; }   /* operators */
.Instructions .var  { color: #eeffff; }   /* variables */
.Instructions .bool { color: #ff9cac; }   /* True / False */
.Instructions .out  { color: #ffcb6b; }   /* output lines */

/* ── TABLES ── */
.Instructions .table-wrap {
    overflow-x: auto;
    margin: 20px 0;
}

.Instructions table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.Instructions thead tr {
    background-color: #1e3a5f;
}

.Instructions thead th {
    padding: 12px 16px;
    text-align: left;
    color: #4fc3f7;
    font-weight: 600;
    border-bottom: 2px solid #4fc3f7;
}

.Instructions tbody tr {
    border-bottom: 1px solid #1a2744;
    transition: background 0.2s;
}

.Instructions tbody tr:hover {
    background-color: #131c2e;
}

.Instructions tbody td {
    padding: 10px 16px;
    color: #cfd8dc;
    vertical-align: top;
}

.Instructions tbody td:first-child {
    color: #80cbc4;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
}

/* ── LISTS ── */
.Instructions ul, ol {
    padding-left: 24px;
    margin: 10px 0 16px 0;
}

.Instructions li {
    margin-bottom: 8px;
    color: #cfd8dc;
}

.Instructions li::marker {
    color: #4fc3f7;
}

/* ── DIVIDERS ── */
.Instructions .section-divider {
    border: none;
    border-top: 1px solid #1e3a5f;
    margin: 40px 0;
}

/* ── CHEAT SHEET ── */
.Instructions .cheat-sheet {
    background: linear-gradient(135deg, #0d1b2e, #0d2b1e);
    border: 2px solid #4fc3f7;
    border-radius: 14px;
    padding: 28px 32px;
    margin: 32px 0;
}

.Instructions .cheat-sheet h2 {
    color: #4fc3f7;
    font-size: 1.4rem;
    margin-bottom: 20px;
    text-align: center;
}

/* ── FINAL WORDS BOX ── */
.Instructions .final-box {
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    border: 2px solid #ce93d8;
    border-radius: 14px;
    padding: 32px;
    margin: 40px 0;
    text-align: center;
}

.Instructions .final-box blockquote {
    font-size: 1.15rem;
    color: #e1bee7;
    font-style: italic;
    border: none;
    margin-bottom: 24px;
    line-height: 1.8;
}

.Instructions .final-box .tip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    margin-top: 20px;
}

.Instructions .tip-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid #2a3f5f;
    border-radius: 10px;
    padding: 16px 20px;
    flex: 1 1 180px;
    text-align: left;
    font-size: 0.9rem;
    color: #b0bec5;
}

.Instructions .tip-card .tip-emoji {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 8px;
}

/* ── TABLE OF CONTENTS ── */
.Instructions .toc {
    background-color: #0d1117;
    border: 1px solid #1e3a5f;
    border-radius: 12px;
    padding: 24px 28px;
    margin-bottom: 40px;
}

.Instructions .toc h2 {
    font-size: 1.1rem;
    color: #4fc3f7;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.Instructions .toc ol {
    padding-left: 20px;
}

.Instructions .toc li {
    margin-bottom: 6px;
    font-size: 0.95rem;
}

.Instructions .toc a {
    color: #81d4fa;
    text-decoration: none;
    transition: color 0.2s;
}

.Instructions .toc a:hover {
    color: #4fc3f7;
    text-decoration: underline;
}

/* ── GOLDEN RULE BOX ── */
.Instructions .golden-rule {
    background: linear-gradient(90deg, #1a2e1a, #1a2e1a);
    border: 1px solid #66bb6a;
    border-radius: 10px;
    padding: 18px 22px;
    margin: 20px 0;
    color: #c8e6c9;
    font-size: 0.95rem;
}

.Instructions .golden-rule strong {
    color: #a5d6a7;
}

/* ── BADGE LABELS ── */
.Instructions .badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 6px;
    vertical-align: middle;
}

.Instructions .badge-new {
    background-color: #0d3b4f;
    color: #4fc3f7;
    border: 1px solid #4fc3f7;
}

.Instructions .badge-tip {
    background-color: #0d3b1e;
    color: #66bb6a;
    border: 1px solid #66bb6a;
}

.Instructions .badge-warning {
    background-color: #3b1e0d;
    color: #ffa726;
    border: 1px solid #ffa726;
}

/* ── FOOTER ── */
.Instructions footer {
    text-align: center;
    padding: 32px;
    color: #546e7a;
    font-size: 0.85rem;
    border-top: 1px solid #1e3a5f;
    margin-top: 48px;
}

/* ── RESPONSIVE ── */
@media (max-width: 640px) {
    .Instructions .hero h1 { font-size: 1.8rem; }
    .Instructions .part-header h2 { font-size: 1.3rem; }
    .Instructions pre { font-size: 0.8rem; padding: 14px 16px; }
    .Instructions .tip-card { flex: 1 1 100%; }
}
        `}
      </style>


        {/* <!-- ══════════════════════════════════════
        PART 1: VARIABLES & DATA TYPES
    ══════════════════════════════════════ --> */}
    <section id="variables">
        <div className="part-header">
            <div>
                <h2>Part 1: Variables &amp; Data Types</h2>
                <p className="part-subtitle">AKA: Labeling Your Stuff So You Can Find It Later</p>
            </div>
        </div>

        {/* <!-- Variables --> */}
        <h3>Variables — Sticky Notes for Your Data</h3>
        <p>A <strong>variable</strong> is just a name you slap onto a value so you can use it later. Think of your phone contacts — you don"t memorize phone numbers, you store them under names.</p>

<pre><code><span className="cm"># Instead of memorizing 617-555-0192...</span>{'\n'}
<span className="var">best_friends_number</span> <span className="op">=</span> <span className="str">"617-555-0192"</span>{'\n'}
<span className="var">my_grade</span>            <span className="op">=</span> <span className="num">95</span>{'\n'}
<span className="var">passing_score</span>       <span className="op">=</span> <span className="num">70</span>{'\n'}
<span className="var">is_friday</span>           <span className="op">=</span> <span className="bool">True</span></code></pre>

        <p>The <code>=</code> sign in Python <strong>does NOT mean "equals"</strong> like in math class. It means <strong>"store this value under this name."</strong></p>

<pre><code><span className="cm"># MATH class:  x = 5 means "x and 5 are equal"</span>{'\n'}
<span className="cm"># PYTHON:      x = 5 means "put the value 5 in a box labeled x"</span>{'\n'}
{'\n'}
<span className="var">score</span> <span className="op">=</span> <span className="num">50</span>{'\n'}
<span className="var">score</span> <span className="op">=</span> <span className="var">score</span> <span className="op">+</span> <span className="num">10</span>   <span className="cm"># This is TOTALLY fine in Python</span>{'\n'}
<span className="cm"># score is now 60 — math teachers, please look away</span></code></pre>

        <div className="callout callout-fun">
            <div className="callout-title"><span className="callout-icon"></span>Naming Rules (Yes, There Are Rules)</div>
            <ul>
                <li>✅ <code>my_cat</code> — great!</li>
                <li>✅ <code>player1_score</code> — awesome!</li>
                <li>❌ <code>1player_score</code> — can"t START with a number</li>
                <li>❌ <code>my cat</code> — no spaces allowed</li>
                <li>❌ <code>for</code> — that word is already taken by Python (called a <strong>keyword</strong>)</li>
            </ul>
        </div>

        {/* <!-- Data Types --> */}
        <h3>Data Types — Not All Values Are Created Equal</h3>
        <p>Python needs to know <em>what kind</em> of thing you"re storing. It"s the difference between storing your age and storing your name — you wouldn"t do math on your name (hopefully).</p>

        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>What It Is</th>
                        <th>Example</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>int</td>
                        <td>Whole numbers</td>
                        <td><code>42</code>, <code>-7</code>, <code>0</code></td>
                    </tr>
                    <tr>
                        <td>float</td>
                        <td>Decimal numbers</td>
                        <td><code>3.14</code>, <code>99.9</code>, <code>-0.5</code></td>
                    </tr>
                    <tr>
                        <td>str</td>
                        <td>Text (in quotes!)</td>
                        <td><code>"hello"</code>, <code>"Python rocks"</code></td>
                    </tr>
                    <tr>
                        <td>bool</td>
                        <td>True or False only</td>
                        <td><code>True</code>, <code>False</code></td>
                    </tr>
                </tbody>
            </table>
        </div>

<pre><code><span className="cm"># INT — whole numbers only, no decimals allowed at this club</span>{'\n'}
<span className="var">num_homework_assignments</span> <span className="op">=</span> <span className="num">47</span>   <span className="cm"># relatable pain</span>{'\n'}
{'\n'}
<span className="cm"># FLOAT — for when life gets complicated (like GPA)</span>{'\n'}
<span className="var">my_gpa</span>            <span className="op">=</span> <span className="num">3.85</span>{'\n'}
<span className="var">pizza_slices_eaten</span> <span className="op">=</span> <span className="num">2.5</span>    <span className="cm"># you know what you did</span>{'\n'}
{'\n'}
<span className="cm"># STR — always needs quotes, single OR double, just be consistent</span>{'\n'}
<span className="var">my_name</span>        <span className="op">=</span> <span className="str">"Alex"</span>{'\n'}
<span className="var">favorite_class</span> <span className="op">=</span> <span className="str">"Lunch"</span>   <span className="cm"># valid answer</span>{'\n'}
{'\n'}
<span className="cm"># BOOL — only TWO possible values, the most decisive type</span>{'\n'}
<span className="var">homework_done</span> <span className="op">=</span> <span className="bool">False</span>   <span className="cm"># we"ve all been there</span>{'\n'}
<span className="var">is_weekend</span>    <span className="op">=</span> <span className="bool">True</span>    <span className="cm"># 🎉</span></code></pre>

        <h4>Type Conversion — Changing Costumes</h4>
        <p>Sometimes you need to convert between types. Python won"t do this automatically — you have to ask nicely.</p>

<pre><code><span className="cm"># User input ALWAYS comes in as a string</span>{'\n'}
<span className="var">age_input</span> <span className="op">=</span> <span className="fn">input</span>(<span className="str">"How old are you? "</span>)   <span className="cm"># user types: 16</span>{'\n'}
<span className="cm"># age_input is "16" — a STRING, not a number!</span>{'\n'}
{'\n'}
<span className="var">age</span>       <span className="op">=</span> <span className="fn">int</span>(<span className="var">age_input</span>)   <span className="cm"># NOW it"s the number 16</span>{'\n'}
<span className="var">next_year</span> <span className="op">=</span> <span className="var">age</span> <span className="op">+</span> <span className="num">1</span>           <span className="cm"># works! = 17</span>{'\n'}
{'\n'}
<span className="cm"># Gotcha without conversion:</span>{'\n'}
<span className="cm"># "16" + 1  → ERROR (can"t add string and number)</span>{'\n'}
<span className="cm"># "16" + "1" → "161" (string + string = joined together 😱)</span></code></pre>

        <div className="callout callout-warning">
            <div className="callout-title"><span className="callout-icon"></span>Common Mistake Alert</div>
            <code>input()</code> always gives you a string. If you ask someone their age and try to do math with it, Python will freak out. Always convert with <code>int()</code> or <code>float()</code> when you need numbers!
        </div>

        <h4>Quick Practice: Spot the Type!</h4>
<pre><code><span className="var">a</span> <span className="op">=</span> <span className="num">100</span>          <span className="cm"># int</span>{'\n'}
<span className="var">b</span> <span className="op">=</span> <span className="str">"100"</span>        <span className="cm"># str  ← NOT the same as above!</span>{'\n'}
<span className="var">c</span> <span className="op">=</span> <span className="num">100.0</span>        <span className="cm"># float</span>{'\n'}
<span className="var">d</span> <span className="op">=</span> <span className="bool">True</span>         <span className="cm"># bool</span>{'\n'}
<span className="var">e</span> <span className="op">=</span> <span className="fn">int</span>(<span className="str">"42"</span>)   <span className="cm"># int (converted from str)</span></code></pre>

    </section>
    
    {/* <hr className="section-divider"/> */}



    {/* <!-- ══════════════════════════════════════
        FOOTER
    ══════════════════════════════════════ --> */}
    <footer>
        <p>Based on UAI Module 1 — Python Coding Basics &nbsp;|&nbsp; Ana Bell, MIT &nbsp;|&nbsp; Copyright MIT 2025</p>
        <p >Teaching summary prepared for novice programmers 🐍</p>
    </footer>

</div>
</>
  );
};

export default LessonInstructions;