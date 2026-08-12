import React, { useEffect, useContext,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
//import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../../App';
import API_BASE from '../../api.js';

const url_ChapterData = `${API_BASE}/chapter/find/6a514290bbb150f63e042595`;
const url_ChapterCreate = `${API_BASE}/chapter/create/`;



const ChapterCreationRedirection = () => {
  //const [user, setUser] = useState(getUserInfo());
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  let [chapterID, setChapterID] = useState("");
  let [chapterData, setChapterData] = useState({});
  let [chapterCreated, setCreation] = useState(false);

  //const { isLightMode } = useContext();/
  const navigate = useNavigate();
  //console.log("Hello");

  useEffect(() => {
    //console.log(isLightMode);
    fetch_data();
    //console.log("Data Fetched");
  }, []);
  const fetch_data = async () => {
      try {
        //console.log(url_ChapterData);
        var chapterResult = await axios.get(url_ChapterData);
        chapterResult.data.title = "New Chapter";
        chapterResult.data.description = "Insert your chapter description here.";
        chapterResult.data.lessons = [];
        chapterResult.data.test_id = null;
        chapterResult.data.chapter_no = -1;
        //console.log(chapterResult.data);
        setChapterData(chapterResult.data);
        
        //setSeed(seed+1);
        //console.log((chapterResult.data['order_within_chapter']));
        //console.log((chapterResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(chapterResult.data);
        //console.log(`Chapter found`);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.log(error.response.data.message);
          setError(error.response.data.message);
        }
      }
    };
	const set_data = async () => {
      try {
        //console.log(chapter_block_data);
        if (chapterData._id === `6a514290bbb150f63e042595` && !chapterCreated) {
        //console.log("Running create command");
        //console.log(`url_ChapterCreate, {params: ${chapterData}}`)
        //console.log(chapterData);
        const chapterResult = await axios.post(url_ChapterCreate, {params: chapterData});
        setChapterID(chapterResult.data._id);
        //console.log(chapterResult);
        setCreation(true);
      }
        //setSeed(seed+1);
        //console.log((chapterResult.data['order_within_chapter']));
        //console.log((chapterResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(chapterResult.data);
        //console.log(`Chapter found`);
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
	if (chapterID !== `6a514290bbb150f63e042595`&&chapterID !== ""){
		//console.log(`../chapterCreator/${chapterID}`)
		navigate(`../chapterEditor/${chapterID}`);
	}
  }, [chapterID]);
   useEffect(() => {
    //setChapterData({ ...chapterData, title: "New Chapter" });
  	console.log("Attempting to create Chapter.");
	  set_data();
  }, [chapterData]); 

  
  return (
	<>
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Creating Chapter</h4></div>
		<div style={{color: "#ff000000"}}>{error}</div>
	</>
	) 
};

export default ChapterCreationRedirection;
