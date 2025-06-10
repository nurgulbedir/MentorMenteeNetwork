import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams ve useNavigate'i içe aktarıyorum
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'; // doc ve getDoc'u içe aktarıyorum
import { useAuth } from '../context/AuthContext'; // useAuth'u içe aktarıyorum

const FeedbackPage = () => {
  const { currentUser } = useAuth(); // Mevcut kullanıcıyı alıyorum
  const { userId } = useParams(); // URL'den userId'yi alıyorum
  const navigate = useNavigate(); // Yönlendirme için

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [targetUser, setTargetUser] = useState(null); // Geri bildirim alan kullanıcının bilgileri
  const [loadingTargetUser, setLoadingTargetUser] = useState(true);

  useEffect(() => {
    // Hedef kullanıcının bilgilerini Firestore'dan çekiyorum
    const fetchTargetUser = async () => {
      if (!userId) {
        setSubmitMessage('Geri bildirim verilecek kullanıcı bulunamadı.');
        setLoadingTargetUser(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setTargetUser(userDocSnap.data());
        } else {
          setSubmitMessage('Geri bildirim verilecek kullanıcı bulunamadı.');
        }
      } catch (error) {
        console.error('Hedef kullanıcı bilgisi çekilirken hata oluştu:', error);
        setSubmitMessage('Hedef kullanıcı bilgisi çekilirken bir hata oluştu.');
      } finally {
        setLoadingTargetUser(false);
      }
    };

    fetchTargetUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    if (rating === 0) {
      setSubmitMessage('Lütfen bir puan seçin.');
      return;
    }

    if (!currentUser || !currentUser.uid) {
      setSubmitMessage('Geri bildirim göndermek için oturum açmalısınız.');
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        rating: rating,
        comment: comment,
        feedbackFrom: currentUser.uid, // Oturum açan kullanıcının ID'si
        feedbackTo: userId, // URL'den alınan hedef kullanıcının ID'si
        timestamp: serverTimestamp(),
      });

      setSubmitMessage('Geri bildiriminiz başarıyla gönderildi!');
      setRating(0);
      setComment('');
      // İsteğe bağlı olarak, gönderim sonrası kullanıcıyı başka bir sayfaya yönlendirebiliriz.
      // navigate('/home');
    } catch (error) {
      console.error("Geri bildirim gönderilirken hata oluştu:", error);
      setSubmitMessage('Geri bildirim gönderilirken bir hata oluştu.');
    }
  };

  if (loadingTargetUser) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Kullanıcı bilgileri yükleniyor...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {targetUser ? `${targetUser.fullName || targetUser.email} kişisine Geri Bildirim Ver` : 'Geri Bildirim Ver'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="rating" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Puanınız:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          >
            <option value="0">Puan Seçin</option>
            <option value="1">1 Yıldız</option>
            <option value="2">2 Yıldız</option>
            <option value="3">3 Yıldız</option>
            <option value="4">4 Yıldız</option>
            <option value="5">5 Yıldız</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Yorumunuz (isteğe bağlı):</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            placeholder="Geri bildiriminizi buraya yazın..."
          ></textarea>
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
        >
          Geri Bildirim Gönder
        </button>
        {submitMessage && (
          <p style={{ marginTop: '20px', textAlign: 'center', color: submitMessage.includes('başarıyla') ? 'green' : 'red' }}>
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default FeedbackPage; 