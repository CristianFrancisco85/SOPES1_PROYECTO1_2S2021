import React, { useState } from 'react'
import {Nav,Navbar,Button,Row,Jumbotron} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDbEndPoint } from './globalContext'

const NavBar = () => { 

    const [cosmosState,setCosmosState] = useState('outline-')
    const [cloudState,setCloudState] = useState('')

    const [dbEndPoint,setDbEndPoint] = useDbEndPoint()

    const handleCloudClick = () =>{
        if(cloudState=='outline-'){
            setDbEndPoint('fromCloudSQL')
            setCosmosState('outline-')
            setCloudState('')
        }
    }
    const handleCosmosClick = () =>{
        if(cosmosState=='outline-'){
            setDbEndPoint('fromCosmosDB')
            setCloudState('outline-')
            setCosmosState('')
        }
    }

    return (
        <>
        <Jumbotron style={{backgroundColor:"#4287f5"}} className='mb-0 jumbotron-header' fluid>
        <Row className='justify-content-center'>
            <h1> Olympics Game News</h1>
        </Row>
        </Jumbotron>    
        <Navbar bg="dark" expand="lg" variant='dark' className="mb-5">
        <Navbar.Brand as={Link} to='/'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-layout-wtf" viewBox="0 0 16 16">
        <path d="M5 1v8H1V1h4zM1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm13 2v5H9V2h5zM9 1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9zM5 13v2H3v-2h2zm-2-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3zm12-1v2H9v-2h6zm-6-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H9z"/>
        </svg>
        </Navbar.Brand>
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
            <Button variant={`${cosmosState}warning`} className='mr-2' size='sm' onClick={handleCosmosClick}>CosmosDB</Button>
            <Button variant={`${cloudState}warning`} className='ml-2' size='sm' onClick={handleCloudClick}>CloudSQL</Button>

        </Navbar.Collapse>
        </Navbar>
        </>
    )

}   

export default NavBar