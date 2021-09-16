import Tweet from "./tweet"
import { Row } from "react-bootstrap"
import { useTweetsData } from "./globalContext"
import { API_URL } from "./App"
import { useEffect } from "react"

const Home = () =>{

    const [data,setData] = useTweetsData()

    useEffect(() => {

        fetch(`${API_URL}/fromCloudSQL`)
        .then(response => response.json())
        .then(data => setData(data));

    },[])

    return(
        <>
        <Row className='justify-content-center'>
            {data.map((item)=>{
                return <Tweet key={item.idTweet} data={item}></Tweet>
            })}
        </Row>
        </>
    )

}

export default Home

