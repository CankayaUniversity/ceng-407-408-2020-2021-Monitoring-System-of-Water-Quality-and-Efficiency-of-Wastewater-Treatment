import React, { useEffect,useState } from "react";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";
import { Row, Col, Card, Spinner,Container, Button} from "react-bootstrap";
import axios from "axios";
import Table from './Table'
import AllYears from "./AllYears";
import domToPdf from 'dom-to-pdf';
import MapView from './MapView'

const GraphContainer = (props) => {
  // path('api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil>/',views.getSpecificReading,name="spesific"),
  const [data,setData] = useState()
  const [tarih,setTarih] = useState([])
  const [yillar, setYillar] = useState()
  const [values,setValues] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAll, setisAll] = useState(false)
  const [isParameterAll, setIsParameterAll]= useState(false)
  const [isYearAll, setIsYearAll]= useState(false)
  const [queries, setQueries]=useState(props.queries)
  const [isTable, setIsTable] = useState(false)
  
  useEffect(() => {
    setIsParameterAll(queries[3] === "all")
    setIsYearAll(queries[4][0] === "all" || queries[4].length === 2)
    console.log(queries[4])
    async function fetchData() {
      let tarihArray = [];
      let valueArray = [];
      let yıllarArray = [];
      const queries4 = queries[4].length > 1 ? queries[4][0] +"/"+ queries[4][1] : queries[4][0]
      console.log(`http://127.0.0.1:8000/api/reading/${queries[1]}/${queries[2]}/${queries[3]}/${queries4}`);
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/reading/${queries[1]}/${queries[2]}/${queries[3]}/${queries4}`
      ).catch(error => console.log(error));
      setData(data)
      if(queries[3] === "all"){
        data[0].date.forEach(element => {
          tarihArray.push(element.slice(5,7));
         });
      }
      else if(queries[4] === "all"){
       
      }
      else{
        data.date.map( item => {tarihArray.push(item.slice(5,7)); yıllarArray.push(item.slice(0,4));  valueArray.push(item);})
      }
      setTarih(tarihArray)
      setValues(valueArray)
      setYillar(yıllarArray)
      setIsTable(queries[0] === "Tablo" ? true : false)
      setLoading(false)
      
      
    }
    fetchData();
   
    
    
  }, [props.queries]);

  useEffect(()=>{
    setQueries(props.queries)
  },[props.queries])
  const generatePdf = () => {

    const element = document.getElementById('pdfCard');

    const options = {
      filename: "test.pdf",
      compression: "FAST",
      overrideWidth: 1440
    };

    return domToPdf(element, options, () => {
      // callback function
    });
  }
  
  return (
    <>
     {
         loading ?  <Container><Row style={{height:"70vh",justifyContent:"center", alignItems:"center"}} ><Spinner animation="border" variant="primary" /></Row></Container> :
           <Row >
         {  
              <Col sm={12} md={12} lg={12} xl={12} id="pdfCard" >
                {
                      
                      isParameterAll && queries[0] !== "Tablo" ? 
                           (
                               
                             data.map( (item)=>(
                              <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
                                
                                <BarGraph data={item.reading_value}  label={`${item.location.numune_adi} - ${item.location.bolge_adi} - ${item.location.yer} - ${item.reading_type.name}`} color={"rgba(50,150,250,1)"} months={tarih} />
                             </Card>
                             ))
                           

                           )
                      
                      :
                    isYearAll && queries[0] !== "Tablo" ? (
                      <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
                        <h6 style={{textAlign:"center"}}>{`${data.location.bolge_adi} - ${data.location.yer} - ${data.reading_type.name} - ( ${data.date[0]} - ${data.date[data.date.length-1]} )`}</h6>
                       <AllYears data={data}/>
                       </Card>
                    ):
                        (
                         queries[0] === "Cizgi" ? (
                          <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
                           <LineGraph data={data.reading_value} label={`${queries[1]} - ${queries[2]} - ${queries[4]}` } unit={`${queries[3]}`} color={"rgba(50,150,250,1)"} months={tarih} is_all={isAll} yillar={yillar}/>
                           </Card>
                      ) : queries[0] == "Bar" ? (
                        <>
                          <Col sm={12} md={12} lg={12} xl={12}>
                           <Card  className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
                             <BarGraph data={data.reading_value} label={`${queries[1]} - ${queries[2]} - ${queries[4]}` } unit={`${queries[3]}`} color={"rgba(50,150,250,1)"} months={tarih} is_all={isAll} yillar={yillar}/>
                          </Card>
                          </Col>
                          <Col sm={12} md={12} lg={12} xl={12}>
                              <MapView specificLocation={ {"bolgeAdi":"Göcek", "yeradi":"Sarısu Deresi", "position": [38.9232,28.0518]}}/>
                          </Col>
                         </>
                         
                      ) : (
                        <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
                               <Table queries={queries} data={data} />
                          </Card>
                      )
                        )
                      
                   }
                   <Button variant="info" onClick={generatePdf}>Export JPG</Button>
              
             </Col>
         }
         </Row>
       
     }
    </>
  );
};

export default GraphContainer;
