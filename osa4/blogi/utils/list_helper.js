const User = require('../models/user')

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {

  let favorite = null;

  for (const blog of blogs) {
    if (favorite === null || blog.likes > favorite.likes) {
      favorite = blog;
    }
  }
  return favorite;

}

const mostBlogs = (blogs) => {

  const blogCount = {};

  for (const blog of blogs) {
    blogCount[blog.author] = (blogCount[blog.author] || 0) + 1;
  }
  let max = 0;
  let current = null;

  for (const author in blogCount) {
    if (blogCount[author] > max) {
      max = blogCount[author];
      current = author;
    }
  }
  return { author: current, blogs: max };
}

const mostLikes = (blogs) => {

  const likeCount = {};
  for (const blog of blogs) {
    likeCount[blog.author] = (likeCount[blog.author] || 0) + blog.likes;
  }
  let max = 0;
  let current = null;
  for (const author in likeCount) {
    if (likeCount[author] > max) {
      max = likeCount[author];
      current = author;
    }
  }
  return { author: current, likes: max };
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb
}