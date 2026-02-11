import axios from 'axios';
const BASE_URL = 'https://localhost:7129';

// GET ALL PETS
const getAllPets = async () => {
  const response = await axios.get(`${BASE_URL}/api/Pet`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// GET PET BY ID
const getPetById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/Pet/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// GET PETS BY USER ID
const getPetsByUserId = async (userId) => {
  const response = await axios.get(`${BASE_URL}/api/Pet/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// REGISTER PET
const registerPet = async (petData) => {
  const response = await axios.post(
    `${BASE_URL}/api/Pet/register`,
    petData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// UPDATE PET ✅ axios.put
const updatePet = async (id, petData) => {
  const response = await axios.put(
    `${BASE_URL}/api/Pet/${id}`,
    petData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// DELETE PET
const deletePet = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/Pet/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

const petService = {
  getAllPets,
  getPetById,
  getPetsByUserId,
  registerPet,
  updatePet,
  deletePet,
};

export default petService;
