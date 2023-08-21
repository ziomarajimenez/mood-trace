'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
)

const moodMap = {
  happy: 1,
  sad: 2,
  neutral: 3,
  angry: 4
}

const options = {
  scales: {
    y: {
      grid: { color: 'black' },
      beginAtZero: true,
      ticks: {
        color: 'black',
        callback: function (value, index) {
          if (this.getLabelForValue(value) == 1) {
            return 'happy'
          } else if (this.getLabelForValue(value) == 2) {
            return 'sad'
          } else if (this.getLabelForValue(value) == 3) {
            return 'neutral'
          } else if (this.getLabelForValue(value) == 4) {
            return 'angry'
          }
        },
        font: {
          family: 'Poppins'
        }
      }
    },
    x: {
      border: { color: 'black'},
      zeroLineColor: 'black',
      grid: { color: 'black' },
      ticks: {
        color: 'black',
        font: {
          family: 'Poppins'
        }
      }
    }
  },
  elements: {
    line: {
      borderColor: 'rgba(101, 95, 177, 1)',
      tension: 0.1,
      borderWith: 2
    }
  }
}

export default function LinearChart ({moods}) {
  const labels = moods.map(mood => mood.created_at.slice(-2))
  const values = moods.map(mood => moodMap[mood.mood])
  return (
    <div className="w-full">
        <Line
            options={options}
            data={{
              labels: labels,
              datasets: [
                {
                  fill: 'true',
                  data: values,
                  backgroundColor: 'rgba(101, 95, 177, 1)'
                }
              ]
            }}
        />
    </div>
  )
}
