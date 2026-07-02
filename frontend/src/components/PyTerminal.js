import { UserContext } from '../App';
import React, { useState, useEffect, useContext, useRef } from 'react';
//import { loadPyodide } from "pyodide";




const PythonTerminal = ({ tableData, columns }) => {
	const { isLightMode } = useContext(UserContext);
	const output = document.getElementById("output");
	
  	/* async function hello_python() {
		let pyodide = await loadPyodide();
		return pyodide.runPythonAsync("1+1");
	};
  	const rez = await hello_python();
	console.log("Python says that 1+1 =", rez);  */
	return (
		<>
		{<textarea id="output" style={{"width": "100%", height:'100%',resize:"none",color: "#008a00",backgroundColor:"#000000"}} rows="6" disabled ></textarea>}
		</>
	);
};

export default PythonTerminal;