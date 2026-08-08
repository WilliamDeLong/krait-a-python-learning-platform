import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api.js';
import getUserInfo from "../../utilities/decodeJwt.js";
import { UserContext } from '../../App.js';
import "../../css/editor.css";
//import "../../css/InstructionsEditorDisplay.css";
import "../../css/h3.css";
import "../../css/box.css";
import PythonTerminal from "../PyTerminal.js";
import InstructionsEditorDisplay from "../InstructionsEditorDisplay.js";
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



const url_submissionUpdate = `${API_BASE}/lesson/`;
const url_submissionLoad = `${API_BASE}/submissions/findSubmission`;
const url_submissionCreate = `${API_BASE}/submissions/create`;
const url_LessonData = `${API_BASE}/lesson/`;
const url_otherLessons = `${API_BASE}/lesson/findLesson`;
const url_chapter = `${API_BASE}/chapter/findChapter`;



//const lessonDefault = {lessonID: "6a19e16bd4abefc266f8ab0c"};
const lesson_block_data_default = {_id:"6a19e16bd4abefc266f8ab0c" , default_script: "", solution_verification: '', instructions: "", title: "Enter Lesson Title Here", instructionsHTML:null, chapter_no: 0, order_within_chapter: 0, description: "Enter Description Here"};
const codeSubmission_default = {"_id": null, script_submission: null, userID: "null", lessonID: "null", success: false, submission_date: null};



const LessonCreator = () => {
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
  //const [codeSubmission, setCodeSubmission] = useState(codeSubmission_default);
  const [seed, setSeed] = useState(1);
  const [refreshBox, setRefreshBox] = useState(1);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { toggleLayout } = useContext(UserContext);
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
        width:"51rem",
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
    output.value += /* ">>>" + editorView.state.doc.toString() +  "\n" + */s/* + "\n"*/;
  };
  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
  }, [seed]);
  /* async function hello_python() {
    let pyodide = await loadPyodide();
    return pyodide.runPythonAsync("1+1");
  }; */
  const swapTestState = async (e) => {
    console.log(lesson_block_data.is_test);
    setlesson_block_data({ ...lesson_block_data, ["is_test"]: lesson_block_data.is_test?false:true });
    
  };

  const handleChange = ({ currentTarget: input }) => {
        setlesson_block_data({ ...lesson_block_data, [input.name]: input.value });
        //console.log("Name: ", input.name);
        //console.log("Value: ", input.value);
    };

  const handleViewChanges = async (e) => {
    e.preventDefault();
    //setCodeSubmission({ ...codeSubmission, script_submission: editorView.state.doc.toString() });
    
    //console.log("Attempting to run code");
    //const codeOutput = await runCode(editorView.state.doc.toString());
    //console.log(output);
    //console.log(output.error);
    setlesson_block_data({ ...lesson_block_data, instructionsHTML: editorView.state.doc.toString() });
    //addToOutput(lesson_block_data);
    console.log(lesson_block_data);
    //lesson_block_data["instructionsHTML"]
    refresher();
    //setNeed2Save(true);
    
  };
  
  
//a

  const handleUpdate = async (e) => {
    e.preventDefault();
    setlesson_block_data({ ...lesson_block_data, instructionsHTML: editorView.state.doc.toString() });
    //console.log(code);
    //setCodeSubmission({ ...codeSubmission, script_submission: code });
    //console.log('test verification');
    //setCodeSubmission(prev => ({ ...prev, success: allPassed }));
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
          console.log(lesson_block_data);
          await axios.post((url_submissionUpdate+lesson_block_data['_id']+"/edit"), {params: lesson_block_data});
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
  }, [lesson_block_data.instructionsHTML]);
  const refresher = async () => {
    setRefreshBox((prev) => prev>=1?0:prev+1);
  };

  
  useEffect(() => {
    if (document.querySelector(`.cm-editor`)===null && document.getElementById("editor")!==null) {
      console.log("Creating new Editor.");
      //console.log(lesson_block_data["instructionsHTML"]);
      createEditor(lesson_block_data["instructionsHTML"],false);
    }
  }, [createEditor, seed]);

  const fetch_data = async () => {
      try {
        //console.log(lesson_block_data);
        const lessonResult = await axios.get(url_LessonData+lessonID);
        setlesson_block_data(lessonResult.data);
        console.log(lessonResult.data);
        const ChapterRes = await axios.get(url_chapter, {params: {chapter_no: (lessonResult.data['chapter_no'])}});
        console.log(ChapterRes.data[0]);
        setChapter(ChapterRes.data[0]);
        //setSeed(seed+1);
        //console.log((lessonResult.data['order_within_chapter']));
        //console.log((lessonResult.data['order_within_chapter'])!=0);
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
  
  if (lesson_block_data._id===null || lesson_block_data.instructionsHTML===null) return (
    <>
        <div key={seed} style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Lesson Data</h4></div>
    </>
    ) 
  
  if (user.admin) {
    //console.log(lesson_block_data.instructionsHTML);
    return (
      <section className="lesson-type-one" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <div className="right nav" style={centerCard}>
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#6c757d',color:'#fff', width:'25%'}}   /* onClick={toggleLayout} */defaultValue={lesson_block_data.chapter_no} onChange={handleChange} name="chapter_no" title="Change the chapter of the lesson"></input>
                  
                  
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#0d6efd',color:'#fff', width:'25%'}}   /* onClick={toggleLayout} */defaultValue={lesson_block_data.title} onChange={handleChange} name="title" title="Change the title of the lesson"></input>
                  <button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', width:'25%', height:'37.5px'}} title="Toggles whether or not this lesson is a test or not." variant="success" onClick={swapTestState} >Is test: {lesson_block_data.is_test ? "True": "False"}</button>
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#6c757d',color:'#fff', width:'25%'}}   /* onClick={toggleLayout} */defaultValue={lesson_block_data.order_within_chapter} onChange={handleChange} name="order_within_chapter" title="Change the placement of the lesson within its chapter"></input>
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                
                <InstructionsEditorDisplay style={{height:'613.2px'}} htmlData={lesson_block_data.instructionsHTML} key={refreshBox} />
              </div>
              <div className='box' style={rightCard}>
                <div className="right" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"328px", width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff"}} />
                </div>
                <div className="right nav" style={centerCard, {width:'100%'}}>
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#0d6efd',color:'#fff', width:'50%', overflowX:'scroll'}}   /* onClick={toggleLayout} */defaultValue={lesson_block_data.description} onChange={handleChange} name="description" title="Change to modify the description of the lesson."></input>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'25%', height:'37.5px'}} title="View Changes" variant="success" onClick={handleViewChanges}/* href="/lessons" */>View Changes</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'25%', height:'37.5px'}} title="Submit Changes" variant="success" onClick={handleUpdate}/* href="/lessons" */disabled = { // Disables the button's functions if options are not filled in
                    lesson_block_data.title ==="Enter Lesson Title Here" || 
                    //lesson_block_data.chapter_no ===0 || 
                    lesson_block_data.order_within_chapter ===0 
                    //|| lesson_block_data.description ==="Enter Description Here"
                  }>Submit Changes</button>
                </div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",resize:"none", width:"stretch", height:"45%"}}>
                  {/* {"Pretend this is a terminal that's spitting out results, I'll get it working later"} */}
                  {<textarea id="output" style={{"width": "100%", height:'100%',resize:"none",color: "#008a00",backgroundColor: isLightMode? "#d9dbdf": "#000000"}} rows="6" disabled ></textarea>}
                  {/* <PythonTerminal></PythonTerminal> */}
                </div>
              </div>
          </div>
        </div>
      </section>
  );
}
};

export default LessonCreator;
