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
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

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
        imageURL: "",
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

      {/* ÜSTTEKİ GRADYAN ŞERİT */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "110px",
          background: "linear-gradient(to right, #2196f3, #7b1fa2)",
          zIndex: -1,
        }}
      />

      <Box sx={{ flex: 1, p: 3 }}>
        {/* Sade başlık kutusu */}
        <Box
          sx={{
            // background: "linear-gradient(to right, #2196f3, #7b1fa2)",
            color: "linear-gradient(to right, #7b1fa2, #2196f3)",
            p: 4,
            borderRadius: 4,
            mb: 0,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ana Sayfa
          </Typography>
        </Box>

        {/* Paylaşım Kartı */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ne düşünüyorsun?
            </Typography>
            <TextField
              label="Düşünceni yaz..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={handlePostSubmit}
            >
              Paylaş
            </Button>
          </CardContent>
        </Card>

        {/* Postları listele */}
        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {post.author} •{" "}
                {post.createdAt?.toDate
                  ? post.createdAt.toDate().toLocaleString()
                  : "Tarih Yok"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">{post.content}</Typography>
              {post.imageURL && (
                <Box
                  component="img"
                  src={post.imageURL}
                  alt="Post görseli"
                  sx={{ mt: 2, maxWidth: "100%", borderRadius: 2 }}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
