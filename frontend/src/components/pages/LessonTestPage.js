import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';
//import CodeEditor from "../CodeEditor";
//import { useRef } from "react";


const url_submissionUpdate = `${API_BASE}/submissions/`;
const url_submissionLoad = `${API_BASE}/submissions/findSubmission`;
const url_submissionCreate = `${API_BASE}/submissions/create`;
const url_LessonData = `${API_BASE}/lesson/`;


const lessonDefault = {lessonID: "6a19e16bd4abefc266f8ab0c"};
const lesson_block_data_default = { default_script: "", solution_verification: '', instructions: "", title: ''};
const codeSubmission_default = {"_id": null, script_submission: null, userID: "null", lessonID: "null", success: false, submission_date: null};


const LessonTestPage = () => {
  const [user, setUser] = useState(getUserInfo());
  //const [data, setData] = useState(dataDefault);
  let {lessonID} = useParams();
  //console.log(lessonID);
  //const [lessonID, setLesson] = useState(lessonDefault);
  
  const [lesson_block_data, setlesson_block_data] = useState(lesson_block_data_default);
  const [codeSubmission, setCodeSubmission] = useState(codeSubmission_default);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const inputRef = useRef(null);
  //input.addEventListener("change", updateValue);

  

  //const { isLightMode } = useContext();
  const navigate = useNavigate();
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
    let replaceBox2 = {width: '100%',  
      display: 'flex',
      flexFlow: 'row wrap'}



  const handleChange = ({ currentTarget: input }) => {
    console.log(input.name);
    console.log(`Code Box:`,input.value);
    console.log(codeSubmission);
    //const ques = newQuestionModel.findOne({ question: input.value });
    //console.log(ques);
    setCodeSubmission({ ...codeSubmission, ["script_submission"]: input.value });
    //console.log(lesson_block_data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(codeSubmission);
      console.log((url_submissionUpdate+codeSubmission._id+"/update"));
      await axios.post((url_submissionUpdate+codeSubmission['_id']+"/update"), {params: codeSubmission});
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
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
    
  }, [seed]);

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
        <div key={seed}><h4>Loading User Submission</h4></div>
    </>
    ) 
  else return (
    
      <section className="lesson" style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", color: !isLightMode? "#000000": "#ffffff"}}>
          <div
            className="row d-flex"
            style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <Nav className="left" style={centerCard}>
                  <Button style={{justifyContent:"left"}}  variant="secondary" /* href="/lessons" */>Previous Lesson</Button>
                  <Button style={{justifyContent:"center"}}  disabled >Ch {lesson_block_data.chapter_no} Lesson {lesson_block_data.order_within_chapter}: {lesson_block_data.title}</Button>
                  <Button style={{justifyContent:"center"}}  variant="success" onClick={handleSubmit}/* href="/lessons" */>Run Code</Button>
                  <Button style={{justifyContent:"right"}}  variant="secondary" /* href="/lessons" */>Next Lesson</Button>   
                </Nav>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div className="left" style={{width:'stretch'}}>
                  <div className="editor" id="script_submission" onChange={handleChange} style={{color: isLightMode? "#a0316e": "#ff2f00",backgroundColor:"#000000",overflowY:"auto",overflowWrap: "anywhere",resize:"none", borderRadius: "5px", height:"612px", fontSize:"1rem", inlineSize: 'fit-content', minWidth: '100%', width: 'stretch'}} defaultValue={codeSubmission['script_submission']} contentEditable="plaintext-only">
                    {codeSubmission['script_submission']}
                  </div>
                </div>
              </div>
              <div className='box' style={rightCard}>
                <div id="Instructions" style={{color: isLightMode? "#a0316e": "#ff2f00",backgroundColor: isLightMode? "#ffffff": "#000000", width:"stretch", textAlign:'left', height:"50%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}} >{lesson_block_data["instructions"]}</div>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div id="terminal" style={{color: "#008a00",backgroundColor:"#000000",height:"100%", resize:"none", width:"stretch", height:"50%"}}>
                  {"Pretend this is a terminal that's spitting out results, I'll get it working later"}
                  {false&&
                  <iframe src="" frameBorder={"0"} className="iframe">
                  </iframe>}
                </div>
              </div>
          </div>
        </div>
      </section>
  );
};

export default LessonTestPage;
