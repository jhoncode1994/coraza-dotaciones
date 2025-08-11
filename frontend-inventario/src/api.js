import axios from 'axios';

const API_URL = 'https://coraza-dotaciones.onrender.com/api';

export const getInventario = () => axios.get(`${API_URL}/inventario`);
export const agregarProducto = (data) => axios.post(`${API_URL}/inventario`, data);