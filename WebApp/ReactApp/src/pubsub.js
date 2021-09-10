import {useState,useEffect} from "react"
import socketIOClient from 'socket.io-client'
import {Col,Row} from 'react-bootstrap'
import Notification from "./notification"


const PubSub = () => { 

    const ENDPOINT = "http://localhost:4001"
    const [response, setResponse] = useState('')

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)
        socket.on("FromAPI", data => {
          setResponse(data)
          console.log(data)
        })
      }, [])

    return(
        <>
        <p>
        Response {JSON.stringify(response)}
        </p>

        <Row className='justify-content-center'>
            <Notification></Notification>
            <Notification></Notification>
        </Row>

        </>
    )

}   

export default PubSub