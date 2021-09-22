import React, { useEffect } from 'react'
import {Card, Col,Row} from 'react-bootstrap'
import { API_URL } from './App'
import { useDbEndPoint, useTweetsData } from './globalContext'
import {Bar, Doughnut} from 'react-chartjs-2'

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

    const groupByDate = ()=>{
        let aux={}
        aux = _.groupBy( data, item => item.Fecha)
        console.log(aux);
        return aux
    }

    const getDownVotesArray = (array)=>{
        let res=0
        array.map(item=>{
            res+=item.Downvotes
        })
        return res
    }

    const getUpVotesArray = (array)=>{
        let res=0
        array.map(item=>{
            res+=item.Upvotes
        })
        return res
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
            <Row className='justify-content-center' >

                <Card className='m-2' style={{height:'27em',width:'25em'}}>
                    <Card.Header>
                        <Card.Title>Downvotes vs Upvotes</Card.Title>
                    </Card.Header>
                    <Card.Body className='overflow-auto'>
                        {Object.entries(groupByDate()).map((entry,index) =>{
                            return <Bar key={index} data={{
                                labels: ['Downvotes','Upvotes'],
                                datasets: [{
                                    label: entry[0],
                                    data: [getDownVotesArray(entry[1]),getUpVotesArray(entry[1])],
                                    backgroundColor: [
                                    'rgb(227, 20, 20)',
                                    'rgb(54, 162, 235)',
                                    ],
                                    hoverOffset: 4
                                }]
                                }
                            }>
                            </Bar>
                        })}
                        
                    </Card.Body>
                </Card>

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
            <Row className='justify-content-center' >
                <Card>
                    <Card.Header>
                        <Card.Title> Entradas Recientes </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row className='justify-content-center'>
                            <h4 className='col-1'>{data.at(-1).Nombre}</h4>
                            <h5 className='col-1'>{data.at(-1).Fecha}</h5>
                            <h5 className='col-5 overflow-auto'>{data.at(-1).Comentario}</h5>
                            <h5 className='col-4 overflow-auto'>{data.at(-1).Hashtags}</h5>
                        </Row>
                        <hr></hr>
                        <Row className='justify-content-center'>
                            <h4 className='col-1'>{data.at(-2).Nombre}</h4>
                            <h5 className='col-1'>{data.at(-2).Fecha}</h5>
                            <h5 className='col-5 overflow-auto'>{data.at(-2).Comentario}</h5>
                            <h5 className='col-4 overflow-auto'>{data.at(-2).Hashtags}</h5>
                        </Row>
                        <hr></hr>
                        <Row className='justify-content-center'>
                            <h4 className='col-1'>{data.at(-3).Nombre}</h4>
                            <h5 className='col-1'>{data.at(-3).Fecha}</h5>
                            <h5 className='col-5 overflow-auto'>{data.at(-3).Comentario}</h5>
                            <h5 className='col-4 overflow-auto'>{data.at(-3).Hashtags}</h5>
                        </Row>
                        <hr></hr>
                        <Row className='justify-content-center'>
                            <h4 className='col-1'>{data.at(-4).Nombre}</h4>
                            <h5 className='col-1'>{data.at(-4).Fecha}</h5>
                            <h5 className='col-5 overflow-auto'>{data.at(-4).Comentario}</h5>
                            <h5 className='col-4 overflow-auto'>{data.at(-4).Hashtags}</h5>
                        </Row>
                        <hr></hr>
                        <Row className='justify-content-center'>
                            <h4 className='col-1'>{data.at(-5).Nombre}</h4>
                            <h5 className='col-1'>{data.at(-5).Fecha}</h5>
                            <h5 className='col-5 overflow-auto'>{data.at(-5).Comentario}</h5>
                            <h5 className='col-4 overflow-auto'>{data.at(-5).Hashtags}</h5>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
            
        </>
    )

}   

export default Reports