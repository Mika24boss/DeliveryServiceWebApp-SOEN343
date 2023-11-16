// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

// Get user
const getUser = () => {
    const userState = localStorage.getItem('user')
    if (userState === null)
        return null
    else
        return JSON.parse(userState)
}

export const authService = {
    logout,
    getUser
}

export default authService