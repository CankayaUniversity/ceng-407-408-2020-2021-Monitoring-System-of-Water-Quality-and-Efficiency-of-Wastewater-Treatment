import React from 'react'
import {Jumbotron,Container,Image,Row,Col} from 'react-bootstrap'
import {ReactComponent as IconLogo} from '../../src/visualPageJumbotron.svg'
const VisualizeMainScreen = () => {
    return (
        
        <Container>
         <Row>
            <Col lg={7}>
            <IconLogo width="100%" height="100%"/>
         
            </Col>
            <Col lg={5} className="visual">
              <h2 style={{color:"gray"}}>Veri Görselleştirme</h2>
            </Col>
         </Row>
        </Container>
      
    )
}

export default VisualizeMainScreen
