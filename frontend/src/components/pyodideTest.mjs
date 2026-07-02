// hello_python.mjs
import React, { useState, useEffect, useContext} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from 'react-bootstrap/cjs/Nav.js';
import API_BASE from '../api.js';
import getUserInfo from "../utilities/decodeJwt.js";
//import { UserContext } from '../App.js';
import { loadPyodide } from "pyodide";

async function hello_python() {
  let pyodide = await loadPyodide();
  return pyodide.runPythonAsync("1+1");
}

const result = await hello_python();
console.log("Python says that 1+1 =", result);