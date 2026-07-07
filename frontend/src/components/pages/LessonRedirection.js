import React, { useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
//import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../../App';


const LessonRedirectPage = () => {
  //const [user, setUser] = useState(getUserInfo());
  //const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  let {lessonID} = useParams();
  //const { isLightMode } = useContext();/
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/lessonTestpage/${lessonID}`);
  });
  
  return (
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Redirecting</h4></div>
    ) 
};

export default LessonRedirectPage;
