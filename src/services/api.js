import axios from "axios";


const api = axios.create({
  //  baseURL: API_BASE_URL,
  
  //baseURL:"http://localhost:5000"
  baseURL:"https://api.qgen.edu.lk",
});

/**
 * Upload an image and get back an image ID
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} folder - Optional folder name (default: 'questions')
 * @returns {Promise<string>} Image ID
 */
export const uploadImage = async (base64Image, folder = 'questions') => {
  try {
    const response = await api.put('/images', { 
      image: base64Image,
      folder 
    });
    return response.data.imageId;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default api;