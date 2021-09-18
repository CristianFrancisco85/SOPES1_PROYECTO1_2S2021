import React, { useEffect } from 'react'
import {Card, Col,Row} from 'react-bootstrap'
import { API_URL } from './App'
import { useDbEndPoint, useTweetsData } from './globalContext'


const Reports = () => { 

    const [data,setData] = useTweetsData()
    const [dbEndPoint,setDbEndPoint] = useDbEndPoint()
    var _ = require('lodash')

    useEffect(() => {
        fetch(`${API_URL}/${dbEndPoint}`)
        .then(response => response.json())
        .then(data => setData(data))
    },[dbEndPoint])

    const getUniqueHashTags = () => {
        let hashTagsArray = []
        data.map(item =>{
            hashTagsArray = [...hashTagsArray,...item.Hashtags.split(',')]
        })
        _.uniq(_.map(hashTagsArray))

        return _.uniq(_.map(hashTagsArray)).length
    }

    const getUpVotes = () => {
        let upVotes = 0
        data.map(item =>{
            upVotes+=item.Upvotes
        })

        return upVotes
    }

    const getDownVotes = () => {
        let downVotes = 0
        data.map(item =>{
            downVotes+=item.Downvotes
        })

        return downVotes
    }

    return (
        <>
            <Row className='justify-content-center'>
                <Card className='m-2'>
                    <Card.Header>
                        <Card.Title>Conteo</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h3>{data.length} Tweets </h3>
                    </Card.Body>
                </Card>
                <Card className='m-2'>
                    <Card.Header>
                        <Card.Title>Hashtags</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h3>{getUniqueHashTags()} Diferentes </h3>
                    </Card.Body>
                </Card>
                <Card className='m-2'>
                    <Card.Header>
                        <Card.Title>Upvotes</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h3>{getUpVotes()}</h3>
                    </Card.Body>
                </Card>
                <Card className='m-2'>
                    <Card.Header>
                        <Card.Title>Downvotes</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h3>{getDownVotes()}</h3>
                    </Card.Body>
                </Card>
            </Row>
            
        </>
    )

}   

export default Reports