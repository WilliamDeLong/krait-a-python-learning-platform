import React, { useContext, useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from "../../App";

//const PRIMARY_COLOR = "#cc5c99";
//const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLightMode } = useContext(UserContext);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };


  let labelStyling = {
    color: '#000000',
    fontWeight: "bold",
    textDecoration: "none",
    //outline: "2px solid rgb(96 139 168)",
    font: '800 17px Arial',
    WebkitTextFillColor: '#ffd903',
    WebkitTextStroke: '0.4px'
  };
  let textStyling = {
    color: isLightMode ? '#0c0c1f' : '#0c0c1f',
    fontWeight: "bold",
    textDecoration: "none",
  };
  let backgroundStyling = { backgroundColor: isLightMode ? "#d8e6f5" : '#14294c' };
  let buttonStyling = {
    background: isLightMode ? '#ffd903' : "#ffd903",
    borderStyle: "none",
    color: isLightMode ? '#0c0c1f' : '#0c0c1f',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;

      // Show confirmation window
      window.alert("Registration successful! Please log in.");
      
      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div
            className="row d-flex justify-content-center align-items-center h-100 "
            style={backgroundStyling}
          >
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>Username</Form.Label>
                  <Form.Control
                    type="username"
                    name="username"
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                  <Form.Text style={textStyling}>
                    Note: I can and will judge you for your username.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter Email Please"
                  />
                  <Form.Text style={textStyling}>
                    You don't have to input a real email, there's no system in place that can make use of it, so just input something funny
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={labelStyling}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Text className="pt-1" style={textStyling}>
                    Already have an account?
                    <span>
                      <Link to="/login" style={labelStyling}> Login
                      </Link>
                    </span>
                  </Form.Text>
                </Form.Group>
                {error && (
                  <div style={labelStyling} className="pt-3">
                    {error}
                  </div>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleSubmit}
                  style={buttonStyling}
                  className="mt-2"
                >
                  Register
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
