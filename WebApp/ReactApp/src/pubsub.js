import { useContext } from 'react'
import {Row} from 'react-bootstrap'
import { useMsgData } from './globalContext'
import Notification from "./notification"


const PubSub = () => { 
    
    const [response,setResponse] = useMsgData()

    return(
        <>
        <Row className='justify-content-center'>
            {response.map((item,index)=>{
              return <Notification key={index} enum={index} data={item} ></Notification>
            })}
        </Row>
        </>
    )

}   

export default PubSub