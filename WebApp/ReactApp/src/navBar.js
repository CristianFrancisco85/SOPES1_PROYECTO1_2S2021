import React from 'react'
import {Nav,Navbar,Col,Row,Jumbotron} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavBar = () => { 

    return (
        <>
        <Jumbotron style={{backgroundColor:"#4287f5"}} className='mb-0 jumbotron-header' fluid>
        <Row className='justify-content-center'>
            <h1> Proyecto 1</h1>
        </Row>
        </Jumbotron>    
        <Navbar bg="dark" expand="lg" variant='dark' className="mb-5">
        <Navbar.Brand as={Link} to='/'>"Logo"</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">

            <Nav.Link as={Link} to="/home" >
            Tweets
            </Nav.Link>

            <Nav.Link as={Link} to="/reports" >
            Reportes
            </Nav.Link>
            
            <Nav.Link as={Link} to="/pubsub" >
            PubSub
            </Nav.Link>
            
        </Nav>
        </Navbar.Collapse>
        </Navbar>
        </>
    )

}   

export default NavBar