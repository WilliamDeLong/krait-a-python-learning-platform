import React, { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';
//import mongoose from "mongoose";


const url = `${API_BASE}/documentation/find/`;
//const LessonDataurl = `${API_BASE}/lesson/findLesson`;
//const NextChapterURL = `${API_BASE}/chapter/findChapter`;



//const chapter_data_default = { title: null, description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};
//const Next_chapter_data_default = { title: "null", description: '', chapter_no: 0, lessons: [], test_id: "", documentation_references: ""};




const DocumentationSelect = () => {
  const [user, setUser] = useState(getUserInfo());
  const [users, setUsers] = useState([]);

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
        flexDirection:"row",
		    flexWrap: 'wrap',
        paddingLeft: 0,
        //marginLeft: 'auto',
        //marginRight: 0,
        width:"1200px",
        height: '550px',

        borderColor: isLightMode ? '#000000' : '#ffffff'
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
    let rightBox = {
        display: "flex",
        justifyContent: 'center',
        marginTop: '0.5%',
        marginLeft: '20%',
        //marginRight: '25%',
        width:"60%",
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
      const author_data = await axios.get(`${API_BASE}/user/getAll`);
      //console.log(result.data);
      setData(result.data.sort((a, b) => (a.shortID - b.shortID)));
	  	//console.log(author_data.data[0]);
  		setUsers(author_data.data);
		  //console.log('testing search');
		  //console.log(users.find((element) => element._id === '6a18823fe3a22d37ce5b6b83').username);
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
  
  
  if (data.title===null && users.length<0) return (
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading Documents</h4></div>
    ) 
  else {
	const listItems = data.map(document =>
		<li key={document._id} style={{color:isLightMode ? '#000000': '#ffffff', border: "2px solid rgb(96 139 168)", width: '250px', marginLeft: '20px', height: '180px'}}>
		{/* <img
			src={isLightMode ? (document.is_test ? checkMarkLM : downArrowDM) :  (document.is_test ? checkMarkDM : downArrowLM)}
			alt={document.title}
			style={{width: "30px",display:'inline-block'}}/> */}
		<p style={{display:'inline'}}>
			<a href={`/document/${document._id}`} style={{fontWeight:"bold",color:isLightMode ? '#000000': '#ffffff'}}><b>Document {document.shortID} - {document.title}</b> </a><br/>
		</p>
		{users.length>1 &&<p style={{marginBottom:'0.5rem'}}>by {users.find((element) => element._id === document.author).username}</p>}
		{users.length<1&&<p>by {document.author}</p>}
		<p style={{wordWrap:'break-word',overflowWrap:'break-word',height:'40%',overflow:'hidden'}}>{document.description}</p>
		</li>
	);
	return (
    <>
      <section className="chapters" style={{background: isLightMode ? "#d8e6f5": "#14294c", height:"93.5vh"}}>
        <div className="container-fluid h-custom " style={{height:"90%", position: "absolute", background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}>
          <div className="row d-flex" style={{color:isLightMode ? '#000000': '#ffffff', justifyContent:'center', textAlign:'center'}}>
            <h3>Documentation</h3>
            <h4 style={{fontSize:"100%"}}>Please select a document from the below list.</h4>
            
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
  );}
};

export default DocumentationSelect;
