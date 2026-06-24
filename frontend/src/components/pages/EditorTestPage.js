import {basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {indentOnInput} from "@codemirror/language";

import { python } from "@codemirror/lang-python";

import { oneDark } from "@codemirror/theme-one-dark";


import React, { useContext, useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import "../../css/h3.css";
import "../../css/box.css";
import "../../css/editor.css";
import Button from "react-bootstrap/Button";
import logo from "../../images/Logo.png";
import logo_dm from "../../images/DarkModeLogo.png";
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from "../../App";



const ExperimentEditor = () => {
	const [code, setCode] = useState('# help\n# This is a test\n# God I hope these work');
	const [user, setUser] = useState(getUserInfo());
  	const { isLightMode } = useContext(UserContext);
    let leftCard = {
        display: "flex",
        //justifyContent: "flex-end",
        marginLeft: 0,
        //marginRight: '50px',
        width: '45rem',
		height:"612px"
        //height: 'fit-content',
        //textAlign: 'center',
        //backgroundColor: isLightMode ? '#ffffff' : '#000000'
    };
	let extensions = [keymap.of([defaultKeymap, indentWithTab]), basicSetup, python()];
	if (isLightMode===false) {
		extensions.push(oneDark);
	};
	let startState = EditorState.create({
		doc: code,
		extensions: extensions
	})
	let view = new EditorView({
		state: startState,
		parent: document.querySelector(`#editor`)
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("Gate 1");
			//let transaction = view.state.update({changes: {from: 0, to: view.state.doc.length,insert: code}});
			//view.dispatch(transaction)
			console.log(view.state.doc.toString());
		
		} catch (error) {
		if (
			error.response &&
			error.response.status >= 400 &&
			error.response.status <= 500
		) {
			console.log(error.response.data.message);
			//setError(error.response.data.message);
		}
		else {console.log(error);}
		}
		
	};

	useEffect(() => {
    
  }, []);
    
    
    return (
        <div style={{maxHeight: '200%', minHeight: '200%', height:(user?.id ? '93.5vh' : '100vh'), backgroundColor: isLightMode ? '#5562be' : '#14294c'}}>
            <div className='box' style={leftCard}>
                <div className="left" style={{background: isLightMode ? '#5562be': "#14294c",width:'stretch'}}>
                  <div id="editor" className="script_submission" style={{height:"612px", width: '100%'}} />
                </div>
            </div>
			<Button style={{justifyContent:"center"}}  variant="success" onClick={handleSubmit}/* href="/lessons" */>Run Code</Button>
        </div>
    );
}

export default ExperimentEditor;
