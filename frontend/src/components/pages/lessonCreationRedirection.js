import React, { useEffect, useContext,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
//import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../../App';
import API_BASE from '../../api.js';

const url_LessonData = `${API_BASE}/lesson/6a7c94cb93b5021d439c6888`;
const url_LessonCreate = `${API_BASE}/lesson/create/`;



const LessonCreationRedirection = () => {
  //const [user, setUser] = useState(getUserInfo());
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  let [lessonID, setLessonID] = useState("");
  let [lessonData, setLessonData] = useState({});
  let [lessonCreated, setCreation] = useState(false);

  //const { isLightMode } = useContext();/
  const navigate = useNavigate();
  console.log("Hello");

  useEffect(() => {
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
  }, []);
  const fetch_data = async () => {
      try {
        //console.log(lesson_block_data);
        const lessonResult = await axios.get(url_LessonData);
        setLessonData(lessonResult.data);
        console.log(lessonResult.data);
        //setSeed(seed+1);
        //console.log((lessonResult.data['order_within_chapter']));
        //console.log((lessonResult.data['order_within_chapter'])!=0);
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
	const set_data = async () => {
      try {
        //console.log(lesson_block_data);
        if (lessonData._id === `6a7c94cb93b5021d439c6888` && !lessonCreated) {
			console.log("Running create command");
			console.log(`url_LessonCreate, {params: ${lessonData}}`)
			console.log(lessonData);
			const lessonResult = await axios.post(url_LessonCreate, {params: lessonData});
			setLessonID(lessonResult.data._id);
			console.log(lessonResult);
			setCreation(true);
		}
        //setSeed(seed+1);
        //console.log((lessonResult.data['order_within_chapter']));
        //console.log((lessonResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(lessonResult.data);
        //console.log(`Lesson found`);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.log(error.response.data.message);
        }
      }
    };

  useEffect(() => {
	if (lessonID !== `6a7c94cb93b5021d439c6888`&&lessonID !== ""){
		//console.log(`../lessonCreator/${lessonID}`)
		navigate(`../lessonEditor/${lessonID}`);
	}
  }, [lessonID]);
   useEffect(() => {
	console.log("Attempting to create Lesson.");
	set_data();
  }, [lessonData]); 

  
  return (
	<>
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Redirecting</h4></div>
		<div style={{color: "#ff000000"}}>{error}</div>
	</>
	) 
};

export default LessonCreationRedirection;
