// src/pages/mentee/MentorList.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Chip,
    Box,
    Stack,
} from '@mui/material';

export default function MentorList() {
    const { currentUser } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [filterSkill, setFilterSkill] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMentors = async () => {
            const q = query(collection(db, 'users'), where('role', '==', 'mentor'));
            const querySnapshot = await getDocs(q);
            const mentorData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMentors(mentorData);
        };

        fetchMentors();
    }, []);

    const handleSendRequest = async (mentorId) => {
        try {
            await addDoc(collection(db, 'matchRequests'), {
                mentorID: mentorId,
                menteeID: currentUser.uid,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            alert('Eşleşme talebi gönderildi!');
        } catch (error) {
            console.error('Eşleşme talebi gönderilirken hata:', error);
        }
    };

    const handleGiveFeedback = (mentorId) => {
        navigate(`/feedback/${mentorId}`);
    };

    const filteredMentors = mentors.filter((mentor) => {
        const matchesSkill = filterSkill
            ? mentor.technicalSkills?.some((skill) =>
                skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
            : true;

        const matchesArea = filterArea
            ? mentor.specializationAreas?.some((area) =>
                area.toLowerCase().includes(filterArea.toLowerCase())
            )
            : true;

        return matchesSkill && matchesArea;
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Mentor Listesi
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Teknik Yetenek Filtresi"
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                />
                <TextField
                    label="Uzmanlık Alanı Filtresi"
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                />
            </Box>

            {filteredMentors.map((mentor) => (
                <Card key={mentor.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{mentor.fullName}</Typography>
                        <Typography variant="body2">{mentor.professionTitle}</Typography>
                        <Typography variant="body2">
                            Mentor Türü: {mentor.mentorType}
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2">Uzmanlık Alanları:</Typography>
                            {mentor.specializationAreas?.map((area, index) => (
                                <Chip key={index} label={area} sx={{ mr: 1, mb: 1 }} />
                            ))}
                        </Box>

                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2">Teknik Yetenekler:</Typography>
                            {mentor.technicalSkills?.map((skill, index) => (
                                <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
                            ))}
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => handleSendRequest(mentor.id)}
                            >
                                Eşleşme Talebi Gönder
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleGiveFeedback(mentor.id)}
                            >
                                Geri Bildirim Ver
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
