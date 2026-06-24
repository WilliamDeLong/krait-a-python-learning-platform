import React, { useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
//import Button from "react-bootstrap/Button";
//import Nav from 'react-bootstrap/Nav';
//import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../App';


const LoggedOutRedirect = () => {
  //const [user, setUser] = useState(getUserInfo());
  //const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();/
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  });
  
  return (
        <div style={{background: isLightMode ? '#5562be': "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Logging Out</h4></div>
    ) 
};

export default LoggedOutRedirect;
