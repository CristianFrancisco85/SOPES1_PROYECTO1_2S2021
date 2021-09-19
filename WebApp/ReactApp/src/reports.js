import React, { useEffect } from 'react'
import {Card, Col,Row} from 'react-bootstrap'
import { API_URL } from './App'
import { useDbEndPoint, useTweetsData } from './globalContext'
import {Doughnut} from 'react-chartjs-2'

const Reports = () => { 

    const [data,setData] = useTweetsData()
    const [dbEndPoint,setDbEndPoint] = useDbEndPoint()
    var _ = require('lodash')

    useEffect(() => {
        fetch(`${API_URL}/${dbEndPoint}`)
        .then(response => response.json())
        .then(data => setData(data))
    },[dbEndPoint])

    const getHashTagsArray = () =>{
        let hashTagsArray=[]
        data.map(item =>{
            hashTagsArray = [...hashTagsArray,...item.Hashtags.split(',')]
        })
        hashTagsArray=hashTagsArray.filter(item =>{
            return item!=''
        })
        return hashTagsArray
    }

    const getUniqueHashTags = () => {
        let hashTagsArray = getHashTagsArray()

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

    const getTopHashtags = ()=>{

        let result=[]
        let hashTagsArray = getHashTagsArray()

        for (let i=0;i<5;i++) {
            result.push(_.head(_(hashTagsArray)
            .countBy()
            .entries()
            .maxBy(_.last)))
            hashTagsArray=hashTagsArray.filter(item =>{
                return item!=result[i]
            })
        }

        let counts=[]
        hashTagsArray = getHashTagsArray()
        result.map(hashtag =>{
            let aux=[]
            aux=hashTagsArray.filter(item =>{
                return item==hashtag
            })
            counts.push(aux.length)
        })
        return {result,counts}
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
            <Row className='justify-content-center'>
                <Card className='m-2'>
                    <Card.Header>
                        <Card.Title>Top Hashtags</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Doughnut data={{
                            labels: [...getTopHashtags().result],
                            datasets: [{
                                label: 'Top HashTags',
                                data: [...getTopHashtags().counts],
                                backgroundColor: [
                                'rgb(227, 20, 20)',
                                'rgb(54, 162, 235)',
                                'rgb(128, 58, 181)',
                                'rgb(43, 224, 76)',
                                'rgb(242, 171, 48)'
                                ],
                                hoverOffset: 4
                            }]
                            }
                        }>

                        </Doughnut>
                        
                    </Card.Body>
                </Card>
            </Row>
            
        </>
    )

}   

export default Reports