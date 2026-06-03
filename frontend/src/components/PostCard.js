import React, { useState } from "react";
import {
  Card, CardContent, CardActions, CardMedia, Avatar,
  Typography, IconButton, Box, TextField, Button,
  Collapse, Divider, Chip, Tooltip
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import API from "../api";
import { useAuth } from "../context/AuthContext";

// Generate a color from username string (for avatar background)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 45%)`;
};

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localPost, setLocalPost] = useState(post);

  const isLiked = user ? localPost.likes.includes(user.username) : false;
  // Compare as strings — MongoDB ObjectId vs plain string
  const isOwner = user && String(localPost.userId) === String(user.id);

  // Build image URL — handle both full URLs and relative paths
  const imageUrl = localPost.image
    ? localPost.image.startsWith("http")
      ? localPost.image
      : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${localPost.image}`
    : null;

  const handleLike = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/api/posts/${localPost._id}/like`);
      setLocalPost((prev) => ({ ...prev, likes: data.likes }));
      onUpdate && onUpdate(localPost._id, { likes: data.likes });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmittingComment(true);
    try {
      const { data } = await API.post(`/api/posts/${localPost._id}/comment`, {
        text: commentText,
      });
      setLocalPost((prev) => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));
      setCommentText("");
      onUpdate &&
        onUpdate(localPost._id, {
          comments: [...localPost.comments, data.comment],
        });
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/api/posts/${localPost._id}`);
      onDelete && onDelete(localPost._id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        {/* Post Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                bgcolor: stringToColor(localPost.username),
                width: 42,
                height: 42,
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {localPost.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography fontWeight={700} variant="body1" lineHeight={1.2}>
                {localPost.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(localPost.createdAt)}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <Tooltip title="Delete post">
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Post Text */}
        {localPost.text && (
          <Typography variant="body1" sx={{ mt: 1, mb: imageUrl ? 1.5 : 0, lineHeight: 1.6 }}>
            {localPost.text}
          </Typography>
        )}
      </CardContent>

      {/* Post Image */}
      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post image"
          sx={{ maxHeight: 400, objectFit: "cover" }}
        />
      )}

      {/* Like & Comment Actions */}
      <CardActions sx={{ px: 2, py: 1, flexWrap: "wrap", gap: 0.5 }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            size="small"
            onClick={handleLike}
            disabled={!user}
            color={isLiked ? "error" : "default"}
            sx={{ transition: "transform 0.15s", "&:active": { transform: "scale(1.3)" } }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {localPost.likes.length} {localPost.likes.length === 1 ? "Like" : "Likes"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <IconButton
            size="small"
            onClick={() => setShowComments(!showComments)}
            color={showComments ? "primary" : "default"}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {localPost.comments.length} {localPost.comments.length === 1 ? "Comment" : "Comments"}
          </Typography>
        </Box>

        {/* Liked by — show usernames on hover */}
        {localPost.likes.length > 0 && (
          <Tooltip title={`Liked by: ${localPost.likes.join(", ")}`}>
            <Chip
              label={`❤️ ${localPost.likes.slice(0, 2).join(", ")}${localPost.likes.length > 2 ? ` +${localPost.likes.length - 2} more` : ""}`}
              size="small"
              variant="outlined"
              color="error"
              sx={{ ml: "auto", cursor: "pointer", maxWidth: 220 }}
            />
          </Tooltip>
        )}
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
          {/* Existing comments */}
          {localPost.comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
              No comments yet. Be the first!
            </Typography>
          ) : (
            localPost.comments.map((comment) => (
              <Box
                key={comment._id}
                display="flex"
                alignItems="flex-start"
                gap={1}
                mb={1.5}
              >
                <Avatar
                  sx={{
                    bgcolor: stringToColor(comment.username),
                    width: 30,
                    height: 30,
                    fontSize: "0.75rem",
                  }}
                >
                  {comment.username[0].toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.75,
                    flex: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight={700}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))
          )}

          {/* Add comment input */}
          {user && (
            <Box component="form" onSubmit={handleComment} display="flex" gap={1} mt={1}>
              <TextField
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!commentText.trim() || submittingComment}
                sx={{ borderRadius: 3, minWidth: 0, px: 2 }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          )}

          {!user && (
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
              Log in to comment
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
