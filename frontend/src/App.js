import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes, useLocation } from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import ProfilePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";

import LessonTestPage from "./components/pages/LessonTestPage";
import ChapterTemplatePage from "./components/pages/ChapterTemplatePage";
// import editorThing from "./components/pages/editorThing";

export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState();
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedTheme = sessionStorage.getItem("isLightMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const location = useLocation();

  useEffect(() => {
    setUser(getUserInfo());
  }, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem("isLightMode", JSON.stringify(isLightMode));
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
  };

  return (
    <>
      {user?.id && (
              <Navbar isLightMode={isLightMode} toggleTheme={toggleTheme} />
            )}
      <UserContext.Provider value={{ user, isLightMode, toggleTheme }}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/lessonTestpage/:lessonID" element={<LessonTestPage />} />
          <Route path="/chapter/:ChapterID" element={<ChapterTemplatePage />} />
          {/* <Route path="/editorthing" element={<editorThing />} /> */}
          
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
