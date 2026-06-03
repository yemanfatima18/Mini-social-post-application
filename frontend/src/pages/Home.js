import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Box, Typography, CircularProgress,
  Button, Alert, Divider, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await API.get(`/api/posts?page=${pageNum}&limit=10`);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load posts. Is the server running?");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchPosts(nextPage, true);
  };

  const handlePostCreated = (newPost) => setPosts((prev) => [newPost, ...prev]);
  const handleDelete = (postId) => setPosts((prev) => prev.filter((p) => p._id !== postId));
  const handleUpdate = (postId, updates) =>
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, ...updates } : p)));

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>

      {/* Create Post — show box for logged in, prompt for guests */}
      {user ? (
        <CreatePost onPostCreated={handlePostCreated} />
      ) : (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            mb: 3,
            p: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea22 0%, #764ba222 100%)",
            border: "1px dashed #667eea",
          }}
        >
          <Typography variant="body1" fontWeight={600} mb={1}>
            Join the conversation 🌐
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Sign up or log in to create posts, like, and comment.
          </Typography>
          <Box display="flex" gap={1.5} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      )}

      {/* Feed Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Public Feed
        </Typography>
        <Divider sx={{ flex: 1, ml: 2 }} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && posts.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">No posts yet</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Be the first to share something!
          </Typography>
        </Box>
      )}

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}

      {!loading && hasMore && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={loadMore}
            disabled={loadingMore}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {loadingMore ? <CircularProgress size={20} /> : "Load More"}
          </Button>
        </Box>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
          You've seen all posts ✓
        </Typography>
      )}
    </Container>
  );
}
