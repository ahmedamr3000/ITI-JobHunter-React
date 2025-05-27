import { create } from "zustand";

const useAuthStore = create((set) => ({
  token:
    sessionStorage.getItem("UserToken") ||
    localStorage.getItem("UserToken") ||
    null,

  setToken: (newToken, rememberMe) => {
    set({ token: newToken });

    if (rememberMe) {
      localStorage.setItem("UserToken", newToken);
      sessionStorage.removeItem("UserToken");
    } else {
      sessionStorage.setItem("UserToken", newToken);
      localStorage.removeItem("UserToken");
    }
  },

  logout: () => {
    set({ token: null });
    sessionStorage.removeItem("UserToken");
    localStorage.removeItem("UserToken");
  },
}));

export default useAuthStore;
