import axios from 'axios'

const api = axios.create({
  baseURL: 'https://refactored-space-chainsaw-7vx4gqrvqr6fxg99-5000.app.github.dev', // o tu dominio en producción
})

export default api
