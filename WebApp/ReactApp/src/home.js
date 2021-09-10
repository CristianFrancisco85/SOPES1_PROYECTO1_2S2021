import Tweet from "./tweet"
import { Row } from "react-bootstrap"

const Home = () =>{


    return(
        <>
        <Row className='justify-content-center'>
            <Tweet></Tweet>
            <Tweet></Tweet>
        </Row>
        </>
    )

}

export default Home

