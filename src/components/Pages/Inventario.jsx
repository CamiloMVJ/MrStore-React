import React, { useEffect, useState } from 'react'
import { supabase } from '../../js/supabase'
import Header from '../Header'

//guardar datos
const Inventario = () => {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({
    id_producto: null,
    nombre_producto: '',
    precio_producto: '',
    stock: '',
    talla: '',
    colores:'',
    descripcion: '',
    proveedor: '',
    imagen_url: ''
  })


  const [editar, setEditar] = useState(false)
  const [cargando, setCargando] = useState(true)


  //Obtener producto
  const obtenerProductos = async () => {
    setCargando(true)
    const { data, error } = await supabase
    .schema('mrstore2').rpc('detproductos') 
    console.log(data)

    if (error) {
      alert('Error al cargar productos: ' + error.message)
    } else {
      setProductos(data)
    }
   setCargando(false)
  }

  useEffect(() => {
    obtenerProductos()
  }, [])


  
 //actualiza el from
  const manejarCambio = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validarURL = (url) => {
    try {
      new URL(url)
      return true
    } catch (_) {
      return false
    }
  }

  //Crear
  const crearProducto = async () => {
    if (!validarURL(form.imagen_url)) {
      alert('La URL de la imagen no es válida.')
      return
    }

    const { error } = await supabase.from('productos').insert([
      {
        nombre_producto: form.nombre_producto,
        precio_producto: parseFloat(form.precio_producto),
        stock: parseInt(form.stock),
        talla: form.talla,
        colores: form.colores,
        descripcion: form.descripcion,
        proveedor: form.proveedor,
        imagen_url: form.imagen_url
      }
    ])

    if (error) {
      alert('Error al crear producto: ' + error.message)
    } else {
      alert('Producto creado correctamente')
      setForm({ id_producto: null, nombre_producto: '', precio_producto: '', stock: '', talla: '',colores:'', descripcion: '', proveedor: '', imagen_url: '' })
      obtenerProductos()
    }
  }

  //Actualizar
  const actualizarProducto = async () => {
    if (!validarURL(form.imagen_url)) {
      alert('La URL de la imagen no es válida.')
      return
    }

    const { error } = await supabase
      .from('productos')
      .update({
        nombre_producto: form.nombre_producto,
        precio_producto: parseFloat(form.precio_producto),
        stock: parseInt(form.stock),
        talla: form.talla,
        colores: form.colores,
        descripcion: form.descripcion,
        proveedor: form.proveedor,
        imagen_url: form.imagen_url
      })
      .eq('id_producto', form.id_producto)

    if (error) {
      alert('Error al actualizar producto: ' + error.message)
    } else {
      alert('Producto actualizado correctamente')
      setEditar(false)
      setForm({ id_producto: null, nombre_producto: '', precio_producto: '', stock: '', talla: '',colores:'', descripcion: '', proveedor: '', imagen_url: '' })
      obtenerProductos()
    }
  }

  //Eliminar
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return
    const { error } = await supabase.from('productos').delete().eq('id_producto', id)
    if (error) {
      alert('Error al eliminar producto: ' + error.message)
    } else {
      alert('Producto eliminado')
      obtenerProductos()
    }
  }

  //Editar

  const editarProducto = (producto) => {
    setEditar(true)
    setForm({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      stock: producto.stock,
      talla: producto.tallas,
      colores: producto.colores,
      descripcion: producto.descripcion,
      proveedor: producto.proveedor || '',
      imagen_url: producto.imagen_url || ''
    })
  }

  
  const manejarEnvio = e => {
    e.preventDefault()
    if (editar) actualizarProducto()
    else crearProducto()
  }

  return (
    <>
      <Header />
      <div style={{ padding: '170px' }}>
        <h2>Inventario de productos</h2>

        <form onSubmit={manejarEnvio} style={{ marginBottom: '80px', border: '2px solid #ccc', padding: '25px' }}>
          <h3>{editar ? 'Editar producto' : 'Agregar producto'}</h3>

          <label>Nombre del Producto:</label>
          <input type="text" name="nombre_producto" value={form.nombre_producto} onChange={manejarCambio} required />

          <label>Precio:</label>
          <input type="number" name="precio_producto" value={form.precio_producto} onChange={manejarCambio} step="0.01" required />

          <label>Stock:</label>
          <input type="number" name="stock" value={form.stock} onChange={manejarCambio} required />

          <label>Talla:</label>
          <input type="text" name="talla" value={form.talla} onChange={manejarCambio} />

          <label>Colores:</label>
          <input type="text" name="colores" value={form.colores} onChange={manejarCambio} required />

          <label>Descripción:</label>
          <input type="text" name="descripcion" value={form.descripcion} onChange={manejarCambio} />

          <label>Proveedor:</label>
          <input type="text" name="proveedor" value={form.proveedor} onChange={manejarCambio} />

          <label>URL de Imagen:</label>
          <input type="url" name="imagen_url" value={form.imagen_url} onChange={manejarCambio} />

          <button type="submit" style={{ marginTop: '20px', background: '#d1a2f5', color: 'white', padding: '10px 20px', border: 'none' }}>{editar ? 'ACTUALIZAR' : 'AGREGAR'}</button>

          {editar && (
            <button
              type="button"
              onClick={() => {
                setEditar(false)
                setForm({ id_producto: null, nombre_producto: '', precio_producto: '', stock: '', talla: '', color:'', descripcion: '', proveedor: '', imagen_url: '' })
              }}
              style={{ marginLeft: '10px', background: '#d1a2f5', color: 'white', padding: '10px 20px', border: 'none' }}
            >CANCELAR</button>
          )}
        </form>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <table border="1.9" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#d1a2f5' }}>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Talla</th>
                <th>Colores</th>
                <th>Descripción</th>
                <th>Proveedor</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center' }}>No hay productos</td></tr>
              ) : (
                productos.map(producto => (
                  <tr key={producto.id_producto}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.precio_producto}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.tallas}</td>
                    <td>{producto.colores}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.proveedores}</td>
                    <td><img src={producto.imagen_url} alt="imagen" width="50" /></td>
                    <td>
                      <button onClick={() => editarProducto(producto)} style={{ marginRight: '5px', background: '#d1a2f5', color: 'white', border: 'none', padding: '5px 10px' }}>EDITAR</button>
                      <button onClick={() => eliminarProducto(producto.id_producto)} style={{ background: '#d1a2f5', color: 'white', border: 'none', padding: '5px 10px' }}>ELIMINAR</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Inventario
