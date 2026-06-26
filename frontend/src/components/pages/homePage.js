import React, { useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import { UserContext } from '../../App';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { isLightMode } = useContext(UserContext);

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    if (!user) return (
        <div><h4>Log in to view this page.</h4></div>
    );

    const { id, email, username } = user;

    return (
        <>
            <div style={{backgroundColor: isLightMode ? "#d8e6f5" : '#14294c', height:"93.5vh", width:'210.5vh'}}>
                <div className="card-container" >
                    <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff'}}>
                        <h3>Welcome</h3>
                        <p className="username" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{username}</p>
                    </div>
                    <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff'}}>
                        <h3>Your userId in MongoDB is</h3>
                        <p className="userId" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{id}</p>
                    </div>
                    <div className="card" style={{backgroundColor: isLightMode ? '#ffffff' : '#000000', color: isLightMode ? '#000000' : '#ffffff'}}>
                        <h3>Your email is</h3>
                        <p className="email" style={{color: isLightMode ? '#000000' : '#ffffff'}}>{email}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;