import React, { useEffect, useState } from 'react'
import { supabase } from '../../js/supabase'
import Header from '../Header'

//guardar datos
const Inventario = () => {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({
    id_producto: null,
    id_talla: null,
    id_color: null,
    id_proveedor: null,
    nombre_producto: '',
    precio_producto: '',
    stock: '',
    talla: '',
    color: '',
    descripcion: '',
    nombre_proveedor: '',
    imagen_url: ''
  })

  const [tallas, setTallas] = useState(false)
  const [colores, setColores] = useState(false)
  const [proveedores, setproveedores] = useState(false)
  const [editar, setEditar] = useState(false)
  const [cargando, setCargando] = useState(true)


  const ObtenerTallas = async () => {
    const { data, error } = await supabase
      .schema('mrstore2').from('tallas').select()

    if (error) {
      alert('Error al cargar las tallas: ' + error.message)
    } else {
      setTallas(data)
    }
  }

  const ObtenerColores = async () => {
    const { data, error } = await supabase
      .schema('mrstore2').from('colores').select()

    if (error) {
      alert('Error al cargar las tallas: ' + error.message)
    } else {
      setColores(data)
    }
  }

  const ObtenerProveedores = async () => {
    const { data, error } = await supabase
      .schema('mrstore2').from('proveedores').select()

    if (error) {
      alert('Error al cargar los proveedores: ' + error.message)
    } else {
      setproveedores(data)
    }
  }

  //Obtener producto
  const obtenerProductos = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .schema('mrstore2').rpc('detproductos')
    //console.log(data)

    if (error) {
      alert('Error al cargar productos: ' + error.message)
    } else {
      // console.log(data)
      setProductos(data)
    }
    setCargando(false)
  }

  useEffect(() => {
    obtenerProductos()
    ObtenerTallas()
    ObtenerColores()
    ObtenerProveedores()  
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
        color: form.color,
        descripcion: form.descripcion,
        nombre_proveedor: form.nombre_proveedor,
        imagen_url: form.imagen_url
      }
    ])

    if (error) {
      alert('Error al crear producto: ' + error.message)
    } else {
      alert('Producto creado correctamente')
      setForm({
        id_producto: null, id_talla: null, id_color: null, id_proveedor: null, nombre_producto: '', precio_producto: '',
        stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
      })
      obtenerProductos()
    }
  }

  //Actualizar

  const ActualizarDet = async () => {
    let id_talla = null
    let id_color = null
    let id_proveedor = null
    tallas.map((talla, index) => {
      if (talla.talla == form.talla) {
        // console.log(talla.talla, talla.id_talla)
        // console.log('id de talla encontrado:', talla.id_talla)
        id_talla = talla.id_talla
        setForm({ ...form, id_talla: talla.id_talla })
      }
    })

    colores.map((colores, index) => {
      if (colores.color == form.color) {
        // console.log(colores.color, colores.id_color)
        // console.log('id de color encontrado:', colores.id_color)
        id_color = colores.id_color
        setForm({ ...form, id_color: colores.id_color })
      }
    })

    proveedores.map((proveedor, index) => {
      if(proveedor.nombre_proveedor == form.nombre_proveedor) {
        // console.log(proveedor.nombre_proveedor, proveedor.id_proveedor)
        // console.log('id de proveedor encontrado:', proveedor.id_proveedor)
        id_proveedor = proveedor.id_proveedor
        setForm({ ...form, id_proveedor: proveedor.id_proveedor })
      }
    })

    const { data, error } = await supabase.schema('mrstore2').from('detproductos').update({
      stock: parseInt(form.stock),
      talla: id_talla,
      color: id_color,
      id_proveedor: id_proveedor,
    })
      .eq('id_producto', form.id_producto)
      .eq('talla', form.id_talla)
      .eq('color', form.id_color)
      .eq('id_proveedor', form.id_proveedor)
      .select()

    console.log(data)
    console.log(error)
    // if (error) {
    //   alert('Error al actualizar producto: ' + error.message)
    // } else {
    //   alert('Producto actualizado correctamente')
    //   setEditar(false)
    //   setForm({
    //     id_producto: null, id_talla: null, id_color: null, id_proveedor: null, nombre_producto: '',
    //     precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
    //   })

    //   console.log(error)
    // }
  }

  const ActualizarProducto = async () => {

    const { data, error } = await supabase.schema('mrstore2').from('productos').update({
      descripcion: form.descripcion,
      nombre_producto: form.nombre_producto,
      precio_producto: parseFloat(form.precio_producto),
      imagen_url: form.imagen_url
    }).eq('id_producto', form.id_producto).select()

    console.log(data)
    console.log(error)
    // if (error) {
    //   alert('Error al actualizar producto: ' + error.message)
    // } else {
    //   alert('Producto actualizado correctamente')
    //   setEditar(false)
    //   setForm({
    //     id_producto: null, id_talla: null, id_color: null, id_proveedor: null, nombre_producto: '',
    //     precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
    //   })
    // }
  }

  const actualizarProd = () => {

    try {
      ActualizarProducto()
      ActualizarDet()
      obtenerProductos()
    }
    catch (error) {
      console.log(error)
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
      id_talla: producto.id_talla,
      id_color: producto.id_color,
      id_proveedor: producto.id_proveedor,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      stock: producto.stock,
      talla: producto.talla,
      color: producto.color,
      descripcion: producto.descripcion,
      nombre_proveedor: producto.nombre_proveedor || '',
      imagen_url: producto.imagen_url || ''

    })
    console.log(producto)
  }


  const manejarEnvio = e => {
    e.preventDefault()
    if (editar) actualizarProd()
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

          <label>color:</label>
          <input type="text" name="color" value={form.color} onChange={manejarCambio} required />

          <label>Descripción:</label>
          <input type="text" name="descripcion" value={form.descripcion} onChange={manejarCambio} />

          <label>Proveedor:</label>
          <input type="text" name="nombre_proveedor" value={form.nombre_proveedor} onChange={manejarCambio} />

          <label>URL de Imagen:</label>
          <input type="url" name="imagen_url" value={form.imagen_url} onChange={manejarCambio} />

          <button type="submit" style={{ marginTop: '20px', background: '#d1a2f5', color: 'white', padding: '10px 20px', border: 'none' }}>{editar ? 'ACTUALIZAR' : 'AGREGAR'}</button>

          {editar && (
            <button
              type="button"
              onClick={() => {
                setEditar(false)
                setForm({ id_producto: null, nombre_producto: '', precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: '' })
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
                <th>Id Prod</th>
                <th>Id prov</th>
                <th>Id Talla</th>
                <th>Id Color</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Talla</th>
                <th>color</th>
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
                productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.id_proveedor}</td>
                    <td>{producto.id_talla}</td>
                    <td>{producto.id_color}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.precio_producto}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.talla}</td>
                    <td>{producto.color}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.nombre_proveedor}</td>
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
