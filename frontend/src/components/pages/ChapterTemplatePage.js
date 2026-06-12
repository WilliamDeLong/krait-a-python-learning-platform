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

const url = `${API_BASE}/chapter/find/`;
const LessonDataurl = `${API_BASE}/lesson/findLesson`;
const NextChapterURL = `${API_BASE}/chapter/findChapter`;



const chapter_data_default = { title: null, description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};
const Next_chapter_data_default = { title: "null", description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};




const ChapterTemplatePage = () => {
  const [user, setUser] = useState(getUserInfo());
  //const [data, setData] = useState(dataDefault);
  let {ChapterID} = useParams();
  //console.log(ChapterID);
  //console.log(useParams());
  //const [lessonID, setLesson] = useState(lessonDefault);
  const [data, setData] = useState(chapter_data_default);
  const [NChapter, setNChap] = useState(Next_chapter_data_default);

  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();
  const navigate = useNavigate();
  let rightList = {
        display: "flex",
        justifyContent: 'start',
        justifyItems: 'center',
        flexDirection:"column",
        //marginLeft: 'auto',
        //marginRight: 0,
        //width:"720px",
        height: '550px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let rightBox = {
        display: "flex",
        justifyContent: 'center',
        marginTop: '0.5%',
        marginLeft: '33%',
        //marginRight: '25%',
        width:"33%",
        height: '550px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let leftCard = {
        display: "flex",
        //flexDirection:'column',
        justifyContent: "flex-start",
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
        try {
        var ChapterRes = await axios.get(NextChapterURL, {params: {chapter_no: (result.data['chapter_no']+1)}});
        console.log(ChapterRes.data);
        setNChap(ChapterRes.data[0]);
        } catch (error) {
          console.log(!(error.response && error.response.status >= 400 && error.response.status <= 500));
          if (
            (error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500)
          ) {
            setError(error.response.data.message);
          }
        }
        
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
    <li key={lesson.order_within_chapter} style={{color:isLightMode ? '#000000': '#ffffff'}}>
      <img
        src={isLightMode ? (lesson.is_test ? checkMarkLM : downArrowDM) :  (lesson.is_test ? checkMarkDM : downArrowLM)}
        alt={lesson.title}
        style={{width: "30px",display:'inline-block'}}/>
      <p style={{display:'inline', marginLeft:"10px", }}>
        <a href={`/lessonTestpage/${lesson._id}`} style={{fontWeight:"bold",color:isLightMode ? '#000000': '#ffffff'}}><b>Lesson {lesson.order_within_chapter} - {lesson.title}</b> </a><br/>
      </p>
      <p style={{marginLeft:"40px"}}>{lesson.description}</p>
    </li>
  );
  
  if (data.title===null) return (
        <div><h4>Loading Chapter</h4></div>
    ) 
  else return (
    <>
      <section className="lesson" style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", color: !isLightMode? "#000000": "#ffffff"}}>
          <div className="row d-flex" style={{color:isLightMode ? '#000000': '#ffffff', justifyContent:'center', textAlign:'center'}}>
            <h4>Section {data.chapter_no}</h4>
            <h3>{data.title}</h3>
            <h5 style={{width:'50%', fontSize:"100%"}}>{data.description}</h5>
          </div>
          <div className="bar" style={{height:"2px", backgroundColor:'rgb(255, 255, 255)'}}/>
          
          <div className="row d-flex" style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", color: !isLightMode? "#000000": "#ffffff"}}>
                <div className='box' style={rightBox}>
                  <ul style = {rightList}>
                    {listItems}
                    <li key="NextChapter" style={{color:isLightMode ? '#000000': '#ffffff'}}>
                      <a href={`/chapter/${NChapter._id}`} disabled style={{fontWeight:"bold",color:isLightMode ? '#000000': '#ffffff'}}>
                      <img
                      src={isLightMode ? downArrowDM :  downArrowLM}
                      alt={NChapter.title}
                      style={{width: "30px",display:'inline-block'}}/>
                      <p style={{display:'inline', marginLeft:"10px"}}>
                        <b>Chapter {NChapter.chapter_no} - {NChapter.title}</b><br/>
                      </p>
                      <p style={{marginLeft:"40px"}}>{NChapter.description}</p>
                      </a>
                    </li>
                  </ul>
                </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChapterTemplatePage;
