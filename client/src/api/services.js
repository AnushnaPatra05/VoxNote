import api from "./axios";

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const speechAPI = {
  transcribe: (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    return api.post("/speech/transcribe", formData);
  },
};

export const transcriptAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get("/transcripts", { params: { page, limit } }),

  delete: (id) => api.delete(`/transcripts/${id}`),
};