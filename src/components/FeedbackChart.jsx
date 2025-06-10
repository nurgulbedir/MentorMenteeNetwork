import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeedbackChart = ({ feedbackData }) => {
  // Örnek geri bildirim verileri: { puan: sayı } şeklinde
  // Örneğin: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 3 }]

  // Puanları saymak için bir fonksiyon
  const countRatings = (data) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(item => {
      if (item.rating >= 1 && item.rating <= 5) {
        counts[item.rating]++;
      }
    });
    return counts;
  };

  const ratingCounts = countRatings(feedbackData);

  const data = {
    labels: ['1 Yıldız', '2 Yıldız', '3 Yıldız', '4 Yıldız', '5 Yıldız'],
    datasets: [
      {
        label: 'Geri Bildirim Puanları',
        data: Object.values(ratingCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Geri Bildirim Puanları Dağılımı',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
            display: true,
            text: 'Sayısı'
        }
      },
      x: {
        title: {
            display: true,
            text: 'Puan'
        }
      }
    }
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FeedbackChart; 