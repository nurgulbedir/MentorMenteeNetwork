import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

const Post = ({ author, content, imageURL, createdAt }) => {
    return (
        <Card sx={{ mb: 2 }}>
            {imageURL && (
                <CardMedia
                    component="img"
                    height="250"
                    image={imageURL}
                    alt="Post görseli"
                />
            )}
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                    {author}
                </Typography>
                {createdAt && (
                    <Typography variant="caption" color="textSecondary" display="block">
                        {createdAt.toDate().toLocaleString()}
                    </Typography>
                )}
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Post;

