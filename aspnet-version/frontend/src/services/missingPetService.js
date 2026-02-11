import axios from 'axios';

const BASE_URL = 'https://localhost:7129';

export const createMissingPetReport = async (reportData) => {
    const response = await axios.post(`${BASE_URL}/api/missing-pets`, reportData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getNearbyMissingPets = async (radius = 10.0) => {
    const response = await axios.get(`${BASE_URL}/api/missing-pets/nearby`, {
        params: { radius },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const contactReporter = async (reportId, message) => {
    const response = await axios.post(`${BASE_URL}/api/missing-pets/${reportId}/contact`, { message }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getContacts = async (reportId) => {
    const response = await axios.get(`${BASE_URL}/api/missing-pets/${reportId}/contacts`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getMyReports = async () => {
    const response = await axios.get(`${BASE_URL}/api/missing-pets/my-reports`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const deleteReport = async (reportId) => {
    const response = await axios.delete(`${BASE_URL}/api/missing-pets/${reportId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

const missingPetService = {
    createMissingPetReport,
    getNearbyMissingPets,
    contactReporter,
    getContacts,
    getMyReports,
    deleteReport,
};

export default missingPetService;
