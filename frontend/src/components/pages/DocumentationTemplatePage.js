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



const document_data_default = { title: null, description: '', content: '', author: '', reference_list: [""]};
//const Next_document_data_default = { title: "null", description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};




const DocumentationTemplatePage = () => {
  const [user, setUser] = useState(getUserInfo());
  const [users, setUsers] = useState([]);
  //const [data, setData] = useState(dataDefault);
  let {DocumentID} = useParams();
  //console.log(DocumentID);
  //console.log(useParams());
  //const [lessonID, setLesson] = useState(lessonDefault);
  const [data, setData] = useState(document_data_default);

  //const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();
  //const navigate = useNavigate();
  
  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    axios.get(`${url}${DocumentID}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.message));
    axios.get(`${API_BASE}/user/getAll`)
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message));
    //fetch_data();
    console.log("Data Fetched");
    
  }, [DocumentID]);

  
  
  if (data.title===null || users.length<2) return (
        <div style={{height:'100vh', background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Document</h4></div>
    ) 
  else return (
    <>
    <div
      className="Documentation"
      style={{color: isLightMode? "#a0316e": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", width:"50%", marginLeft:'25%', scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
    </>
  );
};

export default DocumentationTemplatePage;
