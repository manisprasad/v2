import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";

const userAxiosInstance = userAuthenticatedAxiosInstance("/api/v1/learn");

export const fetchLearnData = async (title, url, contentType) => {
  console.log(title, url, contentType);
  try {
    const responseData = await userAxiosInstance.post("/upload", {
      title,
      cloudinaryContentUrl: url,
      contentType,
    });
    return responseData.data;
  } catch (error) {
    console.error("Error uploading learn data:", error);
    throw error;
  }
};

export const getSummary = async (learnId) => {
  try {
    const response = await userAxiosInstance.post("/generateSummary", { learnId });
    return response.data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
};

export const getFlashes = async (learnId) => {
  try {
    const response = await userAxiosInstance.post("/generateFlashcards", { learnId });
    return response.data;
  } catch (error) {
    console.error("Error fetching flashes:", error);
    throw error;
  }
};

export const getNotes = async (learnId) => {
  try {
    const response = await userAxiosInstance.post("/generateNotes", { learnId });
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const ask = async (learnId, newMessages, oldMessages) => {
  const oldMessagesString = oldMessages
    .map((msg) => `role: ${msg.role}, content: ${msg.content}`)
    .join("\n");
  const newMessagesString = newMessages
    .map((msg) => `role: ${msg.role}, content: ${msg.content}`)
    .join("\n");
  try {
    const response = await userAxiosInstance.post("/ask", {
      learnId,
      oldMessages: oldMessagesString,
      newMessages: newMessagesString,
    });
    return response.data;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};

export const getMetaData =  async (learnId) => {
    try {
        const response = await userAxiosInstance.get(`/${learnId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching learn metadata:", error);
    }
}