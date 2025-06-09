// src/pages/mentor/IncomingRequests.jsx

import React, { useEffect, useState } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

export default function IncomingRequests() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const q = query(
            collection(db, 'matchRequests'),
            where('mentorID', '==', currentUser.uid),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequests(requestData);
        });

        return () => unsubscribe();
    }, [currentUser?.uid]);

    const handleUpdateStatus = async (requestId, newStatus) => {
        try {
            const requestRef = doc(db, 'matchRequests', requestId);
            await updateDoc(requestRef, {
                status: newStatus,
            });
            alert(`Talep ${newStatus === 'accepted' ? 'kabul edildi' : 'reddedildi'}!`);
        } catch (error) {
            console.error('Durum güncellenirken hata:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gelen Eşleşme Talepleri
            </Typography>

            {requests.length === 0 ? (
                <Typography>Şu anda bekleyen talep yok.</Typography>
            ) : (
                requests.map((request) => (
                    <Card key={request.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">
                                <strong>Mentee ID:</strong> {request.menteeID}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Durum:</strong> {request.status}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ mr: 2 }}
                                    onClick={() => handleUpdateStatus(request.id, 'accepted')}
                                >
                                    Kabul Et
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                >
                                    Reddet
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}
