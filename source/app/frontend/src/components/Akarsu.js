import React,{useEffect,useState} from "react";
import GraphContainer from "./GraphContainer";
import bolgeler from  '../bolgeler'
import {Row,Col,Container,ButtonGroup,Button} from 'react-bootstrap'
import axios from 'axios'
import SelectSearch from 'react-select-search'
const Akarsu = (props) => {
  let locationType = "Akarsu"
  const [Locations, setLocations] = useState()
  const [bolgeAdlari, setBolgeAdlari] = useState([])
  const [yerAdlari, setYerAdlari] = useState([])
  const [parametreler, setParametreler] = useState([])
  //-----------------
  const [selectedBolge, setSelectedBolge] = useState()
  const [selectedYer, setSelectedYer] = useState()
  const [selectedParametre,setSelectedParametre] = useState()
  const [selectedYil, setSelectedYil] = useState()

  const [queryInfo, setQueryInfo] = useState(props.query)
  
  useEffect(() => {
   
    async function fetchLocations(){
      let bolgearray = []
      let yerArray = []
      const {data} = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}`)
      setLocations(data)
      data.map( bolge => {
        bolgearray.push(bolge[0]);
        yerArray.push(bolge[1])
      })
      

      let uniqeler = [...new Set(bolgearray)]
      setBolgeAdlari(uniqeler.sort())
      uniqeler = [...new Set(yerArray)]
      setYerAdlari(uniqeler.sort())
    }
    async function fetchParameters(){
      let parametreArray = []
      const {data} = await axios.get('http://127.0.0.1:8000/api/readingtypes/')
      
      data.map( parametre => {
        parametreArray.push(parametre.name);
      })
      setParametreler(parametreArray)

    }
    fetchLocations()
    fetchParameters()
  
  }, [])
  const BolgeOptions = [];
  const YerOptions = [];
  const parametreOptions = [];
  let yilOptions = [];
  bolgeAdlari.map( bolge => BolgeOptions.push({name: bolge, value:bolge}) ) 
  yerAdlari.map( yer => YerOptions.push({name: yer, value:yer}) ) 
  parametreler.map( parametre =>parametreOptions.push({name: parametre, value:parametre}))
  parametreOptions.splice(0,0,{name:"Hepsi", value:"all"})
  const yillar = ["2009","2010","2011","2012","2013","2014","2015","2016"];

  yillar.forEach( yil =>yilOptions.push({name:yil, value:yil}))
  yilOptions.splice(0,0,{name:"Hepsi", value:"all"})
  
  const showInfo = (chartType) =>{
    let temparray = [chartType,selectedBolge,selectedYer,selectedParametre,selectedYil]
    setQueryInfo(temparray)
  }
  return (
   <>
    <Container fluid className={"dropdownContainer"}>
    <Row>
      <Col  xs={12} sm={12} md={6} lg={3} xl={3} >
     {bolgeAdlari.length !== 0 ? (
        <SelectSearch
        options={BolgeOptions}
        search
        emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Not found renderer</div>}
        placeholder="Bölge"
        onChange={(e) => setSelectedBolge(e)}
    />
     ) : null}
      </Col>
      <Col  xs={12} sm={12} md={6} lg={3} xl={3}>
      <SelectSearch
        options={YerOptions}
        search
        emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Not found renderer</div>}
        placeholder="Yer"
        onChange={(e) => setSelectedYer(e)}
    />
      </Col>
      <Col  xs={12} sm={12} md={6} lg={3} xl={3}>
      <SelectSearch
        options={parametreOptions}
        search
        emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Not found renderer</div>}
        placeholder="Parametre"
        onChange={(e) => setSelectedParametre(e)}
    />
      </Col>
      <Col  xs={12} sm={12} md={6} lg={3} xl={3}>
      <SelectSearch
        options={yilOptions}
        search
        emptyMessage={() => <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Not found renderer</div>}
        placeholder="Yıl"
        onChange={(e) => setSelectedYil(e)}
    />
      </Col>
      
    </Row>
    
    </Container>
    <Row className={"button-container"}>
         <ButtonGroup aria-label="Basic example">
            <Button onClick={() => showInfo("Bar")} style={{fontWeight:"500", fontSize:"15px"}}>Bar</Button>
            <Button onClick={() => showInfo("Cizgi")} style={{fontWeight:"500", fontSize:"15px"}} >Çizgi</Button>
            <Button onClick={() => showInfo("Tablo")} style={{fontWeight:"500", fontSize:"15px"}} >Tablo</Button>
        </ButtonGroup>
    </Row>
    
    <Container>
     {queryInfo.length !== 0 ?  (
        <GraphContainer queries={queryInfo}/>
     ) : null}
    </Container>
   </>
  );
};
Akarsu.defaultProps = {
  query: [],
}

export default Akarsu;
