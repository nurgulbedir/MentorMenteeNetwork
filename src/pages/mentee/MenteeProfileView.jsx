import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const MenteeProfileView = () => {
    const { menteeID } = useParams();
    const [menteeData, setMenteeData] = useState(null);

    useEffect(() => {
        const fetchMenteeData = async () => {
            try {
                const docRef = doc(db, 'users', menteeID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMenteeData(docSnap.data());
                } else {
                    console.log('No such mentee!');
                }
            } catch (error) {
                console.error('Error fetching mentee profile:', error);
            }
        };

        fetchMenteeData();
    }, [menteeID]);

    if (!menteeData) {
        return <p>Yükleniyor...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mentee Profil Detayları</h2>
            <p><strong>Ad Soyad:</strong> {menteeData.displayName || 'Belirtilmedi'}</p>
            <p><strong>Email:</strong> {menteeData.email}</p>

            {menteeData.profilePictureURL && (
                <img src={menteeData.profilePictureURL} alt="Profil Fotoğrafı" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            )}

            <p><strong>İlgi Alanları:</strong> {menteeData.interests?.join(', ') || 'Belirtilmedi'}</p>
            <p><strong>Teknik Yetenekler:</strong> {menteeData.skills?.join(', ') || 'Belirtilmedi'}</p>
            <p><strong>Biyografi:</strong> {menteeData.bio || 'Belirtilmedi'}</p>
            <p><strong>Mentorlukta Ne Arıyor?:</strong> {menteeData.mentorshipGoals || 'Belirtilmedi'}</p>
            <p><strong>Ulaşılabilirlik:</strong> {menteeData.availability || 'Belirtilmedi'}</p>
            <p><strong>Şehir / Zaman Dilimi:</strong> {menteeData.city || 'Belirtilmedi'}</p>
        </div>
    );
};

export default MenteeProfileView;
