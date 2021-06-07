import React,{Component} from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/button'

export default class ModalForm extends Component {

  state={ birinci: null, ikinci: null, ucuncu: null, dorduncu: null }

  handleChange = (obj) => {
        this.setState(
            obj
        )
  }

  render(){
    return(
      <Modal 
        show={this.props.isOpen} 
        onHide={this.props.closeModal}
        centered
      >
      <Modal.Header closeButton>
        <Modal.Title>Özelliştirilebilir Referans Aralıkları</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form.Group >
              <Form.Label>1. sınıf: </Form.Label>
              <Form.Control type="number" onChange={(e) => this.handleChange({birinci: parseInt(e.target.value)})} value={this.state.birinci} placeholder="Değer giriniz."/>
              <Form.Label>2. sınıf: </Form.Label>
              <Form.Control type="number" onChange={(e) => this.handleChange({ikinci:  parseInt(e.target.value)})} value={this.state.ikinci} placeholder="Değer giriniz."/> 
              <Form.Label>3. sınıf: </Form.Label>
              <Form.Control type="number" onChange={(e) => this.handleChange({ucuncu:  parseInt(e.target.value)})} value={this.state.ucuncu} placeholder="Değer giriniz."/> 
              <Form.Label>4. sınıf: </Form.Label>
              <Form.Control type="number" onChange={(e) => this.handleChange({dorduncu:  parseInt(e.target.value)})} value={this.state.dorduncu} placeholder="Değer giriniz."/>            
          </Form.Group>
          
      </Modal.Body>
      <Modal.Footer>
          <Button  variant="outline-dark" type="submit" onClick={() => this.props.handleSubmit(this.state)}>
              Ayarla
          </Button>
      </Modal.Footer>
    </Modal>
    )
  }
}