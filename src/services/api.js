import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
  }
  return req;
});

// Auth routes
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);

// User profile routes
export const updateUserProfile = (formData) => API.put('/users/profile', formData);
export const getMyUploads = () => API.get('/users/my-uploads');
export const saveUpload = (uploadId) => API.post(`/users/save/${uploadId}`);
export const unsaveUpload = (uploadId) => API.delete(`/users/save/${uploadId}`);
export const getSavedUploads = () => API.get('/users/saved');

// Upload routes
export const getUploads = () => API.get('/uploads');
export const createUpload = (formData) => API.post('/uploads', formData);
export const getUploadById = (id) => API.get(`/uploads/${id}`);
export const updateUpload = (id, updatedData) => API.put(`/uploads/${id}`, updatedData);
export const deleteUpload = (id) => API.delete(`/uploads/${id}`);
export const trackDownload = (uploadId) => API.post(`/uploads/${uploadId}/download`);

export default API;