import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AddPost = () => {
    const { currentUser } = useAuth();
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !imageFile) return;

        try {
            let imageURL = "";

            // Eğer resim varsa önce Storage'a yükle
            if (imageFile) {
                const imageRef = ref(storage, `postImages/${uuidv4()}-${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                imageURL = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, "posts"), {
                author: currentUser.displayName || currentUser.email,
                authorId: currentUser.uid,
                content,
                imageURL,
                createdAt: serverTimestamp(),
            });

            // Temizle
            setContent("");
            setImageFile(null);
        } catch (error) {
            console.error("Post eklenirken hata oluştu:", error);
        }
    };

    return (
        <Box component="form" onSubmit={handlePostSubmit} sx={{ mb: 3 }}>
            <TextField
                label="Ne paylaşmak istersin?"
                multiline
                fullWidth
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                margin="normal"
            />

            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Fotoğraf Yükle
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
            </Button>

            {imageFile && (
                <Box sx={{ mb: 2 }}>
                    <strong>Seçilen dosya:</strong> {imageFile.name}
                </Box>
            )}

            <Button type="submit" variant="contained" color="primary">
                Paylaş
            </Button>
        </Box>
    );
};

export default AddPost;
