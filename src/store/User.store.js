import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useUserStore = create((set) => ({
  user: null,

  getUser: async () => {
    let token = localStorage.getItem("UserToken");
    if (!token) {
      token = sessionStorage.getItem("UserToken");
    }

    if (!token) {
      console.error("d");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const { data } = await axios.get(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/user/${decodedToken.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data && data.success && data.user) {
        set({ user: data.user });
      } else {
        console.error(
          "Failed to fetch user data or unexpected response structure",
          data
        );
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data);
      }
      console.error("Error fetching user:", errorMessage);

      if (
        error.name === "InvalidTokenError" ||
        (error.response && error.response.status === 401)
      ) {
        console.error(
          "The token might be invalid or expired. User logout is recommended."
        );
      }
    }
  },
  updateUser: async (userData) => {
    set({ isLoading: true, error: null });

    if (!userData) {
      console.error("Error: userData is null or undefined in updateUser.");
      set({ isLoading: false, error: "No user data provided for update." });
      return { success: false, message: "No user data provided." };
    }
    const dataToUpdate = { ...userData };
    delete dataToUpdate.role;

    try {
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      if (!token) {
        console.error("Error: Auth token is missing.");
        set({ isLoading: false, error: "Authentication token missing." });
        return { success: false, message: "Authentication required." };
      }
      let decodedToken;
      decodedToken = jwtDecode(token);

      const response = await axios.put(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/user/${decodedToken.id}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({ user: response.data.user, isLoading: false });
        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      } else {
        set({
          isLoading: false,
          error: response.data.message || "Failed to update user",
        });
        console.error(
          "Backend reported update failure:",
          response.data.message
        );
        return {
          success: false,
          message: response.data.message || "Failed to update user",
        };
      }
    } catch (err) {
      console.error(
        "Error during API request in updateUser:",
        err.response?.data || err.message
      );
      set({
        isLoading: false,
        error: err.response?.data?.message || "Network Error",
      });
      return {
        success: false,
        message: err.response?.data?.message || "Network Error",
      };
    } finally {
    }
  },
  deleteUser: async () => {
    let token = localStorage.getItem("UserToken");
    if (!token) {
      token = sessionStorage.getItem("UserToken");
    }
    if (!token) return console.error("No token found");

    const decodedToken = jwtDecode(token);

    try {
      const { data } = await axios.delete(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/user/${decodedToken.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.message === "User deleted successfully") {
        set({ user: {} });
        localStorage.removeItem("UserToken");
      }
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
    }
  },
}));

export default useUserStore;
