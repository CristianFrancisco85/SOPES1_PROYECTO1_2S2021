import { useState } from "react"
import { Card,Row,Col,Image } from "react-bootstrap"

const Notification = (props) =>{

    const data = props.data
    
   return(
    <>
        <Card style={{width:'50em',margin:'2em'}}>
            <Card.Header>
                <Row className='justify-content-left p-3'>
                    <Card.Title>Notificacion #{props.enum}</Card.Title>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row className='justify-content-left p-1 m-2'>
                    Guardados: {data.guardados}
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    API: {data.api}
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    Tiempo de Carga: {data.tiempoDeCarga}
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    Base de Datos: {data.bd}
                </Row>
            </Card.Body>
        </Card>
    </>
   )
}
export default Notification