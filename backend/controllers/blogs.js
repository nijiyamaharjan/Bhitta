const Blog = require("../models/Blogs");
const { finalImageUrl, emptyTempDirectory } = require("./image");
const mongoose = require("mongoose");
const User = require("../models/User");

const getAllBlogs = async (req, res) => {
  try {
    const temp = await Blog.find();
    const blogs = temp.reverse();
    res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
  }
};
const getTaggedBlogs = async (req, res) => {
  console.log("+==================");
  try {
    const tags = req.query.tags;
    const query = {};
    query.tags = { $in: tags.split(" ") };
    console.log(query);
    const temp = await Blog.find(query);
    console.log(temp);
    const blogs = temp.reverse();
    res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
  }
};
const getBlog = async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  try {
    const blog = await Blog.findById(id);
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
  }
};
const modifyBlog = async (req, res) => {
  const id = req.params.id;
  try {
    console.log(req.body);
    let blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
  }
};
const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    let blog = await Blog.findById(id);
    let isAdmin = await User.findById(req.user._id);
    if (blog && (blog.createdBy === req.user._id || isAdmin)) {
      blog = await Blog.findByIdAndDelete(id, req.body, { new: true });
      console.log("Deleted");
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
  }
};
const createBlog = async (req, res) => {
  try {
    if (req.user) {
      let content = [];
      for (const item of req.body.content) {
        if (item.type === "image" && item.data.file.url.includes("temp")) {
          let newUrl = await finalImageUrl(item.data.file.url);
          item.data.file.url = newUrl;
        }
        content.push(item);
      }
      console.log(content);
      console.log("From the backend 1", req.body);
      const post = await Blog.create({
        ...req.body,
        createdBy: {
          id: req.user._id,
          avatar: req.user.avatar,
          name: req.user.name,
        },
        createdAt: new Date(),
      });
      console.log("From the backend:", post);
      await emptyTempDirectory();
      res.status(200).json(post);
    } else res.json({ msg: "Unauthorized" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBlog,
  createBlog,
  modifyBlog,
  getAllBlogs,
  deleteBlog,
  getTaggedBlogs,
};
