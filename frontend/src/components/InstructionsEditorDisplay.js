import axios from 'axios';
import API_BASE from '../api.js';
import { UserContext } from '../App.js';
import { useEffect, useState, useContext } from 'react';
import "../css/formattedTextSection.css";
import "../css/formattedTextSectionLight.css";

const url_LessonData = `${API_BASE}/lesson/`;

function InstructionsEditorDisplay({ htmlData }) {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const { isLightMode } = useContext(UserContext);
  const { lessonLayoutType } = useContext(UserContext);

  if (error) return <div className="error" style={{color: "#ff0000",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", height:"95.4%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}}>{error}</div>;
  if (!htmlData) return <div style={{color: isLightMode? "#010101": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", height:"95.4%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}}>Loading...</div>;
  return (
    <>
    <div
      className={isLightMode?"InstructionsLM":"Instructions"}
      style={{color: isLightMode? "#a0316e": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", height:"100%", scrollbarColor: "#008a00", scrollbarWidth: "thin", overflowY: 'auto'}}
      dangerouslySetInnerHTML={{ __html: htmlData }}
    />
    </>
  );
}

export default InstructionsEditorDisplay;