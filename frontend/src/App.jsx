import { useState, useEffect } from 'react'
import api from './services/api'

function App() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '' })
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null) // Estado para el ID del producto en edición

  const cargarProductos = async () => {
    const res = await api.get(`/productos?nombre=${busqueda}`)
    setProductos(res.data)
  }

  // Carga inicial de productos
  useEffect(() => {
    cargarProductos()
  }, [busqueda])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editandoId) {
      // Si estamos editando, llamamos a la API para modificar
      await api.put(`/productos/${editandoId}`, form)
    } else {
      // Si no, creamos un nuevo producto
      await api.post('/productos', form)
    }
    // Limpiamos el formulario y el estado de edición, y recargamos la lista
    setForm({ nombre: '', precio: '', descripcion: '' })
    setEditandoId(null)
    cargarProductos()
  }

  const handleEditar = (producto) => {
    // Carga los datos del producto en el formulario y guarda su ID
    setEditandoId(producto.id)
    setForm({ nombre: producto.nombre, precio: producto.precio, descripcion: producto.descripcion })
  }

  const handleCancelar = () => {
    // Limpia el formulario y el estado de edición
    setForm({ nombre: '', precio: '', descripcion: '' })
    setEditandoId(null)
  }

  const eliminarProducto = async (id) => {
    await api.delete(`/productos/${id}`)
    cargarProductos()
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📦 Catálogo de Productos</h1>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editandoId ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" placeholder="Descripción (opcional)" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex space-x-4 mt-6">
            <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {editandoId ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {editandoId && (
              <button type="button" onClick={handleCancelar} className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Precio</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Descripción</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-medium">{p.nombre}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">${p.precio}</td>
                  <td className="py-3 px-4 text-gray-500">{p.descripcion}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleEditar(p)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mr-2">Modificar</button>
                    <button onClick={() => eliminarProducto(p.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
