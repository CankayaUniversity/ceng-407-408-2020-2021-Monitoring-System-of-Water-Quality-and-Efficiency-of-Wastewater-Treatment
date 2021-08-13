import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ReactComponent as IconLogo } from '../../src/Data-extraction-rafiki.svg'

function DataEntryMainScreen() {
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <IconLogo width="100%" height="100%" />
        </Col>
        <Col lg={5} className="visual">
          <h2 style={{ color: 'gray' }}>Veri Girişi</h2>
        </Col>
      </Row>
    </Container>
  )
}

export default DataEntryMainScreen
