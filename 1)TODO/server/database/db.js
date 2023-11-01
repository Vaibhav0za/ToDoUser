import mongoose from "mongoose";
const Connection = async (username, password) => {
  const URL = `mongodb+srv://${username}:${password}@cluster0.odcp1xj.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, { useNewUrlParser: true });
    console.log("HELLO VAIBHAV, DATABASE CONNECTED SUCCESSFULLY");
  } catch (err) {
    console.log("ERROR WHILE CONNECTING DATABASE => ", err);
  }
};
export default Connection;
