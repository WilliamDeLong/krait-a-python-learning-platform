import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import axios from "axios";
import ReactNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import API_BASE from '../api';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useNavigate, useLocation } from "react-router-dom";
import "../css/box.css";


import logo from "../images/Logo.png";
import logo_dm from "../images/DarkModeLogo.png";

const url = `${API_BASE}/chapter/list`;

// Here, we display our Navbar
export default function Navbar({ isLightMode, toggleTheme }) {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();
  const [profileUrl, setProfileUrl] = useState("/user-icon.png");
  const [isProfileAreaHovered, setIsProfileAreaHovered] = useState(false);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  
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
  const fetch_data = async () => {
      try {
        //console.log(ChapterID);
        const result = await axios.get(url);
        //console.log(result.data);

        setData(result.data.sort((a, b) => (a.chapter_no - b.chapter_no)));
        //const LessonsRes = await axios.get(LessonDataurl, {params: {chapter_no: result.data['chapter_no']}});
        //setLessons(LessonsRes.data.sort((a, b) => (a.order_within_chapter - b.order_within_chapter)));
        console.log(result.data.sort((a, b) => (a.chapter_no - b.chapter_no)));
        //console.log((LessonsRes.data));
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
  setUser(getUserInfo())
  fetch_data();
  }, [])
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    navigate("/logout");
  };
  const chapters = data.map(chapter =>
    <Dropdown.Item key={chapter.chapter_no} href={"/chapter/"+chapter._id} style={{color:isLightMode ? '#000000': '#ffffff'}}>
      Chapter {chapter.chapter_no}: {chapter.title}
    </Dropdown.Item>
  );
  console.log(chapters);
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar style={{
        backgroundColor: isLightMode ? "#e2e8f0" : "#000000",
        padding: "0% 1.5625%",
        height: "10%"
      }} variant= "dark">
      <ReactNavbar.Brand style={{width:"10%",color: isLightMode ? "#0f172a" : "white"}} href="/">
          <img style={{width:"100%",display:'inline-block'}} alt='KRA.IT Logo' src={isLightMode ? logo : logo_dm}/></ReactNavbar.Brand>
      <Container >
        <Nav className="me-auto" style={{width:"50%"}}>
          <Dropdown as={ButtonGroup} style={{color: isLightMode ? "#0f172a" : "white"}}>
            <Button href="/chapters">Chapters</Button>

            <Dropdown.Toggle split  id="dropdown-split-basic" />
            <Dropdown.Menu style={{backgroundColor:isLightMode ? '#ffffff': '#000000'}}>
              {/* <Dropdown.Item href="/lessonTestpage/6a22e76fb403eec45b62da21">Section Zero: Basics</Dropdown.Item>
              <Dropdown.Item href="/chapter1">Section One: Functions</Dropdown.Item>
              <Dropdown.Item href="/chapter/6a270c143837df2cb279ae22">Section Two: tbd</Dropdown.Item> */}
              {chapters}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} style={{color: isLightMode ? "#0f172a" : "white"}}>
            <Button href="/documentation">Documentation</Button>

            <Dropdown.Toggle disabled split  id="dropdown-split-basic" />
            <Dropdown.Menu disabled style={{backgroundColor:isLightMode ? '#ffffff': '#000000'}}>
              {/* <Dropdown.Item href="/lessonTestpage/6a22e76fb403eec45b62da21">Section Zero: Basics</Dropdown.Item>
              <Dropdown.Item href="/chapter1">Section One: Functions</Dropdown.Item>
              <Dropdown.Item href="/chapter/6a270c143837df2cb279ae22">Section Two: tbd</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/lessonTestpage/6a19e16bd4abefc266f8ab0c">Lesson test page</Nav.Link>
          <Nav.Link style={{color: isLightMode ? "#0f172a" : "white"}} href="/editorthing">Editor Test</Nav.Link>
          
          
        </Nav>
        <div className="boxy" style={{width:"fit-content", display: "flex", flexFlow: "row wrap"}}>
          <Nav variant="pills" style={{width:"100%",marginLeft: 'auto', marginRight: '0',display:'flex',justifyContent: "flex-end"}}>
            <button onClick={toggleTheme} style={themeToggleStyle} title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"} aria-label={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}>
              {isLightMode ? (<><span style={{ ...themeLabelStyle, left: "10px" }}>LIGHT<br />MODE</span><span style={themeKnobStyle}>☀️</span></>) : (<><span style={themeKnobStyle}>🌙</span><span style={{ ...themeLabelStyle, right: "10px" }}>DARK<br />MODE</span></>)}
            </button>
            <div onClick={() => navigate("/profile")} onMouseEnter={() => setIsProfileAreaHovered(true)} onMouseLeave={() => setIsProfileAreaHovered(false)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transform: isProfileAreaHovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.2s ease", }}>
              {/* <img src={profileUrl} alt="Profile" onError={() => setProfileUrl("/user-icon.png")} style={{   width: "42px",   height: "42px",   borderRadius: "50%",   objectFit: "cover",   border: `2px solid ${isLightMode ? "#0f172a" : "white"}`, }}/> */}
              <span style={{backgroundColor: isLightMode ? '#000000': '#ffd903', color: isLightMode ? '#ffd903': '#000000',   fontWeight: "600",   textDecoration: isProfileAreaHovered ? "underline" : "none", order: "none", borderRadius: "999px", padding: "8px 16px", cursor: "pointer"}}> 
                {user.username}
                </span>
            </div>
            <button
              onClick={handleLogout}
              style={{backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontWeight: "600"}}>
              Log Out
            </button>
          </Nav>
        </div>
      </Container>
  </ReactNavbar>

  );
  
}