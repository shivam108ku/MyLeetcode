import axiosClient from "../../Utils/axiosClient";

export const fetchProblems = async () => {
    const response = await axiosClient.get('problem/allProblems', {
        withCredentials: true
    });
    //console.log(response.data);
    return response.status === 200 ? response.data : null;
}