import React,{useEffect,useState} from 'react'
import {Jumbotron,Container,Image,Row,Col} from 'react-bootstrap'
import {ReactComponent as IconLogo} from '../../src/visualPageJumbotron.svg'
import MapView from '../components/MapView'
import axios from 'axios'
import axiosInstance from '../axios'
const VisualizeMainScreen = () => {
  const [locations, setLocations] = useState([])
  useEffect(() => {
    async function fetchLocations(){
      const {data} = await axiosInstance.get(`http://127.0.0.1:8000/api/locations/`)
      console.log(data)
      setLocations(data)
    }
    fetchLocations()
  }, [])
    return (
        
        <Container>
         <Row>
            <Col lg={7}>
            <IconLogo width="100%" height="100%"/>        
            </Col>
            <Col lg={5} className="visual">
            <h2 style={{color:"gray"}}>Su Kalitesi Veri Görselleştirme</h2>
            </Col>
         </Row>
         <Row>
            <Col>
            <MapView locations={locations}/></Col>
          </Row>
        </Container>
      
    )
}

export default VisualizeMainScreen
