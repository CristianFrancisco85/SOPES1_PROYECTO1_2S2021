import React,{useState,useEffect} from 'react'
import './App.css';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom'
import {Jumbotron,Container} from 'react-bootstrap'
import NavBar from './navBar'
import Home from './home'
import Reports from './reports';
import {GlobalContext} from './globalContext'
import PubSub from './pubsub'
import socketIOClient from 'socket.io-client'

export const API_URL = "https://sapient-ground-324600.uc.r.appspot.com"

const App = () => {



  const [data,setData] = useState([])
  const [response, setResponse] = useState([])
  const [dbEndPoint,setDbEndPoint] = useState('fromCloudSQL')

  const dataGlobalState = {
    tweetsData : [data,setData],
    pubSubMsg : [response, setResponse],
    dbEndPoint : [dbEndPoint,setDbEndPoint]
  }

  useEffect(() => {
      const socket = socketIOClient(API_URL)
      socket.on("FromAPI", data => {
        setResponse(oldArr => [...oldArr,data])
        fetch(`${API_URL}/${dbEndPoint}`)
        .then(response => response.json())
        .then(data => setData(data));
      })
  },[])

  


  return(

  <GlobalContext.Provider value={dataGlobalState}>

  <Container fluid style={{overflowX:'hidden',padding:0}}>
    
    <BrowserRouter >

    <NavBar></NavBar>

    <Switch>
        <Route  exact path="/home" component={Home}/>
        <Route  exact path="/reports" component={Reports}/>
        <Route  exact path="/pubsub" component={PubSub}/>
        <Redirect from="/" to="/home" />
    </Switch>
    
    </BrowserRouter>

    <Jumbotron className='mb-0' style={{paddingBottom:'0em'}} fluid>
        
    </Jumbotron>
      
  </Container>

  </GlobalContext.Provider>


  )
}

export default App;

