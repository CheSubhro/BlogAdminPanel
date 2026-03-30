
import Post from '../models/postModel.js';
import { v2 as cloudinary } from 'cloudinary';

// 1. Create Post
export const createPost = async (req, res) => {
    try {
      const imageUrl = req.file ? req.file.path : ''; 
  
      const { title, slug, content, category, tags, author, status } = req.body;

      const authorId = req.user._id;

      let tagsArray = [];
      if (tags) {
          tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
      }
  
      const post = await Post.create({
        title,
        slug,
        content: JSON.parse(content), 
        image: imageUrl,
        cloudinary_id: req.file ? req.file.filename : '', 
        category,
        tags: tagsArray,
        status,
        author: authorId
      });
  
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// 2. Get All Posts (For DataGrid)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({ path: 'author', select: 'name' })
      .populate({ path: 'category', select: 'name' })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Single post details
export const getPostById = async (req, res) => {
  try {
      const { id } = req.params;
      
      const post = await Post.findById(id).populate('author', 'name email'); 

      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json(post);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// 4. Update Post 
export const updatePost = async (req, res) => {
  try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
          return res.status(401).json({ message: "Not authorized to update this post" });
      }

      let updateData = { ...req.body };

      if (req.file) {
          if (post.cloudinary_id) {
              await cloudinary.uploader.destroy(post.cloudinary_id);
          }
          updateData.image = req.file.path;
          updateData.cloudinary_id = req.file.filename;
      }

      if (updateData.content) {
          updateData.content = JSON.parse(updateData.content);
      }

      const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updatedPost);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// 5. Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isAuthor = post.author.toString() === req.user._id.toString();
    const isAdminOrEditor = ['Administrator', 'Editor'].includes(req.user.role);

    if (!isAuthor && !isAdminOrEditor) {
      return res.status(401).json({ 
        message: "Not authorized! You can only delete your own posts." 
      });
    }

    if (post.cloudinary_id) {
      await cloudinary.uploader.destroy(post.cloudinary_id);
    }

    await post.deleteOne(); 

    res.status(200).json({ message: 'Post and associated image deleted successfully' });
    
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};