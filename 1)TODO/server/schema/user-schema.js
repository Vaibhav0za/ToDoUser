import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  taskName: String,
  createdAt: String,
  editedAt: String,
  editCount: Number,
  createdBy: String,
  createdFor: Array,
  taskStatus:Array,
  updatedBy:Array,
  taskPriority:String,
  deadLine:String,

});

const postTask = mongoose.model("task", userSchema);

const userSchema2 = mongoose.Schema({
  username: String,
  password: String,
  role:String,
  taskCompleted:Number,
  taskDue:Number,
  accountCreatedAt:String,
});

const User = mongoose.model("user", userSchema2);

export { postTask, User };
