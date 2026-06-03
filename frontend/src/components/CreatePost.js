import React, { useState, useRef } from "react";
import {
  Card, CardContent, Box, TextField, Button, Avatar,
  Typography, IconButton, Chip, CircularProgress, Alert
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 45%)`;
};

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError("Please add text or an image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (image) formData.append("image", image);

      const { data } = await API.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText("");
      setImage(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onPostCreated && onPostCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Avatar
            sx={{
              bgcolor: stringToColor(user.username),
              fontWeight: 700,
              width: 44,
              height: 44,
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>

          <Box flex={1} component="form" onSubmit={handleSubmit}>
            <TextField
              placeholder={`What's on your mind, ${user.username}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Image preview */}
            {imagePreview && (
              <Box position="relative" display="inline-block" mt={1}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: 180,
                    maxWidth: "100%",
                    borderRadius: 8,
                    display: "block",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={removeImage}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
                <IconButton
                  onClick={() => fileRef.current.click()}
                  color="primary"
                  title="Add image"
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
                {image && (
                  <Chip
                    label={image.name}
                    size="small"
                    onDelete={removeImage}
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || (!text.trim() && !image)}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
