import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import API_BASE from '../../api';
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from '../../App';

const PRIMARY_COLOR = "#f18900";
const SECONDARY_COLOR = '#0c0c1f'
const url = `${API_BASE}/question/create`;
const data_default = { question: "", correct_answer: "", incorrect_answer1: "", incorrect_answer2: "", incorrect_answer3: "", category: "any", difficulty: 'any'};

const LessonTestPage = () => {
  const [user, setUser] = useState({})
  const [data, setData] = useState(data_default);
  const [error, setError] = useState("");
  const [isLightMode, setLightM] = useState(false);
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  //const { isLightMode } = useContext();
  const [bgText, setBgText] = useState('Light Mode')
  const navigate = useNavigate();

  let TextyStyling = {
    color: isLightMode? "#0c0c0c": "#ffe5f3",
    //fontWeight: "lighter",
  };
 
  let labelStyling = {
    color: isLightMode? "#7b0445": "#f18900",
    fontWeight: "bold",
    textDecoration: "none",
  };
  let backgroundStyling = { background: bgColor};
  let buttonStyling = {
    background: isLightMode? "#7b0445": "#f18900",
    borderStyle: "none",
    color: bgColor,
  };

  const handleChange = ({ currentTarget: input }) => {
    //console.log(input.name);
    console.log(input.name+":",input.value);
    //const ques = newQuestionModel.findOne({ question: input.value });
    //console.log(ques);
    
    
    setData({ ...data, [input.name]: input.value });
    //console.log(data);
  };

  useEffect(() => {
    setUser(getUserInfo());
    //console.log(isLightMode);
    if (isLightMode) {
      setBgColor("white");
      setBgText('Dark mode')
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText('Light mode')
    }
    //console.log(progressShuffler);
    
  }, [light]);
  //const { username } = user;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log(data);
      //console.log(e.target.id);
      await axios.post(url, data);
      //console.log(data);
      const inputField = document.getElementById("form"); 
      inputField.reset(); // This resets the prompts so that the page doesn't have to be reloaded to create a new question
      setData(data_default); // This resets the values for all of the prompts
      //console.log(data); // This 
      setError(""); // This resets the error pop-up so it doesn't stick around and bother me
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

  /*if (!user) return (
        <div><h4>Log in to view this page.</h4></div>
    ) 
  else */return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div
            className="row d-flex h-100"
            style={{background: isLightMode ? "linear-gradient(135deg, #f8fafc, #dbeafe, #ede9fe)": "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)",
                        color: !isLightMode? "#000000": "#ffffff"}}>
            <table>
                  <tbody>
                    <tr>
                      <td width="50%" height={"100%"}>
                        <textarea name="ide" id="fine, you can have an id" onChange={handleChange} style={{color: isLightMode? "#a0316e": "#ff2f00",Width:"100%",height:"100%",backgroundColor:"#000000",overflowY:"scroll"}} defaultValue={"This is the correct answer to the question, there will only be one correct answer."} rows={25} cols={101}/>
                      </td>
                      <td className="alignRight" width="50%">
                        <tr>
                          <textarea id="you too I guess" style={{color: isLightMode? "#a0316e": "#ff2f00", width:"100%"}} defaultValue={"This is the correct answer to the question, there will only be one correct answer."} cols={101} rows={15} contentEditable={false}/>
                          </tr>
                        <tr>
                            <textarea id="and you." style={{color: isLightMode? "#a0316e": "#ff2f00",Width:"100%"}} defaultValue={"This is the correct answer to the question, there will only be one correct answer."} cols={101} rows={10} contentEditable={false}/>
                            </tr>
                      </td>
                    </tr>
                </tbody>
                </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default LessonTestPage;
