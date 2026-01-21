import axios from 'axios';

const API_URL = 'https://studies.cs.helsinki.fi/restcountries/api/'

export const getCountryData = async (countryName) => {

    try {
        const response = await axios.get(`${API_URL}/name/${countryName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching country data:', error);
        throw error;
    }
}

export const getAllCountryData = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all country data:', error);
        throw error;
    }
}





