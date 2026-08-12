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
import GradingCriteriaBuilder from "../Gradingcriteriabuilder.js";
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



const url_chapter = `${API_BASE}/chapter/`;
const RefreshURL = `${API_BASE}/chapter/`;


//const chapterDefault = {chapterID: "6a514290bbb150f63e042595"};
const chapter_block_data_default = {_id:"" , title: "Enter Chapter Title Here", description: "Enter Description Here",chapter_no:0,documentation_references: null};




const ChapterModifier = () => {
  const [user, setUser] = useState(getUserInfo());
  const {editorView} = useContext(UserContext);
  const {createEditor} = useContext(UserContext);
  
  //const [data, setData] = useState(dataDefault);
  let {chapterID} = useParams();
  console.log(chapterID);
  //if (chapterID === "new")
  chapter_block_data_default._id=chapterID;
  //console.log(chapterID);
  //const [chapterID, setChapter] = useState(chapterDefault);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState();
  const [chapter_block_data, setChapter_block_data] = useState(chapter_block_data_default);
  //const [codeSubmission, setCodeSubmission] = useState(codeSubmission_default);
  const [seed, setSeed] = useState(1);
  const [refreshBox, setRefreshBox] = useState(1);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { toggleLayout } = useContext(UserContext);
  
  const [needs2Save, setNeed2Save] = useState(false);
  const output = document.getElementById("output");
  const { isReady, outputLines, clearOutput, runCode, runGraded } = usePyodide();
  const [referenceSolutionText, setReferenceSolutionText] = useState();
  
  
  //const { isLightMode } = useContext();
  //const navigate = useNavigate();
  let rightCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: '25%',
        //marginRight: 0,
        width:"52rem",
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
        //overflowY: "scroll",
        //scrollbarWidth:'thin',
        paddingRight: "0px",
        paddingLeft: "0px"
    };
    let leftCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: 0,
        //marginRight: '50px',
        width: '44rem',
        height:'656px',
        paddingRight: "0px",
        paddingLeft: "0px"
        //height: 'fit-content',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let centerCard = {
        display: "flex",
        flexDirection:"column",
        width:"stretch",
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
    console.log(chapter_block_data.is_test);
    setChapter_block_data({ ...chapter_block_data, ["is_test"]: chapter_block_data.is_test?false:true });
    
  };

  const handleChange = ({ currentTarget: input }) => {
    if (input.name==="referenceSolutionText") setReferenceSolutionText(input.value)
    else setChapter_block_data({ ...chapter_block_data, [input.name]: input.value });
    console.log("Name: ", input.name);
    console.log("Value: ", input.value);
    };

  const handleRefreshChapter = async (e) => {
    e.preventDefault();
    //setCodeSubmission({ ...codeSubmission, script_chapter: editorView.state.doc.toString() });
    const resfreshResult = await axios.post(RefreshURL+chapterID+"/refresh");
	console.log(resfreshResult.data);
	return resfreshResult.data;
    
  };
  
  
//a

  const handleUpdate = async (e) => {
    e.preventDefault();
    setChapter_block_data(chapter_block_data);
    //console.log(code);
    //setCodeSubmission({ ...codeSubmission, script_chapter: code });
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
          console.log(chapter_block_data);
          const chapterUpdatedResponse = await axios.post((url_chapter+chapter_block_data['_id']+"/edit"), {params: chapter_block_data});
		  //console.log(chapterUpdatedResponse);
          setNeed2Save(false);
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            console.log(error.response.data.message);
          }
        }
      }
    }
    saveSystem();//a
  }, [needs2Save]);
  
  useEffect(() => {
    //console.log(codeSubmission["script_chapter"]);
    if (document.querySelector(`.cm-editor`)===null) {
      //console.log(`(Seeder) Is there an editor? ${document.querySelector(`.cm-editor`)!==null}`);
      //console.log(`(Seeder) Does editor's parent exist? ${document.getElementById("editor")!==null}`);
      setSeed((prev) => prev+1)
    }
  }, [chapter_block_data.content]);
  const refresher = async () => {
    setRefreshBox((prev) => prev>=1?0:prev+1);
  };

  
  useEffect(() => {
    if (document.querySelector(`.cm-editor`)===null && document.getElementById("editor")!==null) {
      console.log("Creating new Editor.");
      //console.log(chapter_block_data["content"]);
      createEditor(chapter_block_data["content"],false);
    }
  }, [createEditor, seed]);

  const fetch_data = async () => {
      try {
        //console.log(chapter_block_data);
        const chapterResult = await axios.get(url_chapter+"find/"+chapterID);
        setChapter_block_data(chapterResult.data);
        console.log(chapterResult.data);
        //setSeed(seed+1);
        //console.log((chapterResult.data['order_within_chapter']));
        //console.log((chapterResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(chapterResult.data);
        //console.log(`Chapter found`);
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
  console.log(chapter_block_data);
  if (chapter_block_data._id===null || chapter_block_data.documentation_references===null) return (
    <>
        <div key={seed} style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Chapter Data</h4></div>
        <div>{error}</div>
    </>
    ); 
  
  if (user.admin) {
    //console.log(chapter_block_data.content);
    return (
      <section className="document-type-one" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={rightCard}>
                <div className="right nav" style={{display: "flex", flexDirection:"column", width:"stretch", height:"fit-content"}}>
                  <div id="Explanation Textbox" style={{color:'#fff',width:'stretch'}} title="Change the chapter of the chapter">
  <pre style={{whiteSpace: "pre-wrap", display:"block", padding: "5px 24px", overflowX: "auto", position: "relative",marginBottom:"0px"}}>
    <span>Welcome to the Chapter Editor!</span><br/>
    <span>Here you'll find all the tools needed to create a new chapter, or modify an existing chapter.</span><br/>
    <span>Just below here you'll find the html code editor for the instructions page shown to your left.</span><br/>
    <span>If you scroll down, you'll find some other fields that alter other details of the chapter.</span><br/>
  </pre>
</div>
                </div>
                <div className="right nav" style={centerCard, {width:'100%'}}>
                  <pre style={{whiteSpace: "pre-wrap", display:"block", overflowX: "auto", position: "relative",marginBottom:"0px",width:'100%'}}>
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#0d85fd',color:'#fff',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px",width:"50%",marginLeft:"25%"}}   /* onClick={toggleLayout} */defaultValue={chapter_block_data.title} onChange={handleChange} name="title" title="Change the title of the chapter"/>
                  
				  <div style={{color:"#fff",backgroundColor:'#007d34',textAlign:'center'}}><input style={{textAlign:"center",height:'37.6px', backgroundColor:'#007d34',color:'#fff', width:'10%',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}}   /* onClick={toggleLayout} */defaultValue={chapter_block_data.chapter_no} onChange={handleChange} name="chapter_no" title="Change the chapter of the chapter"/> <br/>Alters what position the chapter is in the chapter list.</div>
                  <input style={{textAlign:"center",height:'37.6px', backgroundColor:'#fd5d0d',color:'#fff', width:'100%', overflowX:'scroll',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}} defaultValue={chapter_block_data.description} onChange={handleChange} name="description" title="Change to modify the description of the chapter."/>
                  
                </pre>
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'50%', height:'37.5px'}} title="View Changes" variant="success" onClick={handleRefreshChapter}/* href="/chapters" */>Refresh Chapter</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'50%', height:'37.5px'}} title="Submit Changes" variant="success" onClick={handleUpdate}/* href="/chapters" */disabled = { // Disables the button's functions if options are not filled in
                    chapter_block_data.title ==="Enter Chapter Title Here" || 
                    //chapter_block_data.chapter_no ===0 || 
                    chapter_block_data.order_within_chapter ===0 
                    //|| chapter_block_data.description ==="Enter Description Here"
                  }>Submit Changes</button>
                </div>  
              </div>
          </div>
        </div>
      </section>
  );
}
};

export default ChapterModifier;
