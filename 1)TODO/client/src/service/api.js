import axios from "axios";

const URL = "http://localhost:5003";

export const getTasks = async (id , username) => {
  try {
    return await axios.get(`${URL}/getTasks/${id}`, {
      params: { username: username },
    });
  } catch (error) {
    console.log("Error while getting all users", error);
  }
};

export const getUsers = async () => {
  try {
    return await axios.get(`${URL}/getUsers`);
  } catch (error) {
    console.log("Error while getting all users", error);
  }
};

export const getTask = async (id) => {
  try {
    return await axios.get(`${URL}/${id}`);
  } catch (error) {
    console.log("Error while getting single user", error);
  }
};

export const editTask = async (task, id) => {
  try {
    return await axios.put(`${URL}/${id}`, task);
  } catch (error) {
    console.log("Error while getting single user", error);
  }
};

export const deletetask = async (id) => {
  try {
    return await axios.delete(`${URL}/${id}`);
  } catch (error) {
    console.log("Error while getting single user", error);
  }
};

export const updateTaskStatus = async (id, data) => {

  try {
    return await axios.put(`${URL}/${id}`, data);
  } catch (error) {
    console.log("Error adding user", error);
  }
};

export const getCompleteTasks = async (id, username) => {
  try {
    return await axios.get(`${URL}/getCompleteTasks/${id}`, {
      params: { username: username },
    });
  } catch (error) {
    console.log("Error while getting all users", error);
  }
};

export const getDueTasks = async (id, username) => {
  try {
    return await axios.get(`${URL}/getDueTasks/${id}`, {
      params: { username: username },
    });
  } catch (error) {
    console.log("Error while getting all users", error);
  }
};

export const signUp = async (data) => {
  console.log("data APi =====>>>>> ", data);

  try {
    return await axios.post(`${URL}/signup`, data);
  } catch (error) {
    console.log("Error adding user", error);
  }
};

export const login = async (data) => {
  try {
    return await axios.post(`${URL}/login`, data);
  } catch (error) {
    console.log("Error login user", error);
  }
};

export const completeTaskValue = async (id,val) => {
  console.log("id =====>>>>> ", id);
  try {
    return await axios.put(`${URL}/update/${id}`,val);
  } catch (error) {
    console.log("Error while updating complete task value", error);
  }
};

export const dueTask = async (id, data) => {
  try {
    return await axios.put(`${URL}/due/${id}`, data);
  } catch (error) {
    console.log("Error adding user", error);
  }
};

