import React, { useState, useEffect, useContext} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';
import "../../css/editor.css";
import "../../css/h3.css";
import "../../css/box.css";
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


//const lessonDefault = {lessonID: "6a19e16bd4abefc266f8ab0c"};
const lesson_block_data_default = { default_script: "", solution_verification: '', instructions: "", title: ''};
const codeSubmission_default = {"_id": null, script_submission: null, userID: "null", lessonID: "null", success: false, submission_date: null};


const LessonTestPage = () => {
  const [user, setUser] = useState(getUserInfo());
  const {editorView} = useContext(UserContext);
  const {createEditor} = useContext(UserContext);

  //const [data, setData] = useState(dataDefault);
  let {lessonID} = useParams();
  //console.log(lessonID);
  //const [lessonID, setLesson] = useState(lessonDefault);
  
  const [lesson_block_data, setlesson_block_data] = useState(lesson_block_data_default);
  const [codeSubmission, setCodeSubmission] = useState(codeSubmission_default);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  const [needs2Save, setNeed2Save] = useState(false);
  //const {editorTheme, setEditorTheme} = useState(isLightMode);
  //const inputRef = useRef(null);
  //input.addEventListener("change", updateValue);
  //let extensions = [keymap.of([defaultKeymap, indentWithTab]), basicSetup, python()];
  /* if (document.querySelector(`.cm-editor`)!==null) {
    //var view_updator = document.querySelector(`.cm-editor`);
    let cmEditorElement = document.querySelector(".cm-editor"); // Or whatever query you need
    //let editorView = cmEditorElement.querySelector(".cm-content");
    console.log("Removed existing editor.");
    cmEditorElement.remove();
    //console.log(editorView);
    //console.log(editorView.state.doc.toString());
    //g
    //setCodeSubmission({ ...codeSubmission, ["script_submission"]: editorView.state.doc.toString() });
  }*/
  //console.log(document.querySelector(`.cm-editor`));
  
  //
  /* function changeTheme() {
    //console.log("Gate 1");
    //console.log(`is dark: ${!isLightMode}`);
    
      let options = {
          oneDark: !isLightMode,
      };
      //console.log("Gate 2");
      let newState = createEditorState(view.state.doc);
      if (!isLightMode)
        newState = createEditorState(view.state.doc, options);
      //console.log(options);
      view.setState(newState);
  } */
  //console.log(typeof(createEditor));
  //const { isLightMode } = useContext();
  //const navigate = useNavigate();
  let rightCard = {
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: 'auto',
        //marginRight: 0,
        width:"760px",
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let leftCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: 0,
        //marginRight: '50px',
        width: '45rem',
        //height: 'fit-content',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let centerCard = {
        display: "flex",
        flexDirection:"column",
        //justifyContent: "baseline",
        //marginLeft: 'auto',
        //marginRight: 'auto',
        width:"716px",
        height: "40.8px",
        textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };


  const handleRun = async (e) => {
    e.preventDefault();
    try {
      //console.log(document.querySelector(`.cm-editor`));
      //console.log(`1 codeSubmission: ${codeSubmission["script_submission"]}`);
      //console.log("Gate 1");
      //console.log(editorView.state.doc.toString());
      //console.log("Gate 2");
      setCodeSubmission({ ...codeSubmission, ["script_submission"]: editorView.state.doc.toString() });
      setNeed2Save(true);
      //console.log(`2 codeSubmission: ${codeSubmission["script_submission"]}`);
      //a
      //const inputField = document.getElementById("form"); 
      //inputField.reset(); // This resets the prompts so that the page doesn't have to be reloaded to create a new question
      //setData(data_default); // This resets the values for all of the prompts
      //console.log(data); // This 
      //setError(""); // This resets the error pop-up so it doesn't stick around and bother me
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
//a
  const handleSave = async () => {
    try {
      //console.log(document.querySelector(`.cm-editor`));
      //console.log(editorView.state.doc.toString());
      //console.log(codeSubmission);
      //console.log((url_submissionUpdate+codeSubmission._id+"/update"));
      await axios.post((url_submissionUpdate+codeSubmission['_id']+"/update"), {params: codeSubmission});
      setNeed2Save(false);
      //console.log(data);
      //const inputField = document.getElementById("form"); 
      //inputField.reset(); // This resets the prompts so that the page doesn't have to be reloaded to create a new question
      //setData(data_default); // This resets the values for all of the prompts
      //console.log(data); // This 
      //setError(""); // This resets the error pop-up so it doesn't stick around and bother me
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
  useEffect(() => {
    //console.log(codeSubmission["script_submission"]);
    if (needs2Save) {
      const result = handleSave();
      }
  }, [codeSubmission["script_submission"]]);
  
  useEffect(() => {
    //console.log(codeSubmission["script_submission"]);
    if (document.querySelector(`.cm-editor`)===null) {
      //console.log(`(Seeder) Is there an editor? ${document.querySelector(`.cm-editor`)!==null}`);
      //console.log(`(Seeder) Does editor's parent exist? ${document.getElementById("editor")!==null}`);
      setSeed((prev) => prev+1)
    }
  }, [codeSubmission.script_submission]);

  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
    
  }, []);
  useEffect(() => {
    //console.log(`Is there an editor? ${document.querySelector(`.cm-editor`)!==null}`);
    //console.log(`Does editor's parent exist? ${document.getElementById("editor")!==null}`);
    
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
  
  
  if (codeSubmission.script_submission===null) return (
    <>
        <div key={seed} style={{background: isLightMode ? '#5562be': "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading User Submission</h4></div>
    </>
    ) 
  else return (
    
      <section className="lesson" style={{background: isLightMode ? '#5562be': "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? '#5562be': "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? '#5562be': "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <Nav className="left" style={centerCard}>
                  <Button style={{justifyContent:"left"}}  variant="secondary" /* href="/lessons" */>Previous Lesson</Button>
                  <Button style={{justifyContent:"center",height:'37.6px'}}  disabled={true} ><p style={{fontSize:'75%', textAlign:'center', height:'50%', marginBottom:'0'}}>Ch {lesson_block_data.chapter_no} Lesson {lesson_block_data.order_within_chapter}:</p><p style={{fontSize:'75%', textAlign:'center', height:'50%'}}>{lesson_block_data.title}</p></Button>
                  {/* <Button style={{justifyContent:"center"}} title="Save Code" variant="success" onClick={handleSave} >Save Code</Button> */}
                  <Button style={{justifyContent:"center"}} title="Run Code" variant="success" onClick={handleRun}/* href="/lessons" */>Run Code</Button>
                  <Button style={{justifyContent:"right"}}  variant="secondary" /* href="/lessons" */>Next Lesson</Button>   
                </Nav>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div className="left" style={{width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"612px", width: '100%',backgroundColor: isLightMode? "#ffffff": "#000000",color: isLightMode? "#000000":"#ffffff"}} />
                </div>
              </div>
              <div className='box' style={rightCard}>
                <div id="Instructions" style={{color: isLightMode? "#a0316e": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#000000", width:"stretch", textAlign:'left', height:"50%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}} >{lesson_block_data["instructions"]}</div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",resize:"none", width:"stretch", height:"50%"}}>
                  {"Pretend this is a terminal that's spitting out results, I'll get it working later"}
                  {/* {false&&
                  <iframe src="" frameBorder={"0"} className="iframe">
                  </iframe>} */}
                </div>
              </div>
          </div>
        </div>
      </section>
  );
};

export default LessonTestPage;
