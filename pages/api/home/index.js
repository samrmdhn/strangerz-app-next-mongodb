import db from "../../../utils/db";import Post from "../../../models/Post";
import Comment from "../../../models/Comment";

export default async function handler(req, res) {
  //API GET POSTS
  if (req.method == "GET") {
    try {
      await db();
      const post = await Post.find().populate({
        path: "commentId",
        select: "id commentBody createdAt",
      });

      res.status(200);
      res.json({
        message: "Success get all data",
        data: post,
      });
    } catch (error) {
      res.json({
        message: error,
      });
      return res.status(405).end();
    }
    //API UPDATE LIKES
  } else if (req.method == "PUT") {
    try {
      await db();
      const { id, likes } = req.body;

      const post = await Post.findOne({ _id: id });
      post.likes = likes;

      await post.save();
      res.status(200);
      res.json({
        message: "Like updated",
        data: post,
      });
    } catch (error) {
      res.json({
        message: error,
      });
      return res.status(405).end();
    }
  } else if (req.method == "POST") {
    try {
      await db();
      const data = req.body;

      const newPost = await Post.create(data);
      console.log(newPost);

      const post = await Post.find().populate({
        path: "commentId",
        select: "id commentBody createdAt",
      });

      res.status(200);
      res.json({
        message: "Post created",
        data: post,
      });
    } catch (error) {
      res.status(405).end();
    }
  } else {
    return res.status(405).end();
  }
}
