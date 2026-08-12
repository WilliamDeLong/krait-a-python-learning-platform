import React, { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';

//import downArrowDM from "../../images/DownArrow.png";
import checkMarkDM from "../../images/CheckMarkDM.png";
import checkMarkLM from "../../images/CheckMarkLM.png";
//import downArrowLM from "../../images/DownArrowDarkMode.png";

const url = `${API_BASE}/chapter/list`;
//const LessonDataurl = `${API_BASE}/lesson/findLesson`;
//const NextChapterURL = `${API_BASE}/chapter/findChapter`;



//const chapter_data_default = { title: null, description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};
//const Next_chapter_data_default = { title: "null", description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};




const ChapterSelect = () => {
  const [user, setUser] = useState(getUserInfo());
  //const [data, setData] = useState(dataDefault);
  //let {ChapterID} = useParams();
  //console.log(ChapterID);
  //console.log(useParams());
  //const [lessonID, setLesson] = useState(lessonDefault);
  const [data, setData] = useState([]);
  //const [NChapter, setNChap] = useState(Next_chapter_data_default);

  //const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();
  //const navigate = useNavigate();
  let rightList = {
        display: "flex",
        justifyContent: 'start',
        justifyItems: 'center',
        flexDirection:"column",
        //marginLeft: 'auto',
        //marginRight: 0,
        //width:"720px",
        height: 'fit-content',
        borderColor: isLightMode ? '#000000' : '#ffffff'
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
    

  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
    
  }, []);

  const fetch_data = async () => {
      try {
        //console.log(ChapterID);
        const result = await axios.get(url);
        //console.log(result.data);

        setData(result.data.sort((a, b) => (a.chapter_no - b.chapter_no)));
        //const LessonsRes = await axios.get(LessonDataurl, {params: {chapter_no: result.data['chapter_no']}});
        //setLessons(LessonsRes.data.sort((a, b) => (a.order_within_chapter - b.order_within_chapter)));
        
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
  const listItems = data.map(chapter =>
    <li key={chapter.chapter_no} style={{color:isLightMode ? '#000000': '#ffffff'}}>
      {user.admin&&<a href={`/chapterEditor/${chapter._id}`}><img
                  src={isLightMode ? (checkMarkLM) :  (checkMarkDM)}
                  alt={chapter.title}
                  style={{width: "30px",display:'inline-block'}}
                  /></a>}
      <p style={{display:'inline', marginLeft:"10px", }}>
        <a href={`/chapter/${chapter._id}`} style={{fontWeight:"bold",color:isLightMode ? '#000000': '#ffffff'}}><b>Chapter {chapter.chapter_no} - {chapter.title}</b> </a><br/>
      </p>
      <p style={{marginLeft:"40px"}}>{chapter.description}</p>
    </li>
  );
  
  if (data.title===null) return (
        <div><h4>Loading Chapter</h4></div>
    ) 
  else return (
    <>
      <section className="chapters" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div className="row d-flex" style={{color:isLightMode ? '#000000': '#ffffff', justifyContent:'center', textAlign:'center'}}>
            <h3>Chapter Select</h3>
            <h4 style={{fontSize:"100%"}}>Please select a chapter from the below list.</h4>
            
            <h5 style={{fontSize:"80%"}}>If a chapter is grayed out, that means you haven't completed the previous chapter.</h5>
          </div>
          <div className="bar" style={{height:"2px", backgroundColor:isLightMode ? '#000000': '#ffffff'}}/>
          
          <div className="row d-flex" style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
                <div className='box' style={rightBox}>
                  <ul style = {rightList}>
                    {listItems}
                  </ul>
                </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChapterSelect;
