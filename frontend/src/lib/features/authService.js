import axios from 'axios'
import {env} from '$env/dynamic/public'

const API_URL = env.PUBLIC_API_URL + '/api/users/'

// Register user
const register = async (/** @type {any} */ userData) => {
    const response = await axios.post(API_URL, userData).catch((reason) => {
        return null
    })

    if (response && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response?.data
}

// Login user
const login = async (/** @type {any} */ userData) => {
    return await axios.post(API_URL + 'login/', userData)
        .then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        })
        .catch((reason) => {
            return null
        })
}

// Logout user
const logout = async (/** @type {any} */userData, /** @type {any} */token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    localStorage.removeItem('user')
    const response = await axios.post(API_URL + 'logout', userData, config)
}

// Get user
const getUser = () => {
    const userState = localStorage.getItem('user')
    if (userState === null)
        return null
    else
        return JSON.parse(userState)
}

// Get user by ID
const getUserByID = async (/** @type {string} */ userID, /** @type {any} */ token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + userID, config).catch(() => {
        return null
    })

    return response?.data
}

export const authService = {
    register,
    logout,
    login,
    getUser,
    getUserByID,
}

export default authService