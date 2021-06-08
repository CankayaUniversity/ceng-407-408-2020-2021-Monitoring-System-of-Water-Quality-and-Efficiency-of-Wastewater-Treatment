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
              <Form.Control type="number" step="0.1" onChange={(e) => this.handleChange({birinci: parseFloat(e.target.value)})} value={this.state.birinci} placeholder="Sınıf üst değeri giriniz."/>
              <Form.Label>2. sınıf: </Form.Label>
              <Form.Control type="number" step="0.1" onChange={(e) => this.handleChange({ikinci:  parseFloat(e.target.value)})} value={this.state.ikinci} placeholder="Sınıf üst değeri giriniz."/> 
              <Form.Label>3. sınıf: </Form.Label>
              <Form.Control type="number" step="0.1"  onChange={(e) => this.handleChange({ucuncu:  parseFloat(e.target.value)})} value={this.state.ucuncu} placeholder="Sınıf üst değeri giriniz."/> 
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