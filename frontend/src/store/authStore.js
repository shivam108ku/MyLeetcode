import { create } from "zustand";
import axios from "axios";

const API_URL = 'https://myleetcode.onrender.com/user/auth';
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user:null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message:null,

 signup: async (emailId, password, firstName ) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.post(`${API_URL}/register`, { emailId, password, firstName });

    // Log the response to verify its structure
    // console.log("Signup response:", response);

    // Set user and authentication state
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });

    return response.data; // optional: return if needed
  } catch (error) {
    console.error("Signup error:", error);

    // Safe access using optional chaining and correct spelling
    const errMsg = error?.response?.data?.message || "Error in signup";

    set({ error: errMsg, isLoading: false });
    throw error;
  }
},

 login: async (emailId , password)=>{
   set({ isLoading: true, error: null });
  try {
    const response = await axios.post(`${API_URL}/login`, { emailId, password });
 

    // Set user and authentication state
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });

    return response.data; // optional: return if needed
  } catch (error) {
    

    // Safe access using optional chaining and correct spelling
    const errMsg = error?.response?.data?.message || "Error Logging in";

    set({ error: errMsg, isLoading: false });
    throw error;
  }
 },

 
	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

verifyEmail: async ( code) =>{
  set({ isLoading: true, error: null });

    try {
    const response = await axios.post(`${API_URL}/verify-email`, { code });

    // Log the response to verify its structure
    console.log("Signup response:", response);

    // Set user and authentication state
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });

    return response.data; // optional: return if needed
  } catch (error) {
    console.error("Verification error:", error);

    // Safe access using optional chaining and correct spelling
    const errMsg = error?.response?.data?.message || "Error in verification email";
    set({ error: errMsg, isLoading: false });
    throw error;
  }
},

checkAuth: async () => {
  await new Promise((resolve)=> setTimeout(resolve,2000))
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (emailId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { emailId });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

}))