import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.1.73:3000",
  baseURL: "https://cricbelbari-server.onrender.com",
  withCredentials: true,
});
