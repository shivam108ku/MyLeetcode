
import axiosClient from "../../Utils/axiosClient";

export const fetchBlogs = async () => {
  const response = await axiosClient.get('/blog');
  // console.log("blog", response.data);
  return response.status === 200 ? response.data : null;
}