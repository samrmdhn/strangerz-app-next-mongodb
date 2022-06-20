import db from "../../../utils/db";import Comment from "../../../models/Comment";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      await db();
      const { id } = req.query;
      const data = req.body.commentBody;
      //Harus singular dari nama collection
      const post = await Post.findOne({ _id: id }).populate({
        path: "commentId",
        select: "id commentBody",
      });

      const newComment = {
        commentBody: data,
        postId: post._id,
      };

      const createComment = await Comment.create(newComment);

      await post.commentId.push({ _id: createComment._id });

      await post.save();
      await createComment.save();

      const postUpdated = await Post.findOne({ _id: id }).populate({
        path: "commentId",
        select: "postId id __v commentBody createdAt updatedAt ",
      });

      res.status(200);
      res.json({
        message: "Success comment",
        data: postUpdated,
      });
    } catch (error) {
      console.log(error);
      res.status(405).end();
    }
  } else if (req.method == "GET") {
    try {
      await db();
      const { id } = req.query;
      const post = await Post.findOne({ _id: id }).populate({
        path: "commentId",
        select: "postId id __v commentBody createdAt updatedAt ",
      });
      res.status(200);
      res.json({
        message: "Get post success",
        data: post,
      });
    } catch (error) {
      console.log(error);
      res.status(405).end();
    }
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
  } else {
    return res.status(405).end();
  }
}
