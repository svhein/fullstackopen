import axios from 'axios';

const baseUrl = '/api/persons'

export const getAllPersons = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const create = async (newPerson) => {
    const response = await axios.post(baseUrl, newPerson)
    
    console.log(response)

    if (response.status !== 200 && response.status !== 201){
        const msg = response.data.error || 'Unknown error'
        alert(`Failed to create person: ${msg}`)
        return {
            success: false,
            data: msg
        }
    }
    return {
        success: true,
        data: response.data
    }
}
export const update = async (id, updatedPerson) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedPerson)
    return response.data
}
export const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}
