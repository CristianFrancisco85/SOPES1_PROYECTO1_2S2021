import Tweet from "./tweet"
import { Row } from "react-bootstrap"
import { useDbEndPoint, useTweetsData } from "./globalContext"
import { API_URL } from "./App"
import { useEffect } from "react"

const Home = () =>{

    const [data,setData] = useTweetsData()
    const [dbEndPoint,setDbEndPoint] = useDbEndPoint()

    useEffect(() => {
        fetch(`${API_URL}/${dbEndPoint}`)
        .then(response => response.json())
        .then(data => setData(data))

    },[dbEndPoint])

    return(
        <>
        <Row className='justify-content-center'>
            {data.map((item)=>{
                return <Tweet key={item.idTweet||item._id} data={item}></Tweet>
            })}
        </Row>
        </>
    )

}

export default Home

