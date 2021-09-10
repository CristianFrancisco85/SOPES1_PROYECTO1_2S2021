import React,{useState,useEffect} from 'react'
import './App.css';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom'
import {Jumbotron,Row,Col, Container} from 'react-bootstrap'
import NavBar from './navBar'
import Home from './home'
import Reports from './reports';
import {GlobalContext} from './globalContext'
import PubSub from './pubsub';


const App = () => {

  const [data,setData] = useState([])

  const dataGlobalState = {
    tweetsData : [data,setData],
  }


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

