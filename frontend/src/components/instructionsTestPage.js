import axios from 'axios';
import API_BASE from '../api.js';
import { UserContext } from '../App.js';
import { useEffect, useState, useContext } from 'react';
import "../css/formattedTextSection.css";

const url_LessonData = `${API_BASE}/lesson/`;

function LessonInstructions({ lessonId }) {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const { isLightMode } = useContext(UserContext);

  useEffect(() => {
    axios.get(`${url_LessonData}${lessonId}`)
      .then(res => setLesson(res.data))
      .catch(err => setError(err.message));
  }, [lessonId]);

  if (error) return <div className="error">{error}</div>;
  if (!lesson) return <div>Loading...</div>;

  return (
    <>
    <div
      className="Instructions"
      style={{color: isLightMode? "#a0316e": "#ffffff",backgroundColor: isLightMode? "#ffffff": "#0f0f1a", width:"stretch", height:"50%", scrollbarColor: "#008a00", scrollbarWidth: "4px", overflowY: 'auto'}}
      dangerouslySetInnerHTML={{ __html: lesson.instructions }}
    />
    </>
  );
}

export default LessonInstructions;