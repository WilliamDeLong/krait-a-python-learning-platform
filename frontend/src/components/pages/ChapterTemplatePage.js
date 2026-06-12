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
        height: '656px',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let rightBox = {
        display: "flex",
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        marginRight: '20%',
        width:"460px",
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
          <div
            className="row d-flex"
            style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)", color: !isLightMode? "#000000": "#ffffff"}}>
              <div className='box' style={leftCard}>
                <Nav className="left" style={centerCard}>
                  <Button style={{justifyContent:"left"}}  variant="secondary" /* href="/lessons" */>Previous Lesson</Button>
                  <Button style={{justifyContent:"center"}}  disabled >Ch 0 Lesson 0: title</Button>
                  <Button style={{justifyContent:"center"}}  variant="success"/* href="/lessons" */>Run Code</Button>
                  <Button style={{justifyContent:"right"}}  variant="secondary" /* href="/lessons" */>Next Lesson</Button>   
                </Nav>
                <div className="bar" style={{height:"2px", width:"90%",marginLeft:"5%",display:'flex', justifyContent:"center", backgroundColor:'rgb(96 139 168)'}}/>
                <div className="left" style={{width:'stretch'}}>
                  <div className="editor" id="script_submission" style={{color: isLightMode? "#a0316e": "#ff2f00",backgroundColor:"#000000",overflowY:"scroll",overflowWrap: "anywhere",resize:"none", borderRadius: "5px", height:"612px", fontSize:"1rem", inlineSize: 'fit-content', minWidth: '100%', width: 'stretch'}}>
                    Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.
                    There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.

                  </div>
                </div>
              </div>
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
