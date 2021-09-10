import { Card,Row,Col,Image } from "react-bootstrap"

const Notification = () =>{
    
   return(
    <>
        <Card style={{width:'50em',margin:'2em'}}>
            <Card.Header>
                <Row className='justify-content-left p-3'>
                    <Card.Title>Notificacion 10/09/2021 18:30:45 </Card.Title>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row className='justify-content-left p-1 m-2'>
                    Guardados: 1000 Registros
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    API: Python Cloud Run
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    Tiempo de Carga: 5000 ms
                </Row>
                <Row className='justify-content-left p-1 m-2'>
                    Base de Datos: Cloud SQL
                </Row>
            </Card.Body>
        </Card>
    </>
   )
}
export default Notification