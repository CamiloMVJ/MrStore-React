import React, { useEffect, useState } from 'react'
import { supabase } from '../../js/supabase'
import Header from '../Header'

//guardar datos
const Inventario = () => {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({
    id_producto: '',
    id_talla: '',
    id_color: '',
    id_categoria: '',
    id_proveedor: '',
    nombre_categoria: '',
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
  const [tallaxEditar, setTallaxEditar] = useState('')
  const [colores, setColores] = useState(false)
  const [colorxEditar, setColorxEditar] = useState('')
  const [proveedores, setproveedores] = useState(false)
  const [proveedorxEditar, setProveedorxEditar] = useState('')
  const [editar, setEditar] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [categorias, setCategorias] = useState([])
  const [categoriaxEditar, setCategoriaxEditar] = useState(0)


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
      alert('Error al cargar los colores: ' + error.message)
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

  const obtenerCategorias = async () => {
    const { data, error } = await supabase
      .schema('mrstore2').from('categorias').select()
    if (error) {
      alert('Error al cargar las categorías: ' + error.message)
    } else {
      setCategorias(data)
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
    obtenerCategorias()
    ObtenerProveedores()
  }, [])

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

    supabase.schema('mrstore2').from('productos').insert([
      {
        nombre_producto: form.nombre_producto,
        precio_producto: parseFloat(form.precio_producto),
        descripcion: form.descripcion,
        imagen_url: form.imagen_url,
        id_categoria: form.id_categoria
      }
    ]).select()
      .then(({ data, error }) => {
        if (error) {
          alert('Error al crear producto: ' + error.message)
        } else {
          console.log('Producto creado:', data)
          setForm({ ...form, id_producto: data[0].id_producto })
          crearDetProducto(data[0].id_producto)
        }
      })

    const crearDetProducto = async (id_producto) => {
      const { data, error } = await supabase.schema('mrstore2').from('detproductos').insert({
        id_producto: id_producto,
        stock: parseInt(form.stock),
        talla: form.id_talla,
        color: form.id_color,
        id_proveedor: form.id_proveedor
      })
      console.log(data)
      if (error) {
        alert('Error al crear detalle del producto: ' + error.message)
      }
      else {
        alert('Producto creado correctamente')
        setForm({
          id_producto: null, id_talla: null, id_color: null, id_proveedor: null, nombre_producto: '', precio_producto: '',
          stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
        })
        obtenerProductos()
      }
    }

    // if (error) {
    //   alert('Error al crear producto: ' + error.message)
    // } else {
    //   alert('Producto creado correctamente')
    //   setForm({
    //     id_producto: null, id_talla: null, id_color: null, id_proveedor: null, nombre_producto: '', precio_producto: '',
    //     stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
    //   })
    //   obtenerProductos()
    // }


    //Esto es lo recibido del pull -----------------------------------------------


    // if (!validarURL(form.imagen_url)) return alert('URL de imagen inválida')

    // const talla = tallas.find(t => t.talla === form.talla)
    // const color = colores.find(c => c.color === form.color)
    // const proveedor = proveedores.find(p => p.nombre_proveedor === form.nombre_proveedor)

    // if (!talla || !color || !proveedor) return alert('Talla, color o proveedor inválido')

    // const { data, error } = await supabase
    //   .schema('mrstore2')
    //   .from('productos')
    //   .insert({
    //     nombre_producto: form.nombre_producto,
    //     precio_producto: +form.precio_producto,
    //     descripcion: form.descripcion,
    //     imagen_url: form.imagen_url
    //   })
    //   .select('id_producto')

    // if (error) return alert('Error al crear producto: ' + error.message)

    // const id_producto = data[0].id_producto

    // const { error: errP } = await supabase
    //   .schema('mrstore2')
    //   .from('detproductos')
    //   .insert({
    //     id_producto,
    //     talla: talla.id_talla,
    //     color: color.id_color,
    //     id_proveedor: proveedor.id_proveedor,
    //     stock: +form.stock
    //   })

    // if (errP) return alert('Error al crear el producto ' + errP.message)

    // alert('Producto creado correctamente')
    // setForm({
    //   id_producto: null, id_talla: null, id_color: null, id_proveedor: null,
    //   nombre_producto: '', precio_producto: '', stock: '',
    //   talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
    // })
    // obtenerProductos()
  }

  //Actualizar
  const ActualizarDet = async () => {
    // let id_talla = null
    // let id_color = null
    // let id_proveedor = null
    // tallas.map((talla, index) => {
    //   if (talla.talla == form.talla) {
    //     // console.log(talla.talla, talla.id_talla)
    //     // console.log('id de talla encontrado:', talla.id_talla)
    //     id_talla = talla.id_talla
    //     setForm({ ...form, id_talla: talla.id_talla })
    //   }
    // })

    // colores.map((colores, index) => {
    //   if (colores.color == form.color) {
    //     id_color = colores.id_color
    //     setForm({ ...form, id_color: colores.id_color })
    //   }
    // })

    // proveedores.map((proveedor, index) => {
    //   if (proveedor.nombre_proveedor == form.nombre_proveedor) {
    //     // console.log(proveedor.nombre_proveedor, proveedor.id_proveedor)
    //     // console.log('id de proveedor encontrado:', proveedor.id_proveedor)
    //     id_proveedor = proveedor.id_proveedor
    //     setForm({ ...form, id_proveedor: proveedor.id_proveedor })
    //   }
    // })

    const { data, error } = await supabase.schema('mrstore2').from('detproductos').update({
      stock: parseInt(form.stock),
      talla: form.id_talla,
      color: form.id_color,
      id_proveedor: form.id_proveedor,
    }).eq('id_producto', form.id_producto)
      .eq('talla', tallaxEditar)
      .eq('color', colorxEditar)
      .eq('id_proveedor', proveedorxEditar)
      .select()

    console.log(data)
    console.log(error)
  }

  const ActualizarProducto = async () => {

    const { data, error } = await supabase.schema('mrstore2').from('productos').update({
      descripcion: form.descripcion,
      nombre_producto: form.nombre_producto,
      precio_producto: parseFloat(form.precio_producto),
      imagen_url: form.imagen_url,
      id_categoria: form.id_categoria
    }).eq('id_producto', form.id_producto).select()

    console.log(data)
    console.log(error)

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
  const eliminarProducto = async (id_producto) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return

    try {
      const { data, error } = await supabase
        .schema('mrstore2')
        .from('productos')
        .update({
          estado: false
        })
        .eq('id_producto', id_producto)
        .select()

      console.log(data)
      if (error) {
        alert('Error al eliminar detalle del producto: ' + error.message)
        return
      }

      alert('Producto eliminado correctamente')
      obtenerProductos()

    } catch (err) {
      console.error('Error inesperado:', err)
      alert('Error inesperado al eliminar producto')
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
      id_categoria: producto.id_categoria,
      nombre_categoria: producto.nombre_categoria || '',
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      stock: producto.stock,
      talla: producto.talla,
      color: producto.color,
      descripcion: producto.descripcion,
      nombre_proveedor: producto.nombre_proveedor || '',
      imagen_url: producto.imagen_url || ''

    })
    setCategoriaxEditar(producto.id_categoria)
    setTallaxEditar(producto.id_talla || '')
    setColorxEditar(producto.id_color || '')
    setProveedorxEditar(producto.id_proveedor || '')
    // console.log(producto)
  }

  const manejarEnvio = e => {
    e.preventDefault()
    if (editar) actualizarProd()
    else crearProducto()
  }

  //actualiza el from
  const manejarCambio = e => {
    setForm({ ...form, [e.target.name]: e.target.value })

    if (e.target.name === 'id_categoria') {
      console.log("Categoria seleccionada:", e.target.value)
      setForm({ ...form, id_categoria: Number(e.target.value), nombre_categoria: categorias.find(c => c.id_categoria === Number(e.target.value)).nombre_categoria || null })
    }
    if (e.target.name === 'talla') {
      console.log("Talla seleccionada:", e.target.value)
      let tallaSeleccionada = tallas.find(t => t.talla.toLowerCase() === e.target.value.toLowerCase())
      setForm({ ...form, talla: e.target.value, id_talla: tallaSeleccionada ? tallaSeleccionada.id_talla : null })
    }
    if (e.target.name === 'color') {
      console.log("Color seleccionado:", e.target.value)
      let id_color = colores.find(c => c.color.toLowerCase() === e.target.value.toLowerCase())
      console.log(id_color)
      setForm({ ...form, color: e.target.value, id_color: id_color ? id_color.id_color : null })
    }
    if (e.target.name === 'nombre_proveedor') {
      console.log("Proveedor seleccionado:", e.target.value)
      let proveedorSeleccionado = proveedores.find(p => p.nombre_proveedor.toLowerCase() === e.target.value.toLowerCase())
      setForm({ ...form, nombre_proveedor: e.target.value, id_proveedor: proveedorSeleccionado ? proveedorSeleccionado.id_proveedor : null })
    }
  }

  return (
    <>
      <Header />
      <div style={{ padding: '170px' }}>
        <h2>Inventario de productos</h2>

        <form onSubmit={manejarEnvio} style={{ marginBottom: '80px', border: '2px solid #ccc', padding: '25px' }}>
          <h3>{editar ? 'Editar producto' : 'Agregar producto'}</h3>

          <label htmlFor="nombre_producto"> Nombre del Producto: </label>
          <input type="text" id="nombre_producto" name="nombre_producto" value={form.nombre_producto} onChange={manejarCambio} required />

          <label htmlFor="id_categoria"> Categoria </label>
          <select name="id_categoria" value={form.id_categoria} onChange={manejarCambio} required>
            <option value="">Seleccionar categoría</option>
            {Array.isArray(categorias) && categorias.map((categoria, index) => {
              return (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre_categoria}
                </option>
              )
            })}
          </select>

          <label htmlFor="precio_producto"> Precio: </label>
          <input type="number" id="precio_producto" name="precio_producto" value={form.precio_producto} onChange={manejarCambio} step="0.01" required />

          <label htmlFor="stock"> Stock: </label>
          <input type="number" id="stock" name="stock" value={form.stock} onChange={manejarCambio} required />

          <label htmlFor="talla"> Talla: </label>
          <input type="text" id="talla" name="talla" value={form.talla} onChange={manejarCambio} />

          <label htmlFor="color"> Color: </label>
          <input type="text" id="color" name="color" value={form.color} onChange={manejarCambio} required />

          <label htmlFor="descripcion"> Descripción: </label>
          <input type="text" id="descripcion" name="descripcion" value={form.descripcion} onChange={manejarCambio} />

          <label htmlFor="nombre_proveedor"> Proveedor: </label>
          <input type="text" id="nombre_proveedor" name="nombre_proveedor" value={form.nombre_proveedor} onChange={manejarCambio} />

          <label htmlFor="imagen_url"> URL de Imagen: </label>
          <input type="url" id="imagen_url" name="imagen_url" value={form.imagen_url} onChange={manejarCambio} />

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
          <div className='table-responsive'>
            <table border="1.9" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#d1a2f5' }}>
                <tr style={{ position: 'sticky', top: 0 }}>
                  <th>Id Prod</th>
                  <th>Categoria</th>
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
                      <td>{producto.nombre_categoria}</td>
                      {/* <td>{producto.id_proveedor}</td> */}
                      {/* <td>{producto.id_talla}</td> */}
                      {/* <td>{producto.id_color}</td> */}
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
          </div>
        )}
      </div>
    </>
  )
}

export default Inventario
