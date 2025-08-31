
import React, { useState } from 'react'
import apiClient from '../services/apiClient'

async function Getme() {
    const [name,setName] = useState()
    const [error,setError] = useState()
    const[loading,setLoading] = useState(false)
    
    try {
        setLoading(true)
        setError("")
        const userData = await apiClient.getMe()
        console.log(userData);
        setName(userData.data.username);

        
    } catch (error) {
        setError(error.message || "Error in GetMe CATCH");
        console.error("Error during GetMe:", error);
    }finally{
        setLoading(false)
    }
  return (
    <div>Getme {name}</div>
  )
}

export default Getme