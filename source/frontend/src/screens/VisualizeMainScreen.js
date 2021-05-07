import React from 'react'
import {Jumbotron,Container,Image,Row,Col} from 'react-bootstrap'
import {ReactComponent as IconLogo} from '../../src/visualPageJumbotron.svg'
import MapView from '../components/MapView'
const VisualizeMainScreen = () => {
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
            <MapView/></Col>
          </Row>
        </Container>
      
    )
}

export default VisualizeMainScreen
