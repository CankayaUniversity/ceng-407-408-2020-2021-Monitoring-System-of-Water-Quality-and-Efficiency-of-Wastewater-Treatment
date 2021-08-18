import React, { useEffect } from 'react'
import axiosInstance from '../axios'
import { useHistory } from 'react-router-dom'

export default function Logout() {
  const history = useHistory()

  useEffect(() => {
    axiosInstance.post('user/logout/blacklist/', {
      refresh_token: localStorage.getItem('refresh_token'),
    })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('group')
    axiosInstance.defaults.headers['Authorization'] = null
    history.push('/')
    refreshPage()
  })

  const refreshPage = () => {
    window.location.reload()
  }
  return <div>Logout</div>
}
