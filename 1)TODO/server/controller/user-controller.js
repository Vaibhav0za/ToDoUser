import { postTask, User } from "../schema/user-schema.js";
import { generateToken } from "../auth/auth.js";

export const addTask = async (req, res) => {
  const task = req.body;

  const newTask = new postTask(task);

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const tasks = await postTask.find({
      $and: [
        {
          $or: [{ "createdFor.id": req.params.id }, { createdFor: "all" }],
        },
        { createdAt: { $gt: user.accountCreatedAt } },
      ],
    });
    const filteredTasks = tasks
      .map((task) => {
        const filteredStatus = task?.taskStatus.filter(
          (taskStatus) =>
            taskStatus.username === req.query.username &&
            taskStatus.status === "On Going"
        );

        if (filteredStatus.length > 0) {
          return {
            _id: task._id,
            taskName: task.taskName,
            createdAt: task.createdAt,
            createdBy: task.createdBy,
            createdFor: task.createdFor,
            taskPriority: task?.taskPriority,
            deadLine: task.deadLine,
            taskStatus: filteredStatus,
            taskCompleted: task?.taskCompleted || 0,
          };
        } else if (
          task?.taskStatus?.some(
            (status) =>
              status.username === req.query.username &&
              status.status === "Completed" || status.status === "due"
          )
        ) {
          return null;
        } else {
          return {
            _id: task._id,
            taskName: task.taskName,
            createdAt: task.createdAt,
            createdBy: task.createdBy,
            createdFor: task.createdFor,
            taskPriority: task?.taskPriority,
            deadLine: task.deadLine,
            taskStatus: filteredStatus,
          };
        }
      })
      .filter((filteredTask) => filteredTask !== null);

    res.status(200).json({
      tasks: filteredTasks,
      userVal: {
        taskCompleted: user?.taskCompleted || 0,
        taskDue: user?.taskDue || 0,
        joinDate: user.accountCreatedAt,
      },
      message: "Data found",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCompleteTasks = async (req, res) => {
  try {
    const tasks = await postTask.find({
      $or: [{ "createdFor.id": req.params.id }, { createdFor: "all" }],
    });

    const completedTasks = tasks.filter((task) =>
      task.taskStatus.some(
        (status) =>
          status.username === req.query.username &&
          status.status === "Completed"
      )
    );

    res.status(200).json({ completedTasks, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDueTasks = async (req, res) => {
  try {
    const tasks = await postTask.find({
      $or: [{ "createdFor.id": req.params.id }, { createdFor: "all" }],
    });

    const dueTasks = tasks.filter((task) =>
      task.taskStatus.some(
        (status) =>
          status.username === req.query.username &&
          status.status === "due"
      )
    );

    res.status(200).json({ dueTasks, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  console.log(req.params.id);
  try {
    const task = await postTask.find({ _id: req.params.id });
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editTask = async (req, res) => {
  console.log(req.body, "<<==== edit");
  const updatedtask = req.body;
  console.log(req.params.id, "<= id");
  try {
    await postTask.updateOne({ _id: req.params.id }, { $set: updatedtask });
    res.status(200).json({ message: "task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletetask = async (req, res) => {
  try {
    await postTask.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message + " operation failed" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { username, status, actionTime, endTime } = req.body;

  try {
    const existingTask = await postTask.findOne({ _id: req.params.id });
    const taskStatus = existingTask.taskStatus || [];
    const userIndex = taskStatus.findIndex(
      (entry) => entry.username === username
    );

    if (userIndex !== -1) {
      if (taskStatus[userIndex].status !== status) {
        taskStatus[userIndex].status = status;
        taskStatus[userIndex].endTime = endTime;
      } else {
        console.log("same status cannot update");
        return res.status(200).json({ message: "Already Status is On Going" });
      }
    } else {
      taskStatus.push({ username, status, actionTime });
    }

    await postTask.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
          taskStatus: taskStatus,
        },
      }
    );

    res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signUp = async (req, res) => {
  const { username, password, role, taskCompleted, accountCreatedAt } =
    req.body;
  console.log(req.body);

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({
      error: "Username is already taken. Please choose a different username.",
    });
  } else {
    const newUser = new User({
      username,
      password,
      role,
      taskCompleted,
      accountCreatedAt,
    });
    console.log("newUser =====>>>>> ", newUser);

    try {
      await newUser.save();
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && password === user.password) {
      const token = generateToken(user);
      res
        .status(200)
        .json({ message: "Login successful", token, username, id: user._id });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      console.error("Login faild:");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  console.log("calling getUsers");
  try {
    const users = await User.find({}, { username: 1, _id: 1 });
    console.log("users =====>>>>> ", users);

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.username,
    }));

    const sortableUsers = formattedUsers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.status(200).json({ sortableUsers, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const completeTaskValue = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.taskCompleted = (user.taskCompleted || 0) + 1;

    await user.save();

    res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dueTask = async (req, res) => {
  const { username, status } = req.body;

  const task = await postTask.findOne({ _id: req.params.id });


  if (task?.taskStatus && Array.isArray(task.taskStatus)) {
    const existingUserIndex = task.taskStatus.findIndex(obj => obj.username === username);
    console.log("existingUserIndex =====>>>>> ", existingUserIndex);

    if (existingUserIndex !== -1) {
      // If user exists, replace data for that user
      task.taskStatus[existingUserIndex] = { username, status };
    } else {
      // If user doesn't exist, add data to the end of the array
      task.taskStatus.push({ username, status });
    }
  } else {
    task.taskStatus = [{ username, status }];
    console.log("taskStatus =====>>>>> ", 'taskStatus');
  }

  // Save the updated task
  await postTask.updateOne({ _id: req.params.id }, { $set: { taskStatus: task.taskStatus } });
};



