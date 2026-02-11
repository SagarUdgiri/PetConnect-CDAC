import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const aiService = {
  /**
   * Get AI advice for a pet based on uploaded image
   * @param {File} imageFile - The pet image file
   * @returns {Promise} AI analysis response
   */
  getPetAdvice: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${BASE_URL}/api/ai/advice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  /**
   * Get diet plan and product recommendations for a pet
   * @param {Object} petData - Pet details (petType, breed, ageYears, weightKg, activityLevel, goal)
   * @returns {Promise} Diet plan with product recommendations
   */
  getDietAndProducts: async (petData) => {
    const response = await axios.post(`${BASE_URL}/api/ai/diet-product`, petData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};

export default aiService;
