import { Schema, model, models, mongoose, ObjectId } from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    commentBody: {
      type: String,
    },
    postId: {
      type: ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = models.Comment || model("Comment", commentSchema);
/*

Udah beberapa kali ganti model karena ada tambahan data
Tips: Data yang dahulu distore oleh MongoDB, jadi harus ganti nama model

*/
export default Comment;
