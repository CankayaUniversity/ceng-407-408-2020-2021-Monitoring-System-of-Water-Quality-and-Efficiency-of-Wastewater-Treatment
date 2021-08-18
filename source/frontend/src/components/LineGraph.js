import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const LineGraph = ({ id, data, label, unit, months, is_all, yillar }) => {
  const [chartData, setChartData] = useState({})
  const chart = () => {
    setChartData({
      labels: convertMonths(months),
      datasets: [
        {
          label: label + ' - ' + unit,
          data: data,
          fill: false,
          backgroundColor: 'rgba(103, 155, 163, 1)',
          borderColor: 'rgba(50, 150, 250, 0.8)',
        },
      ],
    })
  }

  useEffect(() => {
    chart()
  }, [])
  const convertMonths = (months) => {
    const labels = []
    months.map((month, index) => {
      switch (month) {
        case '01':
          labels.push(`${is_all ? yillar[index] : ''} Ocak`)
          break
        case '02':
          labels.push(`${is_all ? yillar[index] : ''} Şubat`)
          break
        case '03':
          labels.push(`${is_all ? yillar[index] : ''} Mart`)
          break
        case '04':
          labels.push(`${is_all ? yillar[index] : ''} Nisan`)
          break
        case '05':
          labels.push(`${is_all ? yillar[index] : ''} Mayıs`)
          break
        case '06':
          labels.push(`${is_all ? yillar[index] : ''} Haziran`)
          break
        case '07':
          labels.push(`${is_all ? yillar[index] : ''} Temmuz`)
          break
        case '08':
          labels.push(`${is_all ? yillar[index] : ''} Ağutos`)
          break
        case '09':
          labels.push(`${is_all ? yillar[index] : ''} Eylül`)
          break
        case '10':
          labels.push(`${is_all ? yillar[index] : ''} Ekim`)
          break
        case '11':
          labels.push(`${is_all ? yillar[index] : ''} Kasım`)
          break
        case '12':
          labels.push(`${is_all ? yillar[index] : ''} Aralık`)
          break
        default:
          break
      }
    })
    return labels
  }
  function findMin(){
    if (Math.min(...data) >= 0)
      return 0
    else
      return (Math.min(...data) - ((Math.max(...data) - Math.min(...data)) / 10))
  }
  return (
    <>
      <Line
        id={id}
        data={chartData}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: true,
                  color: 'rgba(0,0,0,0.1)',
                },
                scaleLabel: {
                  display: true,
                  labelString: unit,
                  fontSize: 18,
                },
                ticks: {
                  stepSize: (Math.max(...data) - Math.min(...data)) / 10,
                  min: findMin(),
                  max: Math.max(...data) + ((Math.max(...data) - Math.min(...data)) / 10),
                  fontSize: 14,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: true,
                },
                ticks: {
                  fontSize: 14,
                },
              },
            ],
          },
        }}
      />
    </>
  )
}

export default LineGraph
