import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';

import downArrowDM from "../../images/DownArrow.png";
import checkMarkDM from "../../images/CheckMarkDM.png";
import checkMarkLM from "../../images/CheckMarkLM.png";
import downArrowLM from "../../images/DownArrowDarkMode.png";

const url = `${API_BASE}/documentation/`;
//const LessonDataurl = `${API_BASE}/lesson/findLesson`;
//const NextChapterURL = `${API_BASE}/chapter/findChapter`;



const chapter_data_default = { title: null, description: '', content: '', author: '', reference_list: [""]};
//const Next_chapter_data_default = { title: "null", description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};




const DocumentationTemplatePage = () => {
  const [user, setUser] = useState(getUserInfo());
  const [users, setUsers] = useState([]);
  //const [data, setData] = useState(dataDefault);
  let {DocumentID} = useParams();
  //console.log(DocumentID);
  //console.log(useParams());
  //const [lessonID, setLesson] = useState(lessonDefault);
  const [data, setData] = useState(chapter_data_default);

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
        height: '550px',
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
        //console.log(DocumentID);
        const result = await axios.get(url+DocumentID);
        //console.log(result.data);
        setData(result.data);
        const author_data = await axios.get(`${API_BASE}/user/getAll`);
        setUsers(author_data.data);
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
  
  if (data.title===null || users.length<2) return (
        <div style={{height:'100vh', background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Chapter</h4></div>
    ) 
  else return (
    <>
      <section className="lesson" style={{height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", color: !isLightMode? "#000000": "#ffffff"}}>
          <div className="row d-flex" style={{color:isLightMode ? '#000000': '#ffffff', justifyContent:'center', textAlign:'center'}}>
            <h3>{data.title}</h3>
            <h4>Written by {users.find((element) => element._id === data.author).username}</h4>
            <h5 style={{width:'50%', fontSize:"100%"}}>{data.description}</h5>
          </div>
          <div className="bar" style={{height:"2px", backgroundColor:isLightMode ? '#000000': '#ffffff'}}/>

          <div className="Main-content" style={{color: !isLightMode? "#ffffff": "#000000"}}>
                {data.content}
          </div>
        </div>
      </section>
    </>
  );
};

export default DocumentationTemplatePage;
