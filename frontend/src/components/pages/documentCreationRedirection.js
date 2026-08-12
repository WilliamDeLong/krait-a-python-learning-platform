import React, { useEffect, useContext,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
//import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../../App';
import API_BASE from '../../api.js';

const url_DocumentData = `${API_BASE}/documentation/6a7cbf52470d8ae3c5f46758`;
const url_DocumentCreate = `${API_BASE}/documentation/make/`;



const DocumentCreationRedirection = () => {
  //const [user, setUser] = useState(getUserInfo());
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  let [documentID, setDocumentID] = useState("");
  let [documentData, setDocumentData] = useState({});
  let [documentCreated, setCreation] = useState(false);

  //const { isLightMode } = useContext();/
  const navigate = useNavigate();
  //console.log("Hello");

  useEffect(() => {
    //console.log(isLightMode);
    fetch_data();
    console.log("Data Fetched");
  }, []);
  const fetch_data = async () => {
      try {
        console.log(url_DocumentData);
        var documentResult = await axios.get(url_DocumentData);
        documentResult.data.title = "New Document";
        console.log(documentResult.data);
        setDocumentData(documentResult.data);
        
        //setSeed(seed+1);
        //console.log((documentResult.data['order_within_chapter']));
        //console.log((documentResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(documentResult.data);
        //console.log(`Document found`);
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
        //console.log(document_block_data);
        if (documentData._id === `6a7cbf52470d8ae3c5f46758` && !documentCreated) {
			//console.log("Running create command");
			//console.log(`url_DocumentCreate, {params: ${documentData}}`)
			//console.log(documentData);
			const documentResult = await axios.post(url_DocumentCreate, {params: documentData});
			setDocumentID(documentResult.data._id);
			//console.log(documentResult);
			setCreation(true);
		}
        //setSeed(seed+1);
        //console.log((documentResult.data['order_within_chapter']));
        //console.log((documentResult.data['order_within_chapter'])!=0);
        //console.log(result);
        //console.log(documentResult.data);
        //console.log(`Document found`);
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
	if (documentID !== `6a7cbf52470d8ae3c5f46758`&&documentID !== ""){
		//console.log(`../documentCreator/${documentID}`)
		navigate(`../documentEditor/${documentID}`);
	}
  }, [documentID]);
   useEffect(() => {
    //setDocumentData({ ...documentData, title: "New Document" });
  	console.log("Attempting to create Document.");
	  set_data();
  }, [documentData]); 

  
  return (
	<>
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Creating Document</h4></div>
		<div style={{color: "#ff000000"}}>{error}</div>
	</>
	) 
};

export default DocumentCreationRedirection;
