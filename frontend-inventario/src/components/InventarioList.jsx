import React, { useEffect, useState } from 'react';
import { getInventario } from '../api';

const InventarioList = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInventario()
      .then((res) => {
        setInventario(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar inventario:', err);
        setError('No se pudo cargar el inventario');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando inventario...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>📦 Inventario</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.producto_id}>
              <td>{item.producto_id}</td>
              <td>{item.nombre}</td>
              <td>{item.categoria}</td>
              <td>{item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioList;