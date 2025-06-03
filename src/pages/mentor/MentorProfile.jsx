import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar"; // ✅ Sidebar ekleniyor

const MentorProfile = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1, padding: "2rem" }}>
                <h1>Mentor-Mentee Network</h1>
                <h2>Mentor Profil Sayfası</h2>
                {userData ? (
                    <div>
                        <p><strong>Ad:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        {/* Diğer kullanıcı verilerini burada listeleyebilirsin */}
                    </div>
                ) : (
                    <p>Kullanıcı bilgileri yükleniyor...</p>
                )}
            </div>
        </div>
    );
};

export default MentorProfile;
