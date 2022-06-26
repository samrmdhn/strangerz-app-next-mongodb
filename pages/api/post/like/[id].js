import Post from "../../../../models/Post";
import db from "../../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  try {
    await db();
    const { id } = req.query;
    const likesBody = req.body;
    console.log(id, likesBody);
    const post = await Post.findOne({ _id: id });

    post.likes = likesBody.likes;

    await post.save();
    res.status(200);
    res.json({
      message: "Likes submitted",
      data: post,
    });

    //Tadinya ada error API not respond cmn karena gada res.status(405).end() di catch errornya
  } catch (error) {
    return res.status(405).end();
  }
}
