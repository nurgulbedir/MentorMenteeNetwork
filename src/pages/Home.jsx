// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { Box, Button, TextField, Typography } from "@mui/material";

const Home = () => {
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const handlePostSubmit = async () => {
        if (!content.trim()) return;

        try {
            await addDoc(collection(db, "posts"), {
                author: auth.currentUser?.email || "Anonymous",
                content: content,
                imageURL: "", // Şimdilik boş
                createdAt: serverTimestamp(),
            });

            setContent("");
        } catch (error) {
            console.error("Post gönderilirken hata:", error);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Ana Sayfa
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Ne düşünüyorsun?"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={handlePostSubmit}
                    >
                        Paylaş
                    </Button>
                </Box>

                {/* Postları listele */}
                {posts.map((post) => (
                    <Box
                        key={post.id}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            {post.author} -{" "}
                            {post.createdAt?.toDate
                                ? post.createdAt.toDate().toLocaleString()
                                : "Tarih Yok"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {post.content}
                        </Typography>
                        {post.imageURL && (
                            <Box
                                component="img"
                                src={post.imageURL}
                                alt="Post görseli"
                                sx={{ mt: 1, maxWidth: "100%", borderRadius: 2 }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Home;

