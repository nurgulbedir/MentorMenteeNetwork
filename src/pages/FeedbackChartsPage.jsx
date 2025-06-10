import React from 'react';
import FeedbackChart from '../components/FeedbackChart'; // FeedbackChart bileşenini içe aktarıyorum
import { db } from '../firebase'; // Firebase db'yi içe aktarıyorum
import { collection, query, getDocs } from 'firebase/firestore'; // Firestore metodlarını içe aktarıyorum
import { useState, useEffect } from 'react'; // useState ve useEffect'i içe aktarıyorum

const FeedbackChartsPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const feedbackCollectionRef = collection(db, 'feedback');
        const q = query(feedbackCollectionRef);
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => doc.data());
        setFeedbackData(data);
      } catch (err) {
        console.error("Geri bildirim verileri çekilirken hata oluştu:", err);
        setError("Geri bildirim verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  // Eğer Firebase'den gerçek veriler çekilmezse, örnek verileri kullanabiliriz.
  // Bu kısım sadece geliştirme aşamasında veya veri yoksa kullanılabilir.
  const sampleFeedbackData = [
    { rating: 5 },
    { rating: 4 },
    { rating: 5 },
    { rating: 3 },
    { rating: 2 },
    { rating: 5 },
    { rating: 4 },
    { rating: 1 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Geri bildirim verileri yükleniyor...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Geri Bildirim Puanları Grafiği</h1>
      {feedbackData.length > 0 ? (
        <FeedbackChart feedbackData={feedbackData} />
      ) : (
        <p style={{ textAlign: 'center' }}>Henüz gösterilecek geri bildirim verisi bulunmamaktadır.</p>
      )}
      <hr style={{ margin: '40px 0' }} />
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Örnek Geri Bildirim Grafiği (Veri yoksa)</h2>
      <FeedbackChart feedbackData={sampleFeedbackData} /> {/* Örnek veri ile yedek grafik */}
    </div>
  );
};

export default FeedbackChartsPage; 