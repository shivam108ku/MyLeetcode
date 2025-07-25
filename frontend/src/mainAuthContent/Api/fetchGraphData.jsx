import axiosClient from '../../Utils/axiosClient';

export const fetchGraphData = async () => {
  const res = await axiosClient.get('/user/graph');
  console.log(res);
  return res.status === 200 ? res.data : [];
};
