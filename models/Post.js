import { Schema, model, models, ObjectId, mongoose } from "mongoose";
const postSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    likes: Number,
    urlPics: String,
    commentId: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model("Post", postSchema);
/*

Udah beberapa kali ganti model karena ada tambahan data
Tips: Data yang dahulu distore oleh MongoDB, jadi harus ganti nama model

*/
export default Post;
