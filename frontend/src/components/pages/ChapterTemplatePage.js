import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';

import downArrowDM from "../../images/DownArrow.png";
import checkMarkDM from "../../images/CheckMarkDM.png";
import checkMarkLM from "../../images/CheckMarkLM.png";
import downArrowLM from "../../images/DownArrowDarkMode.png";

const url = `${API_BASE}/chapter/`;
const LessonDataurl = `${API_BASE}/lesson/findLesson`;


const chapter_data_default = { title: null, description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};



const ChapterTemplatePage = () => {
  const [user, setUser] = useState(getUserInfo());
  //const [data, setData] = useState(dataDefault);
  let {ChapterID} = useParams();
  //console.log(ChapterID);
  //console.log(useParams());
  //const [lessonID, setLesson] = useState(lessonDefault);
  const [data, setData] = useState(chapter_data_default);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();
  const navigate = useNavigate();
  let rightCard = {
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: 'auto',
        marginRight: 0,
        width: '30rem',
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let leftCard = {
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: 0,
        //marginRight: '50px',
        width: '45rem',
        height: '656px',
        textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let centerCard = {
        display: "flex",
        justifyContent: "center",
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '45rem',
        textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };

  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
    
  }, []);

  const fetch_data = async () => {
      try {
        //console.log(ChapterID);
        const result = await axios.get(url+ChapterID);
        //console.log(result.data);
        setData(result.data);
        const LessonsRes = await axios.get(LessonDataurl, {params: {chapter_no: result.data['chapter_no']}});
        setLessons(LessonsRes.data.sort((a, b) => (a.order_within_chapter - b.order_within_chapter)));

        //console.log((LessonsRes.data));
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
  const listItems = lessons.map(lesson =>
    <li key={lesson.order_within_chapter}>
      <img
        src={isLightMode ? (lesson.is_test ? checkMarkLM : downArrowLM) :  (lesson.is_test ? checkMarkDM : downArrowDM)}
        alt={lesson.title}
        style={{width: "30px",display:'inline-block'}}/>
      <p style={{display:'inline', marginLeft:"10px"}}>
        
        <a href={`/lessonTestpage/${lesson._id}`} style={{fontWeight:"bold", color:"black"}}>{lesson.title}</a><b>: </b> 
        {lesson.description}
      </p>
    </li>
  );
  
  if (data.title===null) return (
        <div><h4>Loading Chapter</h4></div>
    ) 
  else return (
    <>
      <section className="vh-90">
        <div className="container-fluid h-custom vh-90">
          <div
            className="row d-flex h-100"
            style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)",
                        color: !isLightMode? "#000000": "#ffffff"}}>
            <div className='box vh-90'>
                <div className='box' style={leftCard}>
                  <Nav style={centerCard}>
                      <Button variant="success" /* href="/lessons" */>Previous Lesson</Button>
                      <Button variant="success" /*onClick={handleSubmit} href="/lessons" */>Run Code</Button>
                      <Button variant="success" /* href="/lessons" */>Next Lesson</Button>
                      
                    </Nav>
                  <div>
                    <textarea name="Code_Editor" id="script_submission" style={{color: isLightMode? "#a0316e": "#ff2f00",backgroundColor:"#000000",overflowY:"scroll", resize:"none", width:"716px"}} defaultValue={"codeSubmission['script_submission']"} rows={25} cols={101}/>
                    </div>
                </div>
                <div className='box' style={rightCard}>
                  <ul>
                    {listItems}
                  </ul>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChapterTemplatePage;
