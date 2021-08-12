import React,{useState,useEffect} from 'react'
import {Bar} from "react-chartjs-2";
import ModalForm from './ModalForm'
import {Button} from 'react-bootstrap'

const BarGraph = ({id,data,label,unit,colors,months,submitReferans, is_all,yillar , isParameterAll}) => {
    const [chartData,setChartData] = useState({})
    // const [colorsState, setColorsState] = useState(colors)
    // const [isOpen, setIsOpen] = useState(false)
    // const openModal = () => setIsOpen(true)
    // const closeModal = () => setIsOpen(false)
    // const  handleSubmit =(comingData) => {
    //     let customColors =[]
    //     data.map(dataItem => {
    //         if(dataItem == null || dataItem == undefined)
    //             customColors.push("rgb(0, 0, 0)")
    //         else if(dataItem <= comingData.birinci)
    //             customColors.push("rgb(102, 209, 242)")
    //         else if(dataItem <= comingData.ikinci)
    //             customColors.push("rgb(197, 218, 141)")     
    //         else if(dataItem <= comingData.ucuncu)
    //             customColors.push("rgb(240, 221, 137)") 
    //         else
    //             customColors.push("rgb(245, 103, 126)")                     
    //     })
    //     console.log(customColors)
    //     setColorsState([...customColors])
    //     submitReferans(comingData)
    //     setIsOpen(false)
    // }
    const chart =  ()=>{
        setChartData({
            labels: convertMonths(months),
            datasets: [{
                //label: label + " - " + unit + " ( mg/L )",
                label: label ,
                backgroundColor: colors === null ? ["rgba(52, 92, 96, 1)", "rgba(60, 48, 89, 1)", "rgba(204, 68, 68, 1)", "rgba(226, 180, 100, 1)", "rgba(182, 216, 107, 1)", "rgba(103, 155, 163, 1)", "rgba(36, 102, 112, 1)", "rgba(156, 214, 190, 1)", "rgba(219, 105, 105, 1)", "rgba(163, 103, 131, 1)", "rgba(255, 175, 59, 1)", "rgba(182, 73, 38, 1)"] : colors,
                borderColor: "transparent",
                borderWidth: 2,
                // hoverBackgroundColor: ["rgba(52, 92, 96, 1)", "rgba(60, 48, 89, 1)", "rgba(204, 68, 68, 1)", "rgba(226, 180, 100, 1)", "rgba(182, 216, 107, 1)", "rgba(103, 155, 163, 1)", "rgba(36, 102, 112, 1)", "rgba(156, 214, 190, 1)", "rgba(219, 105, 105, 1)", "rgba(163, 103, 131, 1)", "rgba(255, 175, 59, 1)", "rgba(182, 73, 38, 1)"],
                // hoverBorderColor: "#3e95cd",
                data: data,
                fill: false,

            }]
        })

    }

    useEffect(()=>{
        chart()

    },[])
   
    const convertMonths = (months) =>{
        const labels = []
        months.map( (month, index) => {
           switch (month) {
               case "01":
                   labels.push(`${is_all ? yillar[index]: "" } Ocak`)
                   break;
                case "02":
                    labels.push(`${is_all ? yillar[index]: "" } Şubat`)
                    break;
                case "03":
                    labels.push(`${is_all ? yillar[index]: "" } Mart`)
                    break;
                case "04":
                    labels.push(`${is_all ? yillar[index]: "" } Nisan`)
                    break;
                case "05":
                    labels.push(`${is_all ? yillar[index]: "" } Mayıs`)
                    break;
                case "06":
                    labels.push(`${is_all ? yillar[index]: "" } Haziran`)
                    break;
                case "07":
                    labels.push(`${is_all ? yillar[index]: "" } Temmuz`)
                    break;
                case "08":
                    labels.push(`${is_all ? yillar[index]: "" } Ağutos`)
                    break;
                case "09":
                    labels.push(`${is_all ? yillar[index]: "" } Eylül`)
                    break;
                case "10":
                    labels.push(`${is_all ? yillar[index]: "" } Ekim`)
                    break;
                case "11":
                    labels.push(`${is_all ? yillar[index]: "" } Kasım`)
                    break;
                case "12":
                    labels.push(`${is_all ? yillar[index]: "" } Aralık`)
                    break;
               default:
                   break;
           }
       })
       return labels;

    }
    return (
        <>
              <Bar id={id} data={chartData}
                          options={{
                              maintainAspectRatio: false,
                              scales: {
                                  yAxes: [{
                                      stacked: true,
                                      gridLines: {
                                          display: true,
                                          color: "rgba(0,0,0,0.1)"
                                      },
                                      scaleLabel: {
                                          display: true,
                                          labelString: unit,
                                          fontSize: 18
                                      },
                                      ticks:{

                                          stepSize: 5
                                      }

                                  }],
                                  xAxes: [{
                                      gridLines: {
                                          display: true
                                      } ,
                                      ticks:{
                                        fontSize:14
                                    },

                                  }],
                                  yAxes: [{
                                    gridLines: {
                                        display: true
                                    } ,
                                    ticks:{
                                      min: Math.min(...data) - Math.min(...data) * 0.2,
                                      max:Math.max(...data) + Math.max(...data) * 0.2,
                                      fontSize:14
                                  },

                                }]
                              },



                          }}/>
                          <div>
        {/* other components */}

        {/* { !isParameterAll ? <Button onClick={openModal} variant="outline-info" size="sm">Referans Aralıklarını Özelleştir</Button> : ""} 

        { isOpen ? 
          <ModalForm 
            closeModal={closeModal} 
            isOpen={isOpen} 
            handleSubmit={handleSubmit}
          /> 
          : 
          null 
        } */}
      </div>

        </>
    )
}

export default BarGraph
