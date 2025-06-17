import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Blog from './models/Blog.js';

const app = express();
const port = 3000;

const mongoURL = 'mongodb://mongo:27017/microblog';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// GET /
app.get('/', (req, res) => {
  res.send('Microblog Backend API running!');
});

// GET /
app.get('/health', (req, res) => {
  res.send('Healthy!');
});

// GET /blogs
app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find().sort({ timestamp: -1 });
  res.json(blogs);
});

// POST /blogs
app.post('/blogs', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newBlog = new Blog({ text });
  await newBlog.save();
  res.status(201).json(newBlog);
});

// DELETE /blogs/:id
app.delete('/blogs/:id', async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  res.status(204).send();
});

// PUT /blogs/:id
app.put('/blogs/:id', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, { text }, { new: true });
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  res.json(blog);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`);
});
