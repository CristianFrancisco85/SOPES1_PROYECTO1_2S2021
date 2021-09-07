import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react'
import socketIOClient from 'socket.io-client'
const ENDPOINT = "http://localhost:4001"

function App() {

  const [response, setResponse] = useState('')
  
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on("FromAPI", data => {
      setResponse(data)
      console.log(data)
    })
  }, [])

  return (
    <p>
      Response {JSON.stringify(response)}
    </p>
  );
}

export default App;
