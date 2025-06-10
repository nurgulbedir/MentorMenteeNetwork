import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Divider,
    Container,
} from "@mui/material";
import { db } from "../../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const IncomingRequests = () => {
    const [requests, setRequests] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "matchRequests"),
            where("mentorID", "==", currentUser.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const requestList = [];
            querySnapshot.forEach((doc) => {
                requestList.push({ id: doc.id, ...doc.data() });
            });
            setRequests(requestList);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAccept = async (requestId) => {
        await updateDoc(doc(db, "matchRequests", requestId), {
            status: "accepted",
        });
    };

    const handleReject = async (requestId) => {
        await updateDoc(doc(db, "matchRequests", requestId), {
            status: "rejected",
        });
    };

    const handleViewProfile = (menteeID) => {
        navigate(`/mentor/mentee-profile/${menteeID}`);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Gelen Eşleşme Talepleri
            </Typography>

            {requests.length === 0 ? (
                <Typography>Şu anda bekleyen talep yok.</Typography>
            ) : (
                requests.map((request) => (
                    <Card key={request.id} variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Mentee ID:
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                {request.menteeID}
                            </Typography>

                            <Typography variant="subtitle1" fontWeight="bold">
                                Durum:
                            </Typography>
                            <Typography gutterBottom>{request.status}</Typography>

                            <Typography variant="subtitle1" fontWeight="bold">
                                Gönderim Tarihi:
                            </Typography>
                            <Typography gutterBottom>
                                {request.createdAt?.seconds
                                    ? new Date(request.createdAt.seconds * 1000).toLocaleString()
                                    : "-"}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleViewProfile(request.menteeID)}
                                >
                                    Profilini Gör
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAccept(request.id)}
                                >
                                    Kabul Et
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleReject(request.id)}
                                >
                                    Reddet
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default IncomingRequests;


