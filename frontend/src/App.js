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
import ChapterSelect from "./components/pages/ChapterSelectPage";
//import ExperimentEditor from "./components/pages/EditorTestPage";
import LoggedOutRedirect from "./components/logOutPage";
import DocumentationSelect from "./components/pages/documentationSelectionPage";

import { createEditorState, createEditorView } from "./components/editor";

export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState();
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedTheme = sessionStorage.getItem("isLightMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [editorView, setEditorView] = useState();
  const location = useLocation();

  useEffect(() => {
    setUser(getUserInfo());
  }, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem("isLightMode", JSON.stringify(isLightMode));
  }, [isLightMode]);

  const toggleTheme = () => {
    //console.log(`lightmode current ${isLightMode}`);
    setIsLightMode((prev) => !prev);
    //console.log(`lightmode now ${isLightMode}`);
    if (document.querySelector(`.cm-editor`)!==null) {
      //console.log("Reload current editor.");
      //console.log(`is onedark ${!isLightMode}`)
      const updatedState = createEditorState(editorView.state.doc.toString(), {oneDark: isLightMode,});
      editorView.setState(updatedState);
      setEditorView(editorView);
    }
  };
  function createEditor(loadedCode="Placeholder") {
    //console.log("Attempting to make editor");
    if (document.querySelector(`.cm-editor`)===null) {
      var editorView2 = (createEditorView(undefined, document.getElementById("editor")));
      const initialState = createEditorState(loadedCode, {oneDark: !isLightMode,});
      editorView2.setState(initialState);
      setEditorView(editorView2);
      //console.log("Loading Editor");
      //console.log(editorView2.state.doc.toString());
    }
  };
  

  return (
    <>
      {user?.id && (
              <Navbar isLightMode={isLightMode} toggleTheme={toggleTheme} />
            )}
      <UserContext.Provider value={{ user, isLightMode, toggleTheme, editorView, createEditor}}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/lessonTestpage/:lessonID" element={<LessonTestPage />} />
          <Route path="/chapter/:ChapterID" element={<ChapterTemplatePage />} />
          {/* <Route path="/editorthing" element={<ExperimentEditor />} /> */}
          <Route path="/chapters" element={<ChapterSelect />} />
          <Route path="/logout" element={<LoggedOutRedirect />} />
          <Route path="/documentation" element={<DocumentationSelect />} />
          
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
