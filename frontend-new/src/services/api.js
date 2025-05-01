import axios from 'axios';

const USER_API_URL = 'http://localhost:8081/api/users';
const WORKPLAN_API_URL = 'http://localhost:8081/api/workplans';
const POST_API_URL = 'http://localhost:8081/api/posts';

// User-related functions
export const getUser = (id) => axios.get(`${USER_API_URL}/${id}`).then(res => res.data);
export const updateUser = (id, user) => axios.put(`${USER_API_URL}/${id}`, user).then(res => res.data);
export const deleteUser = (id) => axios.delete(`${USER_API_URL}/${id}`).then(() => {});
export const followUser = (followerId, followingId) => axios.post(`${USER_API_URL}/${followerId}/follow/${followingId}`).then(res => res.data);
export const unfollowUser = (followerId, followingId) => axios.post(`${USER_API_URL}/${followerId}/unfollow/${followingId}`).then(res => res.data);
export const getFollowers = (id) => axios.get(`${USER_API_URL}/${id}/followers`).then(res => res.data);
export const getFollowing = (id) => axios.get(`${USER_API_URL}/${id}/following`).then(res => res.data);
export const getAllUsers = () => axios.get(USER_API_URL).then(res => res.data);
export const loginUser = (credentials) => axios.post(`${USER_API_URL}/login`, credentials).then(res => res.data);
export const createUser = (userData) => axios.post(USER_API_URL, userData).then(res => res.data);

// Work plan functions
export const createWorkPlan = async (workPlan) => {
    const response = await axios.post(WORKPLAN_API_URL, workPlan);
    return response.data;
};

export const getWorkPlansByUser = async (userId) => {
    const response = await axios.get(WORKPLAN_API_URL, { params: { userId } });
    return response.data;
};

export const getWorkPlan = async (id) => {
    const response = await axios.get(`${WORKPLAN_API_URL}/${id}`);
    return response.data;
};

export const updateWorkPlan = async (id, workPlan) => {
    const response = await axios.put(`${WORKPLAN_API_URL}/${id}`, workPlan);
    return response.data;
};

export const deleteWorkPlan = async (id) => {
    await axios.delete(`${WORKPLAN_API_URL}/${id}`);
};

// Post functions
export const createPost = async (post) => {
    const response = await axios.post(POST_API_URL, post);
    return response.data;
};

export const getPostsByUserId = async (userId) => {
    const response = await axios.get(POST_API_URL, { params: { userId } });
    return response.data;
};

export const getPostById = async (id) => {
    const response = await axios.get(`${POST_API_URL}/${id}`);
    return response.data;
};

export const updatePost = async (id, post) => {
    const response = await axios.put(`${POST_API_URL}/${id}`, post);
    return response.data;
};

export const deletePost = async (id) => {
    await axios.delete(`${POST_API_URL}/${id}`);
};