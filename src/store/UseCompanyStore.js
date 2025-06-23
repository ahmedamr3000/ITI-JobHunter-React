import { create } from "zustand";
import axios from "axios";

const useCompanyStore = create((set) => ({
  companies: [],
  isLoading: false,
  error: null,

  getAllCompanies: async () => {
    set({ isLoading: true });
    let token = localStorage.getItem("UserToken");
    if (!token) {
      token = sessionStorage.getItem("UserToken");
    }
    try {
      const res = await axios.get(
        "https://iti-jobhunter-node-production-2ae5.up.railway.app/api/companies/display",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ companies: res.data, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  getCompanyBydetails: (id) => {
    set({ isLoading: true });
    let token = localStorage.getItem("UserToken");
    if (!token) {
      token = sessionStorage.getItem("UserToken");
    }
    try {
      const res = axios.get(
        `https://iti-jobhunter-node-production-2ae5.up.railway.app/api/companies/display/${id}`,
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );

      set({ companies: res.data });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
}));

export default useCompanyStore;
