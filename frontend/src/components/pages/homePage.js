import React, { useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserContext } from '../../App';
import axios from "axios";
import API_BASE from '../../api';
import Modal from "react-bootstrap/Modal";
import "../../css/modal.css";

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;
const login_url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;
const delete_url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/`;

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [data, setData] = useState({userId: "", username: "", email: "", password: "", country: "", phoneNumber: "", pronoun: ""});
    const [userDeletionData, setDeleter] = useState({username: "", password: ""});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { isLightMode } = useContext(UserContext);
    const [editMode, setEdit] = useState(false);
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const [incorrectPW, setIPW] = useState("");
    let buttonStyling = {
        background: isLightMode ? '#ffd903' : "#ffd903",
        borderStyle: "none",
        color: isLightMode ? '#0c0c1f' : '#0c0c1f',
    };
    let buttonStyling2 = {
        background: isLightMode ? '#ff0303' : "#ff0303",
        borderStyle: "none",
        color: isLightMode ? '#0c0c1f' : '#0c0c1f',
        width:'50%'
    };
    let buttonStyling3 = {
        background: isLightMode ? '#53ff03' : "#53ff03",
        borderStyle: "none",
        color: isLightMode ? '#0c0c1f' : '#0c0c1f',
        width:'50%'
    };
    let buttonStyling4 = {
        background: isLightMode ? '#000000' : "#000000",
        color: '#ff0303',
        borderStyle: "dashed",
        borderColor: '#ff0303',
        //color: isLightMode ? '#0c0c1f' : '#0c0c1f',
        width:'100%'
    };
    let containedCard = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '50%',
        margin: '10px auto 0 auto'
    };

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };
    const toggleEdit = () => {
        //console.log(`lightmode current ${isLightMode}`);
        setEdit((prev) => !prev);
    };
    const handleChange = ({ currentTarget: input }) => {
        if (input.name==="Dpassword") {
            setDeleter({username: data.username, password: input.value})
        }
        else {
            setData({ ...data, [input.name]: input.value });
        }
        console.log("Name: ", input.name);
        console.log("Value: ", input.value);
    };
    const handleDeletionLogout = async (e) => {
        try{ 
            const { data: passwordConfirmationResult } = await axios.post(login_url, userDeletionData);
            console.log(console.log(passwordConfirmationResult));
            if (passwordConfirmationResult.accessToken!==null) {
                //console.log(delete_url+data.userId);
                const { data: AccountDeletionResult } = await axios.post(delete_url+data.userId+"/delete");
                console.log(AccountDeletionResult);
                localStorage.clear();
                navigate("/logout");
                //console.log(`account_Deleted: ${AccountDeletionResult}`);
            }
            //console.log(passwordConfirmationResult);
        } catch (error) {
        if (error.response && error.response.status === 400) {
            setIPW("Incorrect Password.");
        }
        if (error.response && error.response.status === 401) {
            setIPW("Account not found.");
        }
        }
        //localStorage.clear();
        //navigate("/logout");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        
        const { data: res } = await axios.post(url, data);
        const { accessToken } = res;
        localStorage.setItem("accessToken", accessToken);
        // Show confirmation window
        window.alert("Account details modified!");
        
        // Navigate to the login page
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

    useEffect(() => {
        setUser(getUserInfo());
        //console.log(getUserInfo());
        //setUser(getUserInfo());
        //console.log(user);
        fetch_data();
        //setData({ ...data, ["userId"]: getUserInfo().id });
    }, []);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const fetch_data = async () => {
        try {
            //console.log(ChapterID);
            //console.log(user);
            const author_data = await axios.get(`${API_BASE}/user/get/${getUserInfo().id}`);
            //console.log(author_data.data);
            author_data.data["userId"] = author_data.data["_id"]
            //console.log("Test");
            //author_data.data.removeItem("_id");
            setData(author_data.data);
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
    

    if (!user) return (
        <div><h4>Log in to view this page.</h4></div>
    );

    const { id, email, username} = user;
    if (data.id==="" && user._id===null) return (
        <div style={{background: isLightMode ? "#d8e6f5": "#14294c", color: !isLightMode? "#000000": "#ffffff"}}><h4>Loading User Details</h4></div>
    ) 
  else return (
        <>
            <div style={{backgroundColor: isLightMode ? "#d8e6f5" : '#14294c', height:"93%", width:'100%'}}>
                <div className="card-containment" style={containedCard}>
                    {!editMode && <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff'}}>
                        <h3>Welcome</h3>
                        <div className="username" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.username}{editMode && <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Control type="username" name="username" onChange={handleChange} defaultValue={data.username}/></Form.Group>}</div>
                    </div>}
                    {editMode && <div style={{display: "flex", justifyContent: "flex-end", width:'150%',marginLeft:'-25%'}}>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '0px', width:'50%'}}>
                        <h3>Edit Account</h3>
                        <div className="username" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.username}{editMode && <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Control type="username" name="username" onChange={handleChange} defaultValue={data.username}/></Form.Group>}</div>
                    </div>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '40px', marginRight: '0px', width:'50%'}}>
                        <h2>Password</h2>
                        <div className="password" style={{color: isLightMode ? '#000000' : '#ffffff'}}><Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Control type="password" name="password" onChange={handleChange} placeholder="Enter your password here"/></Form.Group></div>
                    </div>
                    </div>}
                    <div style={{display: "flex", justifyContent: "flex-end", width:'150%',marginLeft:'-25%'}}>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '0px', width:'50%'}}>
                            <h3 style={{fontSize: '1.70rem'}}>Country: </h3>
                            <div className="pronamel" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.country}{editMode && <Form.Group className="mb-3" controlId="formBasicCountry">
                                <Form.Control type="country" name="country" onChange={handleChange} defaultValue={data.country}/></Form.Group>}
                            </div>
                        </div>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '40px', marginRight: '0px', width:'50%'}}>
                            <h3>Gender:</h3>
                            <div className="pronamel" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.pronoun}{editMode && <Form.Group className="mb-3" controlId="formBasicPronamel">
                            <Form.Control type="pronoun" name="pronoun" onChange={handleChange} defaultValue={data.pronoun}/>
                            </Form.Group>}</div>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", width:'150%',marginLeft:'-25%'}}>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '0px', width:'50%'}}>
                            <h3>Email:</h3>
                            <div className="email" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.email}{editMode && <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" name="email" onChange={handleChange} defaultValue={data.email}/></Form.Group>}</div>
                        </div>
                        <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff', marginLeft: '40px', marginRight: '0px', width:'50%'}}>
                            <h3>Phone number:</h3>
                            <div className="email" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{!editMode && data.phoneNumber}{editMode && <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Control type="phone" name="phoneNumber" onChange={handleChange} defaultValue={data.phoneNumber}/></Form.Group>}</div>
                        </div>
                    </div>
                    
                    {!editMode &&<Button variant="primary" type="edit" onClick={toggleEdit} style={buttonStyling} className="mt-2">Edit Account Details</Button>}
                    {editMode &&(<div style={{display: "flex", justifyContent: "flex-end", width:'150%',marginLeft:'-25%'}}>
                        <Button variant="primary" type="edit" onClick={toggleEdit} style={buttonStyling2} className="mt-2">Cancel</Button>
                        <Button variant="primary" type="submit" onClick={handleSubmit} style={buttonStyling3} className="mt-2" disabled={data.password===""}>Submit Changes</Button>
                    </div>)}
                    {editMode && (<Button type="delete" onClick={handleShow} style={buttonStyling4} className="mt-2" disabled={data.password===""}>Delete Account</Button>)}
                    <Modal className="Delete" show={show} onHide={handleClose} backdrop="static" keyboard={false} >
                        <Modal.Header closeButton >
                            <Modal.Title style={buttonStyling4}>Delete Account?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={buttonStyling4}>Are you absolutely certain you want to delete your account?
                        This CANNOT be undone.<div><Form.Group className="mb-3" controlId="accountDeletionPassword"><Form.Control type="password" name="Dpassword" onChange={handleChange} placeholder="Enter password."/></Form.Group>
                        </div>
                        {incorrectPW!=="" &&(<div>{incorrectPW}</div>)}
                        </Modal.Body>
                        <Modal.Footer >
                            <Button variant="secondary" onClick={handleClose}>
                            Close
                            </Button>
                            <Button variant="primary" onClick={handleDeletionLogout}>
                            Yes
                            </Button>
                        </Modal.Footer>
                        </Modal>
                </div>
                
            </div>
        </>
    );
};

export default ProfilePage;