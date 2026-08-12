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



const url_documentationUpdate = `${API_BASE}/documentation/`;
//const url_documentationLoad = `${API_BASE}/documentations/findSubmission`;
//const url_documentationCreate = `${API_BASE}/documentations/create`;
const url_DocumentData = `${API_BASE}/documentation/`;
const url_otherDocuments = `${API_BASE}/documentation/find`;
const url_chapter = `${API_BASE}/chapter/findChapter`;



//const documentDefault = {documentID: "6a19e16bd4abefc266f8ab0c"};
const document_block_data_default = {_id:"6a7c94cb93b5021d439c6888" , title: "Enter Document Title Here", content:null, shortID: 0, description: "Enter Description Here",author:""};




const DocumentationCreator = () => {
  const [user, setUser] = useState(getUserInfo());
  const {editorView} = useContext(UserContext);
  const {createEditor} = useContext(UserContext);
  
  //const [data, setData] = useState(dataDefault);
  let {documentID} = useParams();
  console.log(documentID);
  //if (documentID === "new")
  document_block_data_default._id=documentID;
  //console.log(documentID);
  //const [documentID, setDocument] = useState(documentDefault);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState();
  const [document_block_data, setdocument_block_data] = useState(document_block_data_default);
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
        //marginLeft: 'auto',
        //marginRight: 0,
        width:"52rem",
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
        overflowY: "scroll",
        scrollbarWidth:'thin',
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
    console.log(document_block_data.is_test);
    setdocument_block_data({ ...document_block_data, ["is_test"]: document_block_data.is_test?false:true });
    
  };

  const handleChange = ({ currentTarget: input }) => {
    if (input.name==="referenceSolutionText") setReferenceSolutionText(input.value)
    else setdocument_block_data({ ...document_block_data, [input.name]: input.value });
    console.log("Name: ", input.name);
    console.log("Value: ", input.value);
    };

  const handleViewChanges = async (e) => {
    e.preventDefault();
    //setCodeSubmission({ ...codeSubmission, script_documentation: editorView.state.doc.toString() });
    
    //console.log("Attempting to run code");
    //const codeOutput = await runCode(editorView.state.doc.toString());
    //console.log(output);
    //console.log(output.error);
    setdocument_block_data({ ...document_block_data, content: editorView.state.doc.toString() });
    //addToOutput(document_block_data);
    console.log(document_block_data);
    //document_block_data["content"]
    //refresher();
    //setNeed2Save(true);
    
  };
  
  
//a

  const handleUpdate = async (e) => {
    e.preventDefault();
    setdocument_block_data({ ...document_block_data, content: editorView.state.doc.toString() });
    //console.log(code);
    //setCodeSubmission({ ...codeSubmission, script_documentation: code });
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
          console.log(document_block_data);
          const documentUpdatedResponse = await axios.post((url_documentationUpdate+document_block_data['_id']+"/edit"), {params: document_block_data});
		  console.log(documentUpdatedResponse);
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
    //console.log(codeSubmission["script_documentation"]);
    if (document.querySelector(`.cm-editor`)===null) {
      //console.log(`(Seeder) Is there an editor? ${document.querySelector(`.cm-editor`)!==null}`);
      //console.log(`(Seeder) Does editor's parent exist? ${document.getElementById("editor")!==null}`);
      setSeed((prev) => prev+1)
    }
  }, [document_block_data.content]);
  const refresher = async () => {
    setRefreshBox((prev) => prev>=1?0:prev+1);
  };

  
  useEffect(() => {
    if (document.querySelector(`.cm-editor`)===null && document.getElementById("editor")!==null) {
      console.log("Creating new Editor.");
      //console.log(document_block_data["content"]);
      createEditor(document_block_data["content"],false);
    }
  }, [createEditor, seed]);

  const fetch_data = async () => {
      try {
        //console.log(document_block_data);
        const documentResult = await axios.get(url_DocumentData+documentID);
        setdocument_block_data(documentResult.data);
        console.log(documentResult.data);
        //setSeed(seed+1);
        //console.log((documentResult.data['order_within_chapter']));
        //console.log((documentResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(documentResult.data);
        //console.log(`Document found`);
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
  console.log(document_block_data);
  if (document_block_data._id===null || document_block_data.content===null) return (
    <>
        <div key={seed} style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Document Data</h4></div>
        <div>{error}</div>
    </>
    ); 
  
  if (user.admin) {
    //console.log(document_block_data.content);
    return (
      <section className="document-type-one" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                
                {/* <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(17, 17, 17)'}}/> */}
                
                <InstructionsEditorDisplay style={{height:'100%', scrollbarWidth: "thin"}} htmlData={document_block_data.content} key={refreshBox} />
              </div>
              <div className='box' style={rightCard}>
                <div className="right nav" style={{display: "flex", flexDirection:"column", width:"stretch", height:"fit-content"}}>
                  <div id="Explanation Textbox" style={{color:'#fff',width:'stretch'}} title="Change the chapter of the document">
  <pre style={{whiteSpace: "pre-wrap", display:"block", padding: "5px 24px", overflowX: "auto", position: "relative",marginBottom:"0px"}}>
    <span>Welcome to the Document Editor!</span><br/>
    <span>Here you'll find all the tools needed to create a new document, or modify an existing document.</span><br/>
    <span>Just below here you'll find the html code editor for the instructions page shown to your left.</span><br/>
    <span>If you scroll down, you'll find some other fields that alter other details of the document.</span><br/>
  </pre>
</div>
                </div>
                <div className="right" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff",scrollbarWidth: 'thin'}} />
                </div>
                <div className="right nav" style={centerCard, {width:'100%'}}>
                  
                  <button style={{justifyContent:"center", backgroundColor:'#198754',color:'#fff', width:'50%', height:'37.5px'}} title="View Changes" variant="success" onClick={handleViewChanges}/* href="/documents" */>View Changes</button>
                  <button style={{justifyContent:"center", backgroundColor:'#accf11',color:'#fff', width:'50%', height:'37.5px'}} title="Submit Changes" variant="success" onClick={handleUpdate}/* href="/documents" */disabled = { // Disables the button's functions if options are not filled in
                    document_block_data.title ==="Enter Document Title Here" || 
                    //document_block_data.shortID ===0 || 
                    document_block_data.order_within_chapter ===0 
                    //|| document_block_data.description ==="Enter Description Here"
                  }>Submit Changes</button>
                </div>
                <div id="Explanation Textbox" style={{color:'#fff',width:'stretch'}} title="Change the chapter of the document">
                <pre style={{whiteSpace: "pre-wrap", display:"block", padding: "5px 24px", overflowX: "auto", position: "relative",marginBottom:"0px"}}>
                  <span>The above buttons as you can probably guess allow you to view the modifications you made to the html script on the left, or upload the changes you've made to the database.</span><br/><br/>
                  <span><strong>NOTICE: ALL changes made to the code and attribute fields will be updated upon clicking submit, so make sure that you don't enter anything you do not want to be updated.</strong></span><br/><br/>
                  <span>Just beneath these instructions you'll find 5 textboxes of varying colors, each controls a different attribute of the document's data.</span><br/>
                  <span>The texboxes are in-line before their respective descriptions:</span><br/>
                  <div style={{color:"#fff",backgroundColor:'#007d34'}}><input style={{textAlign:"center",height:'37.6px', backgroundColor:'#007d34',color:'#fff', width:'10%',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}}   /* onClick={toggleLayout} */defaultValue={document_block_data.shortID} onChange={handleChange} name="shortID" title="Change the chapter of the document"/> - Box 1: Alters what position the document is in the documentation list.</div>
                  {/* <div style={{color:"#fff",backgroundColor:'#4f007d'}}><input style={{textAlign:"center",height:'37.6px', backgroundColor:'#4f007d',color:'#fff', width:'10%',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}}   /* onClick={toggleLayout} * /defaultValue={document_block_data.order_within_chapter} onChange={handleChange} name="order_within_chapter" title="Change the placement of the document within its chapter"/> - Box 2: Alters the position that the document is in within a chapter.</div>
                  <div style={{color:"#fff",backgroundColor:'#a2170f'}}><button style={{justifyContent:"center", backgroundColor:'#a2170f',color:'#fff', height:'37.5px',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}} title="Toggles whether or not this document is a test or not." variant="success" onClick={swapTestState} >Is test: {document_block_data.is_test ? "True": "False"}</button> - Box 3: Toggles the test status of the document.</div> */}
                  <div style={{color:"#fff",backgroundColor:'#0d85fd'}}><input style={{textAlign:"center",height:'37.6px', backgroundColor:'#0d85fd',color:'#fff',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}}   /* onClick={toggleLayout} */defaultValue={document_block_data.title} onChange={handleChange} name="title" title="Change the title of the document"/> - Box 4: Alters the title of the document.</div>
                  <div style={{color:"#fff",backgroundColor:'#fd5d0d'}}><input style={{textAlign:"center",height:'37.6px', backgroundColor:'#fd5d0d',color:'#fff', width:'50%', overflowX:'scroll',border: "2px solid rgb(17, 17, 17)",borderRadius: "5px"}}   /* onClick={toggleLayout} */defaultValue={document_block_data.description} onChange={handleChange} name="description" title="Change to modify the description of the document."/> - Box 5: Alters the description of the document.</div>
                  
                </pre>
              </div>
              <div className="bar" style={{height:"2px",display:'flex',width:'stretch', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
              {/* <div id="Explanation Textbox" style={{color:'#fff',width:'stretch'}} title="Change the chapter of the document">
                <pre style={{whiteSpace: "pre-wrap", display:"block", padding: "5px 24px", overflowX: "auto", position: "relative",marginBottom:"0px"}}>
                  <span>Below you'll find a form that will aid in setting up the grading system for the current document</span><br/>
                  <span>But first you'll need a script to use as a test for the testcases.</span><br/>
                  <span>Just toss some python code into the text box here and it'll be used to test your test cases.</span><br/>
                  <div style={{borderRadius: "8px", overflow: "hidden", margin: "14px 0 22px", border: "1px solid #2a2a2a", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", backgroundColor: "#0d1117", border: "1px solid #1e3a5f", borderRadius: "10px"}}><textarea id="referenceSolutionText" style={{"width": "100%", height:'100%',resize:"none",color: "#f9fbf9",backgroundColor:"inherit", paddingLeft: '3px'}} rows="6" onChange={handleChange} name="referenceSolutionText"></textarea></div>
                </pre>
              </div>      */}
                
                {/* <div id="terminal" style={{resize:"none", width:"stretch"}}>
                  {"Pretend this is a terminal that's spitting out results, I'll get it working later"}
                  {{<textarea id="output" style={{"width": "100%", height:'100%',resize:"none",color: "#008a00",backgroundColor: isLightMode? "#d9dbdf": "#000000"}} rows="6" disabled ></textarea>}}
                  {<PythonTerminal></PythonTerminal>}
                  {<GradingCriteriaBuilder initialVerification={document_block_data.solution_verification || null} referenceSolution={referenceSolutionText} onChange={(json) => handleChange({ currentTarget: { name: 'solution_verification', value: json } }) } isLightMode={isLightMode} />}
                </div> */}
              </div>
          </div>
        </div>
      </section>
  );
}
};

export default DocumentationCreator;
