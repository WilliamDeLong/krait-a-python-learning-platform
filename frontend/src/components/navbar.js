import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';


// Here, we display our Navbar
export default function Navbar() {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
  const [user, setUser] = useState({})
  const [progressShuffler, setProg] = useState(0);
  const [progressDirection, setProgDir] = useState(1);


  useEffect(() => {
  setUser(getUserInfo())
  setProg(progressShuffler+(0.01*progressDirection));
    console.log("Current Progress =",progressShuffler+"%");
    if (progressShuffler>1 || progressShuffler<0) {
      if (progressShuffler>1)
        setProgDir(-1);
      else setProgDir(1);
      console.log("Progress Direction: "+progressDirection);
    }
  }, [])
  
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar bg="dark" variant="dark">
    <Container>
      <Nav className="me-auto">
        <Nav.Link href="/">Start</Nav.Link>
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
        <Nav.Link href="/lessonTestpage">Lesson</Nav.Link>

      </Nav>
      <progress draggable={false} value={progressShuffler}/>
    </Container>
  </ReactNavbar>

  );
}