import React, { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
//import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import getUserInfo from "../utilities/decodeJwt";
import { UserContext } from '../App';


const LoggedOutRedirect = () => {
  const [user, setUser] = useState(getUserInfo());
  const [error, setError] = useState("");
  const { isLightMode } = useContext(UserContext);
  //const { isLightMode } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    navigate("/");
  }, []);
  const Logout = (e) => {
    e.preventDefault();
    //localStorage.removeItem("accessToken");
    navigate("/");
  };
  
  return (
        <div><h4>Logging Out</h4></div>
    ) 
};

export default LoggedOutRedirect;
