import React, { useEffect, useState, useRef } from 'react'
import LineGraph from './LineGraph'
import BarGraph from './BarGraph'
import { Row, Col, Card, Spinner, Container, Button, Popover, OverlayTrigger } from 'react-bootstrap'
import { CSVLink } from 'react-csv'
import axiosInstance from '../axios'
import Table from './Table'
import AllYears from './AllYears'
import { saveAs } from 'file-saver'
import MapView from './MapView'

const GraphContainer = (props) => {
  const [data, setData] = useState()
  const [tarih, setTarih] = useState([])
  const [yillar, setYillar] = useState()
  const [loading, setLoading] = useState(true)
  const [isAll, setisAll] = useState(false)
  const [isParameterAll, setIsParameterAll] = useState(false)
  const [isYearAll, setIsYearAll] = useState(false)
  const [queries, setQueries] = useState(props.queries)

  const [isTahminiLoading, setiIsTahminiLoading] = useState(false)
  const [tahminiData, setTahminiData] = useState({})
  const [isYearAllCheck, setIsYearAllCheck] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const [csvData, setCsvData] = useState('')
  const csvLink = useRef()

  useEffect(() => {
    setIsParameterAll(queries[3] === 'all')
    setIsYearAll(queries[4][0] === 'all' || queries[4].length === 2)
    setIsYearAllCheck(queries[4][0] === 'all')
    async function fetchData() {
      let tarihArray = []
      let yıllarArray = []
      const queries4 = queries[4].length > 1 ? queries[4][0] + '/' + queries[4][1] : queries[4][0]
      const { data } = await axiosInstance
        .get(`/reading/${queries[1]}/${queries[2]}/${queries[3]}/${queries4}`)
        .catch((error) => console.log(error))
      setData(data)
      if (queries[3] === 'all') {
        data[0].date.forEach((element) => {
          tarihArray.push(element.slice(5, 7))
        })
      } else if (queries[4] === 'all') {
      } else {
        data.date.map((item) => {
          tarihArray.push(item.slice(5, 7))
          yıllarArray.push(item.slice(0, 4))
        })
      }
      setTarih(tarihArray)
      setYillar(yıllarArray)
      setLoading(false)
    }
    fetchData()
  }, [props.queries])

  useEffect(() => {
    setQueries(props.queries)
  }, [props.queries])

  const getColor = (sinif) => {
    switch (sinif) {
      case 1:
        return 'rgb(100, 210, 240)'
      case 2:
        return 'rgb(200, 220, 140)'
      case 3:
        return 'rgb(240, 220, 135)'
      case 4:
        return 'rgb(245, 180, 100)'
      case 5:
        return 'rgb(245, 100, 125)'
    }
  }
  const popover = (referans) => (
    <Popover id="popover-basic">
      <Popover.Content>
        <div style={{ fontWeight: 'bolder', letterSpacing: '1px' }}>Referans Aralığı</div>
        <hr></hr>
        {referans?.length > 0 ? (
          queries[3] === 'Çözünmüş Oksijen' ? (
            <div>
              <p>
                {`1. Sınıf - >${referans[0]} `}
                <span style={{ backgroundColor: getColor(1), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
              </p>
              {referans[1] === undefined ? (
                <p>
                  {`2. Sınıf - <${referans[0]} `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                <p>
                  {`2. Sınıf - ${referans[0]}-${referans[1]} `}
                  <span style={{ backgroundColor: getColor(2), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[2] === undefined ? (
                referans[1] === undefined ? (
                  ''
                ) : (
                  <p>
                    {`3. Sınıf - <${referans[1]} `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                  {`3. Sınıf - ${referans[1]}-${referans[2]} `}
                  <span style={{ backgroundColor: getColor(3), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] === undefined ? (
                referans[2] === undefined ? (
                  ''
                ) : (
                  <p>
                    {`4. Sınıf - <${referans[2]} `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                  {`4. Sınıf - ${referans[2]}-${referans[3]} `}
                  <span style={{ backgroundColor: getColor(4), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] !== undefined ? (
                <p>
                  {`5. Sınıf - <${referans[3]} `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                ''
              )}
            </div>
          ) : queries[3] === 'pH' ? (
            <div>
              <p>
                {`1. Sınıf - ${7 - referans[0]} - ${7 + referans[0]} `}
                <span style={{ backgroundColor: getColor(1), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
              </p>
              {referans[1] === undefined ? (
                <p>
                {`2. Sınıf - ${7 - referans[0]} - ${7 + referans[0]} dışında `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                <p>
                {`2. Sınıf - ${7 - referans[1]} - ${7 + referans[1]} `}
                  <span style={{ backgroundColor: getColor(2), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[2] === undefined ? (
                referans[1] === undefined ? (
                  ''
                ) : (
                  <p>
                  {`3. Sınıf - ${7 - referans[1]} - ${7 + referans[1]} dışında `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                {`3. Sınıf - ${7 - referans[2]} - ${7 + referans[2]} `}
                  <span style={{ backgroundColor: getColor(3), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] === undefined ? (
                referans[2] === undefined ? (
                  ''
                ) : (
                  <p>
                  {`4. Sınıf - ${7 - referans[2]} - ${7 + referans[2]} dışında `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                {`4. Sınıf - ${7 - referans[3]} - ${7 + referans[3]} `}
                  <span style={{ backgroundColor: getColor(4), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] !== undefined ? (
                <p>
                {`5. Sınıf - ${7 - referans[3]} - ${7 + referans[3]} dışında `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div>
              <p>
                {`1. Sınıf - <${referans[0]} `}
                <span style={{ backgroundColor: getColor(1), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
              </p>
              {referans[1] === undefined ? (
                <p>
                  {`2. Sınıf - >${referans[0]} `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                <p>
                  {`2. Sınıf - ${referans[0]}-${referans[1]} `}
                  <span style={{ backgroundColor: getColor(2), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[2] === undefined ? (
                referans[1] === undefined ? (
                  ''
                ) : (
                  <p>
                    {`3. Sınıf - >${referans[1]} `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                  {`3. Sınıf - ${referans[1]}-${referans[2]} `}
                  <span style={{ backgroundColor: getColor(3), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] === undefined ? (
                referans[2] === undefined ? (
                  ''
                ) : (
                  <p>
                    {`4. Sınıf - >${referans[2]} `}
                    <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                  </p>
                )
              ) : (
                <p>
                  {`4. Sınıf - ${referans[2]}-${referans[3]} `}
                  <span style={{ backgroundColor: getColor(4), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              )}
              {referans[3] !== undefined ? (
                <p>
                  {`5. Sınıf - >${referans[3]} `}
                  <span style={{ backgroundColor: getColor(5), borderRadius: '20px', width: '10px', height: '10px', display: 'inline-block' }}></span>
                </p>
              ) : (
                ''
              )}
            </div>
          )
        ) : (
          'Referans Aralğı Verilmemiştir'
        )}
      </Popover.Content>
    </Popover>
  )

  const saveCanvas = () => {
    if (data.length > 1) {
      data.map((item, index) => {
        const canvasSave = document.getElementById(`graphId-${index}`)
        canvasSave.toBlob(function (blob) {
          saveAs(blob, `${queries[1]}-${queries[2]}-${queries[3]}-${queries[4][0]}.png`)
        })
      })
    } else {
      const canvasSave = document.getElementById('graphId')
      canvasSave.toBlob(function (blob) {
        saveAs(blob, `${queries[1]}-${queries[2]}-${queries[3]}-${queries[4][0]}.png`)
      })
    }
  }
  async function csvIndir() {
    const queries4 = queries[4].length > 1 ? queries[4][0] + '/' + queries[4][1] : queries[4][0]
    await axiosInstance
      .get(`/csv/${queries[1]}/${queries[2]}/${queries4}/`)
      .then((res) => setCsvData(res.data))
      .then(() => csvLink?.current?.link.click())
      .catch((error) => alert(error))
  }
  async function getTahminiVeri() {
    setiIsTahminiLoading(true)
    let tarihArray = []
    await axiosInstance
      .get(`/arima/${props.locationType}/${queries[1]}/${queries[2]}/${queries[3]}/`)
      .then((res) => {
        res.data.date.map((element) => {
          tarihArray.push(element.slice(5, 7))
        })
        setTarih(tarihArray)
        setTahminiData(res.data)
        setiIsTahminiLoading(false)
      })
      .catch((error) => {
        return error.response.status === 406 ? setErrorMessage('Seçilen parametre için tahmini değer bulunmamaktadır.') : ''
      })
  }
  return (
    <>
      {loading ? (
        <Container>
          <Row style={{ height: '70vh', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner animation="border" variant="primary" />
          </Row>
        </Container>
      ) : (
        <Row>
          {
            <Col sm={12} md={12} lg={12} xl={12} id="pdfCard">
              {isParameterAll && queries[0] !== 'Tablo' ? (
                <MapView
                  specificLocation={{
                    bolgeAdi: data[0].location.bolge_adi,
                    yerAdi: data[0].location.yer,
                    position: [data[0].location.dd_east, data[0].location.dd_north],
                  }}
                />
              ) : (
                ''
              )}
              {isParameterAll && queries[0] !== 'Tablo' ? (
                data.map((item, index) => (
                  <OverlayTrigger trigger="hover" placement="right" overlay={popover(item.referans)}>
                    <Card className="my-3 mx-5 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                      {queries[0] === 'Cizgi' ? (
                        <LineGraph
                          id={`graphId-${index}`}
                          data={item.reading_value}
                          label={`${item.location.numune_adi} - ${item.location.bolge_adi} - ${item.location.yer} - ${item.reading_type.name}`}
                          months={tarih}
                        />
                      ) : (
                        <BarGraph
                          id={`graphId-${index}`}
                          data={item.reading_value}
                          label={`${item.location.numune_adi} - ${item.location.bolge_adi} - ${item.location.yer} - ${item.reading_type.name}`}
                          colors={item.colors}
                          months={tarih}
                        />
                      )}
                    </Card>
                  </OverlayTrigger>
                ))
              ) : isYearAll && queries[0] !== 'Tablo' ? (
                <>
                  <OverlayTrigger trigger="hover" placement="right" overlay={popover(data.referans)}>
                    <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                      <h6 style={{ textAlign: 'center' }}>{`${data.location.bolge_adi} - ${data.location.yer} - ${data.reading_type.name} - ( ${
                        data.date[0]
                      } - ${data.date[data.date.length - 1]} )`}</h6>
                      <AllYears id="graphId" data={data} />
                    </Card>
                  </OverlayTrigger>
                  {Object.entries(tahminiData)?.length > 0 ? (
                    <OverlayTrigger trigger="hover" placement="right" overlay={popover(tahminiData.referans)}>
                      <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                        <h6
                          style={{
                            textAlign: 'center',
                          }}>{`Tahmini Değerler - ${data.location.bolge_adi} - ${data.location.yer} - ${data.reading_type.name} - gelecek 10 ay`}</h6>
                        <BarGraph
                          id="graphId"
                          data={tahminiData.reading_value}
                          unit={`${queries[3]}`}
                          colors={tahminiData.colors}
                          months={tarih}
                          is_all={isAll}
                          yillar={yillar}
                        />
                      </Card>
                    </OverlayTrigger>
                  ) : (
                    ''
                  )}
                  {isYearAllCheck && !Object.entries(tahminiData)?.length > 0 ? (
                    <Col sm={12} md={12} lg={12} xl={12}>
                      <Button variant={`${errorMessage ? 'outline-danger' : 'outline-info'}`} block onClick={() => getTahminiVeri()}>
                        {isTahminiLoading && !errorMessage ? <Spinner animation="border" /> : errorMessage ? errorMessage : 'Tahmini Veri'}
                      </Button>
                    </Col>
                  ) : (
                    ''
                  )}
                  <Col sm={12} md={12} lg={12} xl={12}>
                    <MapView
                      specificLocation={{
                        bolgeAdi: data.location.bolge_adi,
                        yerAdi: data.location.yer,
                        position: [data.location.dd_east, data.location.dd_north],
                      }}
                    />
                  </Col>
                </>
              ) : queries[0] === 'Cizgi' ? (
                <>
                  <OverlayTrigger trigger="hover" placement="right" overlay={popover(data.referans)}>
                    <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                      <LineGraph
                        id="graphId"
                        data={data.reading_value}
                        label={`${queries[1]} - ${queries[2]} - ${queries[3]} - ${queries[4]}`}
                        unit={`${queries[3]}`}
                        months={tarih}
                        is_all={isAll}
                        yillar={yillar}
                      />
                    </Card>
                  </OverlayTrigger>
                  <Col sm={12} md={12} lg={12} xl={12}>
                    <MapView
                      specificLocation={{
                        bolgeAdi: data.location.bolge_adi,
                        yerAdi: data.location.yer,
                        position: [data.location.dd_east, data.location.dd_north],
                      }}
                    />
                  </Col>
                </>
              ) : queries[0] === 'Bar' ? (
                <>
                  <OverlayTrigger trigger="hover" placement="right" overlay={popover(data.referans)}>
                    <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                      <BarGraph
                        id="graphId"
                        data={data.reading_value}
                        label={`${queries[1]} - ${queries[2]} - ${queries[3]} - ${queries[4]}`}
                        unit={`${queries[3]}`}
                        colors={data.colors}
                        months={tarih}
                        is_all={isAll}
                        yillar={yillar}
                      />
                    </Card>
                  </OverlayTrigger>
                  <Col sm={12} md={12} lg={12} xl={12}>
                    <MapView
                      specificLocation={{
                        bolgeAdi: data.location.bolge_adi,
                        yerAdi: data.location.yer,
                        position: [data.location.dd_east, data.location.dd_north],
                      }}
                    />
                  </Col>
                </>
              ) : (
                <Card className="my-3 p-3" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                  <Table queries={queries} data={data} />
                  <MapView
                    specificLocation={{
                      bolgeAdi: data[0].location.bolge_adi,
                      yerAdi: data[0].location.yer,
                      position: [data[0].location.dd_east, data[0].location.dd_north],
                    }}
                  />
                </Card>
              )}
              <Col sm={12} md={12} lg={12} xl={12} style={{ marginBottom: '2rem' }}>
                {queries[0] === 'Tablo' ? (
                  <>
                    <Button style={{ marginLeft: '1rem' }} onClick={csvIndir} variant="outline-info">
                      CSV İndir
                    </Button>
                    <CSVLink data={csvData} filename="data.csv" className="hidden" ref={csvLink} target="_blank" />
                  </>
                ) : (
                  <Button onClick={saveCanvas} variant="outline-info">
                    Grafiği indir
                  </Button>
                )}
              </Col>
            </Col>
          }
        </Row>
      )}
    </>
  )
}

export default GraphContainer
