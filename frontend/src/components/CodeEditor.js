import { UserContext } from '../App';
//import React, { useState, useEffect, useContext} from "react";


const CodeEditor = ({ script, isLightMode }) => {
  //const [scripty, setScripty] = useState(script);
  //const { isLightMode } = useContext(UserContext);
  console.log(script);
  return (
    <div className="editor" id="script_submission" /* onChange={handleChange} */ style={{color: isLightMode? "#a0316e": "#ff2f00",backgroundColor:"#000000",overflowY:"auto",overflowWrap: "anywhere",resize:"none", borderRadius: "5px", height:"612px", fontSize:"1rem", inlineSize: 'fit-content', minWidth: '100%', width: 'stretch'}}  contentEditable="plaintext-only">
    {script}
    </div>
  );
};

export default CodeEditor;