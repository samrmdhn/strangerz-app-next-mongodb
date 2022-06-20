import mongoose from "mongoose";const db = async () =>
  mongoose.connect("mongodb://localhost:27017/db_strangerz");

export default db;
