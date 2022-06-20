import mongoose from "mongoose";
const db = async () =>
  mongoose.connect(
    "mongodb+srv://samrmdhn:yHV7hmVE666@cluster0.laf5pqx.mongodb.net/test"
  );
export default db;
