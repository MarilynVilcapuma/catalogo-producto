import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000', // o tu dominio en producción
})

export default api
