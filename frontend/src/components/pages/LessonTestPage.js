import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api.js';
import getUserInfo from "../../utilities/decodeJwt.js";
import { UserContext } from '../../App.js';
import "../../css/editor.css";
//import "../../css/lessonInstructions.css";
import "../../css/h3.css";
import "../../css/box.css";
import PythonTerminal from "../PyTerminal.js";
import LessonInstructions from "../instructionsTestPage.js";
import { usePyodide } from '../usePyodide';
import { render, screen } from '@testing-library/react';
//import { loadPyodide } from "pyodide";
//const { loadPyodide } = require("pyodide");
//import CodeEditor from "../CodeEditor";
//import { useRef } from "react";
//import {basicSetup} from "codemirror";
//import {EditorState} from "@codemirror/state";
//import {EditorView, keymap} from "@codemirror/view";
//import {defaultKeymap, indentWithTab} from "@codemirror/commands";

//import { python } from "@codemirror/lang-python";

//import { oneDark } from "@codemirror/theme-one-dark";
//import { createEditorState, createEditorView } from "../editor";



const url_submissionUpdate = `${API_BASE}/submissions/`;
const url_submissionLoad = `${API_BASE}/submissions/findSubmission`;
const url_submissionCreate = `${API_BASE}/submissions/create`;
const url_LessonData = `${API_BASE}/lesson/`;
const url_otherLessons = `${API_BASE}/lesson/findLesson`;
const url_chapter = `${API_BASE}/chapter/findChapter`;



//const lessonDefault = {lessonID: "6a19e16bd4abefc266f8ab0c"};
const lesson_block_data_default = {_id:"6a19e16bd4abefc266f8ab0c" , default_script: "", solution_verification: '', instructions: "", title: ''};
const codeSubmission_default = {"_id": null, script_submission: null, userID: "null", lessonID: "null", success: false, submission_date: null};



const LessonTestPage = () => {
  const [user, setUser] = useState(getUserInfo());
  const {editorView} = useContext(UserContext);
  const {createEditor} = useContext(UserContext);

  //const [data, setData] = useState(dataDefault);
  let {lessonID} = useParams();
  lesson_block_data_default._id=lessonID;
  //console.log(lessonID);
  //const [lessonID, setLesson] = useState(lessonDefault);
  const navigate = useNavigate();
  const [prevLesson, setPrevLesson] = useState(lesson_block_data_default);
  const [nextLesson, setNextLesson] = useState(lesson_block_data_default);
  const [chapter, setChapter] = useState();
  const [lesson_block_data, setlesson_block_data] = useState(lesson_block_data_default);
  const [codeSubmission, setCodeSubmission] = useState(codeSubmission_default);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  const { toggleLayout } = useContext(UserContext);
  const { lessonLayoutType } = useContext(UserContext);

  const [needs2Save, setNeed2Save] = useState(false);
  const output = document.getElementById("output");
  const { isReady, outputLines, clearOutput, runCode, runGraded } = usePyodide();
  
  
  //const { isLightMode } = useContext();
  //const navigate = useNavigate();
  let rightCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: 'auto',
        //marginRight: 0,
        width:"44rem",
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let leftCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: 0,
        //marginRight: '50px',
        width: '44rem',
        height:'656px'
        //height: 'fit-content',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let centerCard = {
        display: "flex",
        flexDirection:"column",
        width:"716px",
        height: "40.8px",
        textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
  function addToOutput(s) {
    output.value += ">>>" + editorView.state.doc.toString() + "\n" + s + "\n";
  };
  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
  }, []);
  /* async function hello_python() {
    let pyodide = await loadPyodide();
    return pyodide.runPythonAsync("1+1");
  }; */
  const clearOut = async (e) => {
    output.value = "";
    clearOutput();
  };

  const handleRun = async (e) => {
    clearOut();
    e.preventDefault();
    setCodeSubmission({ ...codeSubmission, script_submission: editorView.state.doc.toString() });
    //addToOutput("This is a placeholder for outputs");
    //console.log("Attempting to run code");
    const codeOutput = await runCode(editorView.state.doc.toString());
    //console.log(output);
    //console.log(output.error);
    if (codeOutput.error) {
      //console.log("There was an error");
      output.value += `Error: ${codeOutput.error}\n`;
      //console.log(`Error: ${codeOutput.error}\n`);
      return;
    }
    setNeed2Save(true);
    
  };
  
  const handleChapterReturn = (async) => {
    //localStorage.clear();
    navigate(`/chapter/${chapter['_id']}`);
  };
  const handleNextLesson = (async) => {
    //localStorage.clear();
    
    navigate(`/lessonRedirect/${nextLesson._id}`);
    //seed+=(1);
  };
  const handlePreviousLesson = (async) => {
    //localStorage.clear();
    navigate(`/lessonRedirect/${prevLesson._id}`);
    
  };
//a

  const handleSubmit = async (e) => {
    clearOut();
    e.preventDefault();
    const code = editorView.state.doc.toString();
    setCodeSubmission({ ...codeSubmission, script_submission: code });
    //console.log('test verification');
    let verification;
    try {
      //console.log("Next log should be the testcases");
      //console.log((lesson_block_data.solution_verification));
      //console.log((lesson_block_data));
      //console.log(`verification.testCases: ${verification.testCases}`);
      verification = (lesson_block_data.solution_verification);
    } catch (error) {
      //console.log(error);
      console.log('This lesson has no valid test cases configured.');
      setError('This lesson has no valid test cases configured.');
      return;
    }
    //console.log('test grading');
    const graded = await runGraded(code, verification);
    //console.log(verification);
    //console.log('test graded');
    
    //console.log(graded);
    if (graded.error) {
      output.value += `Grading error: ${graded.error}\n`;
      return;
    }
    //console.log('graded success');
    const passedCount = graded.results.filter(r => r.passed).length;
    const total = graded.results.length;
    const allPassed = passedCount === total;
    //console.log('test output');
    output.value += `\n--- ${passedCount}/${total} tests passed ---\n`;
    graded.results.forEach((r, i) => {
      console.log(r);
      if (!r.passed ) {
        if (r.error) output.value += `Test ${i + 1} failed due to an error: ${r.error}\n`;
        else {
          if (verification.mode==="function") {
            output.value += `Test ${i + 1} FAILED — args: ${JSON.stringify(r.args)}, expected: ${JSON.stringify(r.expected)}, got: ${r.error ? 'error' : JSON.stringify(r.actual)}\n`;
          } 
          if (verification.mode==="script") {
            if (r.type==="stdout") {
              output.value += `Test ${i + 1} FAILED - Results below \n\tExpected: \n${(r.expected)} \n\tGot: \n${r.error ? 'error' : (r.actual)}\n`;
            } 
            if (r.type==="variable") {
              output.value += `Test ${i + 1} FAILED — expected: ${JSON.stringify(r.expected)}, got: ${r.error ? 'error' : JSON.stringify(r.actual)}\n`;
            }
          } 
        }
      }
      else {
        if (verification.mode==="function") {
          if (r.actual_stdout) {
            output.value += `Test ${i + 1} PASSED - Got: \n${r.error ? 'error' : (r.actual_stdout)}\n`;
          }
          else {
          output.value += `Test ${i + 1} PASSED — args: ${JSON.stringify(r.args)}, got: ${r.error ? 'error' : JSON.stringify(r.actual)}\n`;
          }
        } 
        if (verification.mode==="script") {
          if (r.type==="stdout"||r.type==="min_lines"||r.type==="callable") {
            console.log(r.actual);
            output.value += `Test ${i + 1} PASSED - Got: \n${r.error ? 'error' : (r.actual)}\n`;
          } 
          if (r.type==="variable") {
            output.value += `Test ${i + 1} PASSED — got: ${r.error ? 'error' : JSON.stringify(r.actual)}\n`;
          } 
        } 
      }
    });
    //console.log(`allPassed = ${allPassed}`);
    //a
    setCodeSubmission(prev => ({ ...prev, success: allPassed }));
    setNeed2Save(true);
  };


  useEffect(() => {
    //console.log(outputLines);
    if (outputLines.length>=1) {
      //console.log("Updating Lines");
      //console.log(performance.now());
      //console.log(outputLines);
      output.value += outputLines.at(outputLines.length-1) + "\n";
    }
  }, [outputLines]);

  useEffect(() => {
    async function saveSystem() {
      //console.log(`Needs to save check: ${needs2Save}`);
      if (needs2Save) {
        try {
          //console.log(codeSubmission);
          await axios.post((url_submissionUpdate+codeSubmission['_id']+"/update"), {params: codeSubmission});
          setNeed2Save(false);
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            setError(error.response.data.message);
          }
        }
      }
    }
    saveSystem();//a
  }, [needs2Save]);
  
  useEffect(() => {
    //console.log(codeSubmission["script_submission"]);
    if (document.querySelector(`.cm-editor`)===null) {
      //console.log(`(Seeder) Is there an editor? ${document.querySelector(`.cm-editor`)!==null}`);
      //console.log(`(Seeder) Does editor's parent exist? ${document.getElementById("editor")!==null}`);
      setSeed((prev) => prev+1)
    }
  }, [codeSubmission.script_submission]);

  
  useEffect(() => {
    if (document.querySelector(`.cm-editor`)===null && document.getElementById("editor")!==null) {
      console.log("Creating new Editor.");
      createEditor(codeSubmission["script_submission"]);
    }
  }, [createEditor, seed]);

  const fetch_data = async () => {
      
      try {

        //console.log({userID: user['id'], lessonID: lessonID});
        const submissionResult = await axios.get(url_submissionLoad, {params: {userID: user['id'], lessonID: lessonID}});
        setCodeSubmission(submissionResult.data[0]);
        //console.log(submissionResult.data);
        //console.log(submissionResult.data[0]._id);
        //console.log(`Submission retrieved`);
        //console.log(codeSubmission._id);
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          const submissionCreateResult = await axios.post(url_submissionCreate, {params: {userID: user['id'], lessonID: lessonID}});
          setSeed(seed+1);
          navigate(`/lessonRedirect/${lessonID}`);

          //console.log(submissionCreateResult);
        }
        else if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
      try {
        //console.log(lesson_block_data);
        const lessonResult = await axios.get(url_LessonData+lessonID);
        setlesson_block_data(lessonResult.data);
        //console.log(lessonResult.data['chapter_no']);
        const ChapterRes = await axios.get(url_chapter, {params: {chapter_no: (lessonResult.data['chapter_no'])}});
        console.log(ChapterRes.data[0]);
        setChapter(ChapterRes.data[0]);

        //console.log((lessonResult.data['order_within_chapter']));
        //console.log((lessonResult.data['order_within_chapter'])!=0);
        if (lessonResult.data['order_within_chapter']>1) {
          const prevLessonRes = await axios.get(url_otherLessons, {params: {chapter_no: lessonResult.data['chapter_no'], order_within_chapter: (lessonResult.data['order_within_chapter']-1)}});
        setPrevLesson(prevLessonRes.data[0]);
        }
        else {
        setPrevLesson("Null");
        }
        if (!lessonResult.data['is_test']&& ChapterRes.data[0].lessons.length>lessonResult.data.order_within_chapter&&lessonResult.data.order_within_chapter!==0) {
          try {
          const nextLessonRes = await axios.get(url_otherLessons, {params: {chapter_no: lessonResult.data['chapter_no'], order_within_chapter: (lessonResult.data['order_within_chapter']+1)}});
          console.log(nextLessonRes.data);
          setNextLesson(nextLessonRes.data[0]);
        } catch (error) {
          if (error.response.status === 404) {
            setNextLesson("Null");
          }
        }
        }
          else {
        setNextLesson("Null");
        }
        //console.log(result);
        //console.log(lessonResult.data);
        //console.log(`Lesson found`);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
    };
  //const { username } = user;
  
  
  if (codeSubmission.script_submission===null||prevLesson===null||nextLesson===null||lesson_block_data._id===null) return (
    <>
        <div key={seed} style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading User Submission</h4></div>
    </>
    ) 
  
  if (lessonLayoutType===0) {
    //console.log(codeSubmission.script_submission);
    return (
      <section className="lesson-type-one" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <div className="right nav" style={centerCard}>
                  {prevLesson!=="Null"&&<button style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handlePreviousLesson}>Previous Lesson</button>}
                  {prevLesson==="Null"&&<button disabled title="Previous Lesson does not exist" style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Previous Lesson</button>}
                  
                  <button style={{justifyContent:"center",height:'37.6px', backgroundColor:'#0d6efd',color:'#fff', width:'33.3%', opacity:'0.65'}}   onClick={toggleLayout}><p style={{fontSize:'75%', textAlign:'center', height:'50%', marginBottom:'0'}}>Ch {lesson_block_data.chapter_no} Lesson {lesson_block_data.order_within_chapter}:</p><p style={{fontSize: lesson_block_data.title.length>30? '45%': '75%', textAlign:'center', height:'50%',}}>{lesson_block_data.title}</p></button>

                  {nextLesson!=="Null"&&lesson_block_data.is_test===false&&<button style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handleNextLesson}>Next Lesson</button>}
                  {nextLesson==="Null"&&lesson_block_data.is_test===false&&<button disabled title="Next Lesson does not exist" style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Next Lesson</button>}
                  {lesson_block_data.is_test===true&&<button title={`Return to chapter ${lesson_block_data.chapter_no}`} style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handleChapterReturn}/* href={`/chapter/${chapter['_id']}`} */>Back to Chapter</button>}
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                
                <LessonInstructions style={{height:'613.2px'}} lessonId={lessonID} />
              </div>
              <div className='box' style={rightCard}>
                <div className="right" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"328px", width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff"}} />
                </div>
                <div className="right nav" style={centerCard, {width:'100%'}}>
                  <button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', width:'33.3%', height:'37.5px'}} title="Clear Output" variant="success" onClick={clearOut} >Clear Output</button>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'33.3%', height:'37.5px'}} title="Run Code" variant="success" onClick={handleRun}/* href="/lessons" */>Run Code</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'33.3%', height:'37.5px'}} title="Submit Code" variant="success" onClick={handleSubmit}/* href="/lessons" */>Submit Code</button>
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",resize:"none", width:"stretch", height:"45%"}}>
                  {/* {"Pretend this is a terminal that's spitting out results, I'll get it working later"} */}
                  <PythonTerminal></PythonTerminal>
                </div>
              </div>
          </div>
        </div>
      </section>
  );}
  if (lessonLayoutType===1) return (
      <section className="lesson-type-zero" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <div className="left nav" style={centerCard}>
                  {prevLesson!=="Null"&&<button style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'16.7%', height:'37.5px'}}  variant="secondary" onClick={handlePreviousLesson}>Previous Lesson</button>}
                  {prevLesson==="Null"&&<button disabled title="Previous Lesson does not exist" style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'16.7%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Previous Lesson</button>}
                  
                  <button style={{justifyContent:"center",height:'37.6px', backgroundColor:'#0d6efd',color:'#fff', width:'16.7%', opacity:'0.65'}}   onClick={toggleLayout}><p style={{fontSize:'75%', textAlign:'center', height:'50%', marginBottom:'0'}}>Ch {lesson_block_data.chapter_no} Lesson {lesson_block_data.order_within_chapter}:</p><p style={{fontSize: lesson_block_data.title.length>30? '45%': '75%', textAlign:'center', height:'50%',}}>{lesson_block_data.title}</p></button>

                  {nextLesson!=="Null"&&lesson_block_data.is_test===false&&<button style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'16.7%', height:'37.5px'}}  variant="secondary" onClick={handleNextLesson}>Next Lesson</button>}
                  {nextLesson==="Null"&&lesson_block_data.is_test===false&&<button disabled title="Next Lesson does not exist" style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'16.7%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Next Lesson</button>}
                  {lesson_block_data.is_test===true&&<button title={`Return to chapter ${lesson_block_data.chapter_no}`} style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'16.7%', height:'37.5px'}}  variant="secondary" onClick={handleChapterReturn}/* href={`/chapter/${chapter['_id']}`} */>Back to Chapter</button>}
                  
                  
                  <button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', width:'16.7%', height:'37.5px'}} title="Clear Output" variant="success" onClick={clearOut} >Clear Output</button>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'16.7%', height:'37.5px'}} title="Run Code" variant="success" onClick={handleRun}/* href="/lessons" */>Run Code</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'16.7%', height:'37.5px'}} title="Submit Code" variant="success" onClick={handleSubmit}/* href="/lessons" */>Submit Code</button>
                  
                  

                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div className="left" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"612px", width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff"}} />
                </div>
              </div>
              {/* <div className='box' style={{width:'7rem',display: "flex", alignSelf:'center', height:'656px'}}>
                <div className="codeFunctions" style={{display: "flex", flexDirection:"column",height:"328px", textAlign: 'center',justifySelf:'center', width:'100%'}}>
                  <button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', height:'33.3%'}} title="Clear Output" variant="success" onClick={clearOut} >Clear Output</button>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', height:'33.3%'}} title="Run Code" variant="success" onClick={handleRun}/* href="/lessons" * />Run Code</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', height:'33.3%'}} title="Submit Code" variant="success" onClick={handleSubmit}/* href="/lessons" * />Submit Code</button>
                </div>
              </div> */}
              <div className='box' style={rightCard}>
                {/* {<div className="Instructions" id="Instructions" style={{color: isLightMode? "#a0316e": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", height:"50%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}} ><LessonInstructions lessonId={lessonID} /> {lesson_block_data["instructions"]} </div>} */}
                <LessonInstructions lessonId={lessonID} />
                
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",resize:"none", width:"stretch", height:"50%"}}>
                  {/* {"Pretend this is a terminal that's spitting out results, I'll get it working later"} */}
                  <PythonTerminal></PythonTerminal>
                </div>
              </div>
          </div>
        </div>
      </section>
  );
  if (lessonLayoutType===2) return (
      <section className="lesson-type-two" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <div className="right nav" style={centerCard}>
                  {prevLesson!=="Null"&&<button style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handlePreviousLesson}>Previous Lesson</button>}
                  {prevLesson==="Null"&&<button disabled title="Previous Lesson does not exist" style={{justifyContent:"left", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Previous Lesson</button>}
                  
                  <button style={{justifyContent:"center",height:'37.6px', backgroundColor:'#0d6efd',color:'#fff', width:'33.3%', opacity:'0.65'}}   onClick={toggleLayout}><p style={{fontSize:'75%', textAlign:'center', height:'50%', marginBottom:'0'}}>Ch {lesson_block_data.chapter_no} Lesson {lesson_block_data.order_within_chapter}:</p><p style={{fontSize: lesson_block_data.title.length>30? '45%': '75%', textAlign:'center', height:'50%',}}>{lesson_block_data.title}</p></button>

                  {nextLesson!=="Null"&&lesson_block_data.is_test===false&&<button style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handleNextLesson}>Next Lesson</button>}
                  {nextLesson==="Null"&&lesson_block_data.is_test===false&&<button disabled title="Next Lesson does not exist" style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px', opacity:'0.65'}}  variant="secondary" /* href="/lessons" */>Next Lesson</button>}
                  {lesson_block_data.is_test===true&&<button title={`Return to chapter ${lesson_block_data.chapter_no}`} style={{justifyContent:"right", backgroundColor:'#6c757d',color:'#fff', width:'33.3%', height:'37.5px'}}  variant="secondary" onClick={handleChapterReturn}/* href={`/chapter/${chapter['_id']}`} */>Back to Chapter</button>}
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                
                <LessonInstructions style={{height:'613.2px'}} lessonId={lessonID} />
              </div>
              <div className='box' style={rightCard}>
                <div className="right" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"328px", width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff"}} />
                </div>
                <div className="right nav" style={centerCard, {width:'100%'}}>
                  <button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', width:'33.3%', height:'37.5px'}} title="Clear Output" variant="success" onClick={clearOut} >Clear Output</button>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'33.3%', height:'37.5px'}} title="Run Code" variant="success" onClick={handleRun}/* href="/lessons" */>Run Code</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'33.3%', height:'37.5px'}} title="Submit Code" variant="success" onClick={handleSubmit}/* href="/lessons" */>Submit Code</button>
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",resize:"none", width:"stretch", height:"45%"}}>
                  {/* {"Pretend this is a terminal that's spitting out results, I'll get it working later"} */}
                  <PythonTerminal></PythonTerminal>
                </div>
              </div>
          </div>
        </div>
      </section>
  );
};

export default LessonTestPage;
