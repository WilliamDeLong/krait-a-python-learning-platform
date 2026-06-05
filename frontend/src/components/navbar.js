import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import { useNavigate, useLocation } from "react-router-dom";


import logo from "../images/Logo.png";
import logo_dm from "../images/DarkModeLogo.png";



// Here, we display our Navbar
export default function Navbar({ isLightMode, toggleTheme }) {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({})
  
  const getNavLinkStyle = (path) => {
    const isActive = location.pathname === path;

    return {
      color: isLightMode ? "#0f172a" : "white",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: isActive ? "underline" : "none",
      textUnderlineOffset: "6px",
      textDecorationThickness: "2px",
      transition: "transform 0.18s ease, text-decoration-color 0.18s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    };
  };
  const themeToggleStyle = {
    position: "relative",
    width: "122px",
    height: "42px",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    overflow: "hidden",
    padding: 0,
    background: isLightMode
      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
      : "linear-gradient(90deg, #2563eb, #1d4ed8)",
    boxShadow: "inset 0 1px 3px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.18)",
    transition: "all 0.25s ease",
  };
  const themeKnobStyle = {
    position: "absolute",
    top: "4px",
    left: isLightMode ? "84px" : "4px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    transition: "all 0.25s ease",
  };

  const themeLabelStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: "white",
    fontWeight: "700",
    fontSize: "0.76rem",
    letterSpacing: "0.4px",
    lineHeight: 1.05,
    textAlign: "center",
    pointerEvents: "none",
  };

  useEffect(() => {
  setUser(getUserInfo())
  
  }, [])
  
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar style={{
        backgroundColor: isLightMode ? "#e2e8f0" : "#000000",
        padding: "12px 24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }} variant="dark">
      <img style={{width:"10%",display:'inline-block'}} alt='KRA.IT Logo' src={isLightMode ? logo : logo_dm}/>
      <Container >
        <Nav className="me-auto">
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/">Start</Nav.Link>
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/home">Home</Nav.Link>
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/lessonTestpage">Lesson</Nav.Link>

        </Nav>
        <button
            onClick={toggleTheme}
            style={themeToggleStyle}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {isLightMode ? (
              <>
                <span style={{ ...themeLabelStyle, left: "10px" }}>
                  LIGHT
                  <br />
                  MODE
                </span>
                <span style={themeKnobStyle}>☀️</span>
              </>
            ) : (
              <>
                <span style={themeKnobStyle}>🌙</span>
                <span style={{ ...themeLabelStyle, right: "10px" }}>
                  DARK
                  <br />
                  MODE
                </span>
              </>
            )}
          </button>
      </Container>
  </ReactNavbar>

  );
  
}