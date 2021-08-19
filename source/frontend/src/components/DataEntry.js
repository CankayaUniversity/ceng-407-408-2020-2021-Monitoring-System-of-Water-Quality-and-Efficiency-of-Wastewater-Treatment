import React, { useEffect, useState, useRef } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Container, Row, Col, Card, Button, Spinner, FormControl, InputGroup, Alert, Collapse, ButtonGroup, Overlay } from 'react-bootstrap'
import cellEditFactory from 'react-bootstrap-table2-editor'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import axiosInstance from '../axios'
import SelectSearch, { fuzzySearch } from 'react-select-search'

const defineLocationType = (locationType) => {
  switch (locationType) {
    case 'akarsu':
      return 'Akarsu'
    case 'deniz':
      return 'Deniz'
    case 'aritma':
      return 'Arıtma'
    case 'gol':
      return 'Göl'
    default:
      break
  }
}

const DataEntry = (props) => {
  let locationType = defineLocationType(props.location.pathname.substring(1))

  const [bolgeAdlari, setBolgeAdlari] = useState([])
  const [yerAdlari, setYerAdlari] = useState([])
  const [months, setMonths] = useState([])
  const [selectedBolge, setSelectedBolge] = useState('')
  const [selectedYer, setSelectedYer] = useState('')
  const [parametreler, setParametreler] = useState([])
  const [parametreOptionsState, setParametreOptions] = useState([])
  const [selectedNumuneKodu, setSelectedNumuneKodu] = useState('')
  const [selectedYil, setSelectedYil] = useState('')
  const [isClicked, setIsClicked] = useState(false)
  const [showYil, setShowYil] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const targetYil = useRef(null)
  const [yillar, setYillar] = useState([])

  const [open, setOpen] = useState(false)

  const [alert, setAlert] = useState({
    hasAlert: false,
    isError: false,
    isSucces: false,
    isInfo: false,
    message: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const stringParameters = ['Açıklama', 'Renk', 'Koku', 'Renk / Koku']

  useEffect(() => {
    async function fetchLocations() {
      const { data } = await axiosInstance.get(`/locations/${locationType}`)
      setBolgeAdlari(data.sort())
    }
    async function fetchParameters() {
      let parametreArray = []
      const { data } = await axiosInstance.get(`/readingtypes/${locationType}`)
      data.map((parametre) => {
        parametreArray.push(parametre)
      })
      setParametreler(parametreArray.sort())
      const parametreOptions = []

      parametreArray.map((parametre) =>
        parametreOptions.push({
          id: parametre,
          ocak: null,
          subat: null,
          mart: null,
          nisan: null,
          mayis: null,
          haziran: null,
          temmuz: null,
          agustos: null,
          eylul: null,
          ekim: null,
          kasim: null,
          aralik: null,
        })
      )

      setParametreOptions(parametreOptions)
    }
    fetchLocations()
    fetchParameters()
  }, [])
  async function fetchYer(bolge_adi) {
    const { data } = await axiosInstance.get(`/locations/${locationType}/${bolge_adi}`)
    setYerAdlari(data.sort())
  }
  const BolgeOptions = []
  const YerOptions = []

  bolgeAdlari.map((bolge) => BolgeOptions.push({ name: bolge, value: bolge }))
  yerAdlari.map((yer) => YerOptions.push({ name: yer, value: yer }))

  const isNumber = (newValue) => {
    if (newValue.includes(' ')) {
      return false
    }
    if (newValue.startsWith('<') || newValue.startsWith('>')) {
      if (newValue.length === 1) {
        return false
      }
      var num = Number(newValue.slice(1))
      if (isNaN(num)) {
        return false
      } else return true
    }
    var num = Number(newValue)
    if (isNaN(num)) {
      return false
    } else return true
  }

  const validation = (newValue, row, column) => {
    if (stringParameters.includes(row.id)) return true

    for (const i in parametreler) {
      if (row.id === parametreler[i]) {
        if (isNumber(newValue) === true) {
          return true
          // min-max
          // if(newValue > min && newValue < max)
          // 	return ture
          // else{
          // 	return{
          // 		valid:false,
          // 		message:"Geçersiz"
          // 	}
          // }
        } else {
          return {
            valid: false,
            message: 'Geçersiz',
          }
        }
      }
    }
  }

  const columns = [
    {
      dataField: 'id',
      text: 'Parametreler',
    },
    {
      dataField: 'ocak',
      text: 'OCAK',
      align: 'center',
      editable: () => {
        if (months.includes('01')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('01')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'subat',
      text: 'SUBAT',
      align: 'center',
      editable: () => {
        if (months.includes('02')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('02')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'mart',
      text: 'MART',
      align: 'center',
      editable: () => {
        if (months.includes('03')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('03')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'nisan',
      text: 'NISAN',
      align: 'center',
      editable: () => {
        if (months.includes('04')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('04')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'mayis',
      text: 'MAYIS',
      align: 'center',
      editable: () => {
        if (months.includes('05')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('05')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'haziran',
      text: 'HAZIRAN',
      align: 'center',
      editable: () => {
        if (months.includes('06')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('06')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'temmuz',
      text: 'TEMMUZ',
      align: 'center',
      editable: () => {
        if (months.includes('07')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('07')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'agustos',
      text: 'AGUSTOS',
      align: 'center',
      editable: () => {
        if (months.includes('08')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('08')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'eylul',
      text: 'EYLUL',
      align: 'center',
      editable: () => {
        if (months.includes('09')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('09')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'ekim',
      text: 'EKIM',
      align: 'center',
      editable: () => {
        if (months.includes('10')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('10')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'kasim',
      text: 'KASIM',
      align: 'center',
      editable: () => {
        if (months.includes('11')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('11')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
    {
      dataField: 'aralik',
      text: 'ARALIK',
      align: 'center',
      editable: () => {
        if (months.includes('12')) return false
        else return true
      },
      style: (cell, row, rowIndex, colIndex) => {
        if (months.includes('12')) {
          if (rowIndex % 2 === 0) {
            return {
              backgroundColor: '#7E7E7E',
            }
          }
          return {
            backgroundColor: '#B0B0B0',
          }
        }
      },
      validator: validation.bind(this),
    },
  ]
  const CaptionElement = () => (
    <h3 style={{ borderRadius: '0.25em', textAlign: 'center', padding: '0.5em' }}>{`${selectedNumuneKodu || 'Num Kod'} - ${selectedBolge || 'Bölge'} - ${
      selectedYer || 'Yer'
    } - ${selectedYil || 'Yıl'}`}</h3>
  )

  const veriGonder = () => {
    setIsLoading(true)
    setShowAlert(true)
    axiosInstance
      .post('/veriGirisi', {
        ...parametreOptionsState,
        bolge_adi: selectedBolge,
        yer: selectedYer,
        date: selectedYil,
        table_type: locationType,
      })
      .then(function (response) {
        setAlert({
          hasAlert: true,
          isSucces: true,
          isInfo: false,
          isError: false,
          message: 'Veri tabanına başarıyla eklendi.',
        })
        const parametreOptions = []
        parametreler.map((parametre) =>
          parametreOptions.push({
            id: parametre,
            ocak: null,
            subat: null,
            mart: null,
            nisan: null,
            mayis: null,
            haziran: null,
            temmuz: null,
            agustos: null,
            eylul: null,
            ekim: null,
            kasim: null,
            aralik: null,
          })
        )
        setParametreOptions(parametreOptions)
        setSelectedBolge('')
        setSelectedYer('')
        setSelectedNumuneKodu('')
        setSelectedYil('')
        setIsLoading(false)
        setIsClicked(false)
      })
      .catch(function (error) {
        setAlert({
          hasAlert: true,
          isSucces: false,
          isInfo: false,
          isError: true,
          message: error.response.status === 404 ? 'Uygun formatta veri girişi yapınız.' : 'Server kaynaklı hatadan dolayı veri girişi yapılamadı.',
        })
        setIsLoading(false)
      })
  }

  async function fetchAylar(selectedYil) {
    const { data } = await axiosInstance.get(`/locations/${locationType}/${selectedBolge}/${selectedYer}/${selectedYil}`)
    const mdata = await data
    setMonths(mdata['months'])
    setSelectedNumuneKodu(mdata['numune_adi'])
  }

  async function fetchYillar(e) {
    let yer = e
    const { data } = await axiosInstance.get(`/locations/${locationType}/${selectedBolge}/${yer}/Sıcaklık/`)
    setYillar(data.sort())
  }

  function handleBlurYil(f, e) {
    if (selectedYil < Number(yillar[0]) || selectedYil > Number(yillar[yillar.length - 1]) + 1) {
      setSelectedYil('')
      setShowYil(true)
    } else {
      setShowYil(false)
    }
  }

  return (
    <div>
      <Container fluid className={'dropdownContainer'}>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4} xl={4}>
            {bolgeAdlari.length !== 0 ? (
              <SelectSearch
                options={BolgeOptions}
                search
                value={selectedBolge || ''}
                emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Aradığınız Seçenek Bulunamadı.</div>}
                placeholder="Bölge"
                filterOptions={fuzzySearch}
                onChange={(e) => {
                  setSelectedBolge(e)
                  fetchYer(e)
                  setSelectedYer('')
                  setSelectedNumuneKodu('')
                  setSelectedYil('')
                  setIsClicked(false)
                  setShowAlert(false)
                }}
              />
            ) : (
              <Container>
                <Row style={{ alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Spinner className={'select-search'} animation="border" variant="primary" />
                </Row>
              </Container>
            )}
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <SelectSearch
              options={YerOptions}
              search
              value={selectedYer || ''}
              emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Aradığınız Seçenek Bulunamadı.</div>}
              placeholder="Yer"
              filterOptions={fuzzySearch}
              onChange={(e) => {
                setSelectedYer(e)
                setSelectedNumuneKodu('')
                setSelectedYil('')
                setIsClicked(false)
                fetchYillar(e)
                setShowAlert(false)
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <InputGroup ref={targetYil} className="mb-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              <InputGroup.Prepend>
                <InputGroup.Text>Yıl</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={(e) => {
                  setSelectedYil(e.target.value)
                  setSelectedNumuneKodu('')
                  setIsClicked(false)
                  setShowAlert(false)
                }}
                value={selectedYil || ''}
                onBlur={handleBlurYil.bind(this)}
              />
            </InputGroup>
            <Overlay target={targetYil.current} show={showYil} placement="bottom">
              {({ placement, arrowProps, show: _showYil, popper, ...props }) => (
                <div
                  {...props}
                  style={{
                    backgroundColor: 'rgba(255, 100, 100, 0.85)',
                    margin: '.3rem 0rem',
                    padding: '8px 16px',
                    color: 'white',
                    borderRadius: 3,
                    width: '300px',
                    boxShadow: '0 .0625rem .125rem rgba(0, 0, 0, 0.15)',
                    ...props.style,
                  }}>
                  Uygun yıl giriniz.
                </div>
              )}
            </Overlay>
          </Col>
        </Row>
      </Container>
      <Row className={'button-container'}>
        <ButtonGroup aria-label="Basic example">
          <Button
            onClick={() => {
              setIsClicked(true)
              fetchAylar(selectedYil)
            }}
            style={{ maxWidth: '10rem', fontWeight: '500', fontSize: '15px' }}
            disabled={!selectedBolge || !selectedYer || !selectedYil}>
            Tabloyu Getir
          </Button>
        </ButtonGroup>
      </Row>
      <Container>
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} variant="outline-primary">
            Kurallar
          </Button>
        </Container>
        <Collapse in={open}>
          <Card id="example-collapse-text" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
            <Card.Body className="text-center">
              Girilen değerler <strong>harf</strong>, nokta dışında <strong>noktalama işaretleri</strong>, <strong>boşluk</strong> ve{' '}
              <strong>özel karakterler</strong> {`(&,@,#,% vs.)`} <strong>içeremez.</strong>
              <br></br>
              Eksi değer girmek için değerin başına "-" koymalısınız. Kesirli sayı girmek için "." kullanmalısınız.
              <br></br>"{`<`}" veya "{`>`}" karakterlerini <strong>sadece sayıdan önce</strong> koymalısınız.
            </Card.Body>
          </Card>
        </Collapse>
        <div>
          {alert.hasAlert && showAlert ? (
            <Alert style={{ marginTop: '2rem' }} variant={alert.isSucces ? 'success' : 'danger'}>
              {alert.message}
            </Alert>
          ) : (
            ''
          )}
        </div>
      </Container>
      {isClicked ? (
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12} xl={12} id="dataCard">
              <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                <BootstrapTable
                  caption={<CaptionElement />}
                  keyField="id"
                  columns={columns}
                  data={parametreOptionsState}
                  bootstrap4={true}
                  striped={true}
                  bordered={true}
                  hover={true}
                  condensed={true}
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: false,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      setParametreOptions((previousParametreOptions) => {
                        return previousParametreOptions.map((object) => (object.id === row.id ? row : object))
                      })
                    },
                  })}
                />
                <hr />
                <Button onClick={veriGonder} variant={'outline-info'} disabled={!selectedBolge || !selectedYer || !selectedYil || !selectedNumuneKodu}>
                  {isLoading ? <Spinner animation="border" /> : 'Gönder'}
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <></>
      )}
    </div>
  )
}

export default DataEntry
