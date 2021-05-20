import React,{useState,useEffect} from 'react'
import { Bar } from "react-chartjs-2";


const AllYears = (props) => {
    console.log(props.data);
    const [data,setData] = useState({})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
       
    setLoading(false)
   
   
    const dataSETS = []
    const hoverColors = ["rgba(52, 92, 96, 1)", "rgba(60, 48, 89, 1)", "rgba(204, 68, 68, 1)", "rgba(226, 180, 100, 1)", "rgba(182, 216, 107, 1)", "rgba(103, 155, 163, 1)", "rgba(36, 102, 112, 1)", "rgba(156, 214, 190, 1)", "rgba(219, 105, 105, 1)", "rgba(163, 103, 131, 1)", "rgba(255, 175, 59, 1)", "rgba(182, 73, 38, 1)"]
    const colors =["rgba(42, 82, 86, 1)", "rgba(60, 48, 89, 1)", "rgba(204, 68, 68, 1)", "rgba(226, 180, 100, 1)", "rgba(182, 216, 107, 1)", "rgba(103, 155, 163, 1)", "rgba(36, 102, 112, 1)", "rgba(156, 214, 190, 1)", "rgba(219, 105, 105, 1)", "rgba(163, 103, 131, 1)", "rgba(255, 175, 59, 1)", "rgba(182, 73, 38, 1)"]
    Object.entries(props.data.reading_value).map( (ay,index) =>{
        dataSETS.push(
            {
            label: `${ay[0]}`,
            data: ay[1],
            backgroundColor: colors[index],
            borderColor: "transparent",
            borderWidth: 2,
            hoverBackgroundColor: hoverColors[index],
            hoverBorderColor: "#3e95cd",
            
            fill: false,
          }
       )
        
    })
   
    setData({ 
       
        labels: props.data.date,
        datasets:dataSETS
})
    }, [])
    
    const options = {
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
                fontSize:14
            },
            
          }]
        },
        
    
      };
     
    return (
        <>
       {
           loading ? <h1>Loading</h1> :
           (
            <Bar
            id={props.id}
            data={data}
            width={null}
            height={null}
            options={options}
          />
           )
       }
       </>
    )
}

export default AllYears
