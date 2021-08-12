import React from 'react';
import {Navbar,Nav,Container,Form,FormControl,Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {ReactComponent as IconLogo} from '../../src/logo.svg'
import { Link } from 'react-router-dom'
const HeaderData = () => {

    return (
        <header style={{marginBottom: "16px"}}>
          <Navbar variant={"light"} expand="lg">
            <Container>

              <LinkContainer to={"/"} style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                <Navbar.Brand><IconLogo style={{marginRight:"16px"}}/> WQPMS</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <LinkContainer to={"/akarsu"}>
                      <Nav.Link >Akarsu</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to={"/deniz"}>
                      <Nav.Link >Deniz</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to={"/gol"}>
                      <Nav.Link >Göl</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to={"/aritma"}>
                      <Nav.Link >Arıtma</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to={"/logout"}>
                    <Button variant="outline-secondary" size="sm">
                      Çıkış
                    </Button>
                  </LinkContainer>
                  
                </Nav>
              </Navbar.Collapse>

            </Container>
          </Navbar>
        </header>
    );

}

export default HeaderData;
