import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import Header from '../components/Header'

//guardar datos
const Inventario = () => {
  // Estados y hooks adaptados para categorías y nuevos campos
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
    const { data, error } = await supabase.schema('mrstore2').from('productos').insert([
      {
        nombre_producto: form.nombre_producto,
        precio_producto: parseFloat(form.precio_producto),
        descripcion: form.descripcion,
        imagen_url: form.imagen_url,
        id_categoria: form.id_categoria
      }
    ]).select()
    if (error) {
      alert('Error al crear producto: ' + error.message)
      return
    }
    if (data && data[0]) {
      await crearDetProducto(data[0].id_producto)
    }
  }
  const crearDetProducto = async (id_producto) => {
    const { data, error } = await supabase.schema('mrstore2').from('detproductos').insert({
      id_producto: id_producto,
      stock: parseInt(form.stock),
      talla: form.id_talla,
      color: form.id_color,
      id_proveedor: form.id_proveedor
    })
    if (error) {
      alert('Error al crear detalle del producto: ' + error.message)
    } else {
      alert('Producto creado correctamente')
      setForm({
        id_producto: '', id_talla: '', id_color: '', id_proveedor: '', id_categoria: '', nombre_categoria: '', nombre_producto: '', precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: ''
      })
      obtenerProductos()
    }
  }
  //Actualizar
  const ActualizarDet = async () => {
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
    if (error) console.log(error)
  }

  const ActualizarProducto = async () => {
    const { data, error } = await supabase.schema('mrstore2').from('productos').update({
      descripcion: form.descripcion,
      nombre_producto: form.nombre_producto,
      precio_producto: parseFloat(form.precio_producto),
      imagen_url: form.imagen_url,
      id_categoria: form.id_categoria
    }).eq('id_producto', form.id_producto).select()
    if (error) console.log(error)
  }

  const actualizarProd = async () => {
    try {
      await ActualizarProducto()
      await ActualizarDet()
      setEditar(false)
      setForm({ id_producto: '', id_talla: '', id_color: '', id_proveedor: '', id_categoria: '', nombre_categoria: '', nombre_producto: '', precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: '' })
      obtenerProductos()
    } catch (error) {
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
        .update({ estado: false })
        .eq('id_producto', id_producto)
        .select()
      if (error) {
        alert('Error al eliminar producto: ' + error.message)
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
  }
  const manejarCambio = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === 'id_categoria') {
      setForm({ ...form, id_categoria: Number(e.target.value), nombre_categoria: categorias.find(c => c.id_categoria === Number(e.target.value))?.nombre_categoria || '' })
    }
    if (e.target.name === 'talla') {
      let tallaSeleccionada = tallas && Array.isArray(tallas) ? tallas.find(t => t.talla.toLowerCase() === e.target.value.toLowerCase()) : null
      setForm({ ...form, talla: e.target.value, id_talla: tallaSeleccionada ? tallaSeleccionada.id_talla : '' })
    }
    if (e.target.name === 'color') {
      let colorSeleccionado = colores && Array.isArray(colores) ? colores.find(c => c.color.toLowerCase() === e.target.value.toLowerCase()) : null
      setForm({ ...form, color: e.target.value, id_color: colorSeleccionado ? colorSeleccionado.id_color : '' })
    }
    if (e.target.name === 'nombre_proveedor') {
      let proveedorSeleccionado = proveedores && Array.isArray(proveedores) ? proveedores.find(p => p.nombre_proveedor.toLowerCase() === e.target.value.toLowerCase()) : null
      setForm({ ...form, nombre_proveedor: e.target.value, id_proveedor: proveedorSeleccionado ? proveedorSeleccionado.id_proveedor : '' })
    }
  }
  const manejarEnvio = e => {
    e.preventDefault()
    if (editar) actualizarProd()
    else crearProducto()
  }
  return (
    <>
      <Header />
      <div className="inventario-container">
        <h1 className="inventario-title">🛍️ Inventario MRSTORE</h1>

        {/* Formulario Ampliado */}
        <div className="form-section">
          <div className="form-header">
            <h2>{editar ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}</h2>
            <div className="color-bar"></div>
          </div>
          
          <form onSubmit={manejarEnvio} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label>🌈 Nombre del Producto</label>
                <input type="text" name="nombre_producto" value={form.nombre_producto} onChange={manejarCambio} required />
              </div>
              
              <div className="form-group">
                <label>💰 Precio ($)</label>
                <input type="number" name="precio_producto" value={form.precio_producto} onChange={manejarCambio} step="0.01" required />
              </div>
              
              <div className="form-group">
                <label>📦 Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={manejarCambio} required />
              </div>
              
              <div className="form-group">
                <label>📏 Talla</label>
                <select name="talla" value={form.talla} onChange={manejarCambio} className="colorful-select">
                  <option value="">Seleccionar talla</option>
                  {tallas && tallas.map(t => (
                    <option key={t.id_talla} value={t.talla}>{t.talla}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>🎨 Color</label>
                <select name="color" value={form.color} onChange={manejarCambio} className="colorful-select">
                  <option value="">Seleccionar color</option>
                  {colores && colores.map(c => (
                    <option key={c.id_color} value={c.color} style={{ backgroundColor: c.color.toLowerCase() }}>{c.color}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>🏢 Proveedor</label>
                <select name="nombre_proveedor" value={form.nombre_proveedor} onChange={manejarCambio} className="colorful-select">
                  <option value="">Seleccionar proveedor</option>
                  {proveedores && proveedores.map(p => (
                    <option key={p.id_proveedor} value={p.nombre_proveedor}>{p.nombre_proveedor}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>📂 Categoría</label>
                <select name="id_categoria" value={form.id_categoria} onChange={manejarCambio} className="colorful-select">
                  <option value="">Seleccionar categoría</option>
                  {categorias && categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group span-2">
                <label>📝 Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={manejarCambio} rows="3"></textarea>
              </div>
              
              <div className="form-group span-2">
                <label>🖼️ URL de Imagen</label>
                <input type="url" name="imagen_url" value={form.imagen_url} onChange={manejarCambio} />
                {form.imagen_url && (
                  <div className="image-preview">
                    <img src={form.imagen_url} alt="Vista previa" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editar ? '💾 Guardar Cambios' : '✨ Agregar Producto'}
              </button>
              
              {editar && (
                <button type="button" onClick={() => {
                  setEditar(false)
                  setForm({ id_producto: null, nombre_producto: '', precio_producto: '', stock: '', talla: '', color: '', descripcion: '', nombre_proveedor: '', imagen_url: '' })
                }} className="btn-secondary">
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de Productos Ampliada */}
        <div className="table-section">
          <div className="section-header">
            <h2>📋 Lista de Productos</h2>
            <div className="color-bar"></div>
          </div>
          
          {cargando ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="products-grid">
              {productos.length === 0 ? (
                <div className="no-products">
                  <p>No hay productos registrados</p>
                </div>
              ) : (
                productos.map((producto, index) => (
                  <div key={index} className="product-card">
                    <div className="product-image-container">
                      <img src={producto.imagen_url} alt={producto.nombre_producto} className="product-image" />
                    </div>
                    
                    <div className="product-info">
                      <h3>{producto.nombre_producto}</h3>
                      <p className="product-description">{producto.descripcion}</p>
                      
                      <div className="product-details">
                        <div className="detail-item">
                          <span className="detail-label">Precio:</span>
                          <span className="detail-value price">${producto.precio_producto}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Stock:</span>
                          <span className="detail-value stock">{producto.stock} unidades</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Talla:</span>
                          <span className="detail-value size">{producto.talla}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Color:</span>
                          <span className="color-badge" style={{ backgroundColor: producto.color.toLowerCase() }}></span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Proveedor:</span>
                          <span className="detail-value supplier">{producto.nombre_proveedor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button onClick={() => editarProducto(producto)} className="btn-edit">
                        ✏️ Editar
                      </button>
                      <button onClick={() => eliminarProducto(producto.id_producto)} className="btn-delete">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

    </>
  )
}

export default Inventario