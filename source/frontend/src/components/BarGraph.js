import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'

const BarGraph = ({ id, data, label, unit, colors, months, is_all, yillar }) => {
  const [chartData, setChartData] = useState({})
  const chart = () => {
    setChartData({
      labels: convertMonths(months),
      datasets: [
        {
          label: label,
          backgroundColor:
            colors === null
              ? [
                  'rgba(52, 92, 96, 1)',
                  'rgba(60, 48, 89, 1)',
                  'rgba(204, 68, 68, 1)',
                  'rgba(226, 180, 100, 1)',
                  'rgba(182, 216, 107, 1)',
                  'rgba(103, 155, 163, 1)',
                  'rgba(36, 102, 112, 1)',
                  'rgba(156, 214, 190, 1)',
                  'rgba(219, 105, 105, 1)',
                  'rgba(163, 103, 131, 1)',
                  'rgba(255, 175, 59, 1)',
                  'rgba(182, 73, 38, 1)',
                ]
              : colors,
          borderColor: 'transparent',
          borderWidth: 2,
          data: data,
          fill: false,
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
  return (
    <>
      <Bar
        id={id}
        data={chartData}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                stacked: true,
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
                  stepSize: 5,
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
            yAxes: [
              {
                gridLines: {
                  display: true,
                },
                ticks: {
                  min: Math.min(...data) - Math.min(...data) * 0.2,
                  max: Math.max(...data) + Math.max(...data) * 0.2,
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

export default BarGraph
