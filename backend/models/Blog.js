import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
