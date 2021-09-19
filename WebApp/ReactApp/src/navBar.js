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
            <Button variant={`${cosmosState}warning`} className='mr-2' size='sm' onClick={handleCosmosClick}>CosmosDB</Button>
            <Button variant={`${cloudState}warning`} className='ml-2' size='sm' onClick={handleCloudClick}>CloudSQL</Button>

        </Navbar.Collapse>
        </Navbar>
        </>
    )

}   

export default NavBar