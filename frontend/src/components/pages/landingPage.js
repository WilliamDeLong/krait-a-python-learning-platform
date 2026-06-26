import React, { useContext, useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import "../../css/h3.css";
import "../../css/box.css";
import logo from "../../images/Logo.png";
import logo_dm from "../../images/DarkModeLogo.png";
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from "../../App";


const Landingpage = () => {
const [user, setUser] = useState(getUserInfo());
  const { isLightMode } = useContext(UserContext);
    let rightCard = {
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: 'auto',
        marginRight: 0,
        width: '30rem',
        textAlign: 'center',
        backgroundColor: isLightMode ? '#ffffff' : '#000000'
    }
    let leftCard = {
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: '50px',
        width: '30rem',
        textAlign: 'center',
        backgroundColor: isLightMode ? '#ffffff' : '#000000'
    }
    
    
    return (
        <div style={{maxHeight: '200%', minHeight: '200%', height:(user?.id ? '93.5vh' : '100vh'), background: isLightMode ? "#d8e6f5" : '#14294c'}}>
            <div className='box' style={{padding: '3rem'}}>
                <Card style={leftCard}>
                    <Card.Body style={{color: isLightMode ? "#0f172a" : "#cccccc"}}>
                        <Card.Title style={{fontWeight: 'bold'}}>Welcome to<br/><img style={{width:"50%",display:'inline-block'}} alt='KRA.IT Logo' src={isLightMode ? logo : logo_dm}/></Card.Title>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>Our goal here at KRA.IT is to provide a fun and interactive way of learning Python that can then be applied to every day scenarios to complete menial tasks efficiently. </Card.Text>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>From learning how to print Hi 10^999 times to making Oregon Trail, we provide a wide range of lessons and projects to suit your tastes.</Card.Text>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>While prior coding knowledge is helpful, it is not required. The only requirement is an open mind ready to learn!</Card.Text>
                    </Card.Body>
                    
                </Card>
                
                {!user&&<Card style={rightCard} className="right" >
                    <Card.Body style={{color: isLightMode ? "#0f172a" : "#cccccc"}}>
                        <Card.Title style={{ fontWeight: 'bold'}}>If you have an account:</Card.Title>
                        <a href="/login" style={{ color: '#ffd903', backgroundColor: isLightMode ? '#000000' : '#5562be', borderRadius: "6px", fontWeight: "bold", width: '90%', height: '35px', display: 'inline-block', alignContent: 'center' }}> Log(in) </a>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>You are only able to log in if you have an account already.</Card.Text>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>These buttons are functionally identical to the two in the navigation bar.</Card.Text>
                        <h3 style={{'fontSize':'small'}}>or</h3>
                        <Card.Title style={{fontWeight: 'bold'}}>If you don't have an account:</Card.Title>
                        <a href="/signup" style={{ backgroundColor: '#ffd903', color: isLightMode ? '#000000': '#5562be', borderRadius: "6px", fontWeight: "bold", width: '90%', height: '35px', display: 'inline-block', alignContent: 'center' }}> Sign Up </a>
                        
                    </Card.Body>
                </Card>}
                {user&&<Card style={rightCard} className="right" >
                    <Card.Body style={{color: isLightMode ? "#0f172a" : "#cccccc"}}>
                        <Card.Title style={{ fontWeight: 'bold'}}>Are you new to Python and/or Programming?</Card.Title>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>Then start here!</Card.Text>
                        <a disabled /* href="/login" */ style={{ color: '#ffd903', backgroundColor: isLightMode ? '#000000' : '#5562be', borderRadius: "6px", fontWeight: "bold", width: '90%', height: '35px', display: 'inline-block', alignContent: 'center' }}> Section Zero: Python Fundamentals </a>
                        
                        <h3 style={{'fontSize':'small'}}>or</h3>
                        <Card.Title style={{fontWeight: 'bold'}}>If you do know the fundamentals</Card.Title>
                        <Card.Text style={{color: isLightMode ? "#0f172a" : "#cccccc", 'fontSize': 'small', fontWeight:'normal'}}>Feel free to start with Section One:</Card.Text>
                        <a disabled /* href="/signup" */ style={{ backgroundColor: '#ffd903', color: isLightMode ? '#000000': '#5562be', borderRadius: "6px", fontWeight: "bold", width: '90%', height: '35px', display: 'inline-block', alignContent: 'center' }}> Section Two: Functions </a>
                        
                    </Card.Body>
                </Card>}
            </div>
        </div>
    )
}

export default Landingpage;
