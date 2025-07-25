
import axiosClient from "../../Utils/axiosClient";

export const fetchUserStats = async () => {
  const res = await axiosClient.get("/user/stats"); // or /user/stats
  //console.log("User Stats:", res.data);
  return res.status === 200 ? res.data : null;
};


