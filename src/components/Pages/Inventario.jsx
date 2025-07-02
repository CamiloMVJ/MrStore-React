import React, { useEffect, useState } from 'react'
import { supabase } from '../../js/supabase'
import Header from '../Header'

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

      {/* Estilos adaptados y organizados para Inventario */}
      <style jsx>{`
        .inventario-container {
          padding: 2rem 5%;
          max-width: 1800px;
          margin: 0 auto;
          font-size: 1.1rem;
        }
        .inventario-title {
          color: #8a4fff;
          margin-bottom: 2rem;
          font-size: 2.5rem;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(138, 79, 255, 0.2);
        }
        .form-section, .table-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 8px 20px rgba(138, 79, 255, 0.15);
        }
        .form-header, .section-header {
          margin-bottom: 2rem;
        }
        .form-header h2, .section-header h2 {
          color: #8a4fff;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .color-bar {
          height: 6px;
          background: linear-gradient(90deg, #8a4fff, #ff4f9a, #4fff8a);
          border-radius: 3px;
          width: 100%;
        }
        .product-form {
          margin-top: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group.span-2 {
          grid-column: span 2;
        }
        .form-group label {
          margin-bottom: 0.8rem;
          color: #666;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .form-group input, 
        .form-group textarea,
        .form-group select {
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1.1rem;
          transition: all 0.3s;
        }
        .form-group input:focus, 
        .form-group textarea:focus,
        .form-group select:focus {
          border-color: #8a4fff;
          outline: none;
          box-shadow: 0 0 0 4px rgba(138, 79, 255, 0.2);
        }
        .colorful-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a4fff'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5rem;
        }
        .image-preview {
          margin-top: 1rem;
          width: 100%;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px dashed #8a4fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .form-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .btn-primary, .btn-secondary, .btn-edit, .btn-delete {
          border: none;
          padding: 1.2rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-primary {
          background-color: #8a4fff;
          color: white;
          box-shadow: 0 4px 12px rgba(138, 79, 255, 0.3);
        }
        .btn-primary:hover {
          background-color: #7b3aff;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(138, 79, 255, 0.4);
        }
        .btn-secondary {
          background-color: white;
          color: #8a4fff;
          border: 2px solid #8a4fff;
        }
        .btn-secondary:hover {
          background-color: #f9f5ff;
          transform: translateY(-3px);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }
        .product-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          background: white;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(138, 79, 255, 0.2);
        }
        .product-image-container {
          height: 250px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9f5ff;
        }
        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-info {
          padding: 1.5rem;
          flex-grow: 1;
        }
        .product-info h3 {
          color: #333;
          font-size: 1.5rem;
          margin-bottom: 0.8rem;
        }
        .product-description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .product-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .detail-label {
          font-weight: 600;
          color: #666;
        }
        .detail-value {
          color: #333;
        }
        .price {
          color: #8a4fff;
          font-weight: 700;
        }
        .stock {
          color: #4fff8a;
          font-weight: 700;
        }
        .size {
          background: #8a4fff;
          color: white;
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        .color-badge {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 2px solid #eee;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .product-actions {
          display: flex;
          padding: 0 1.5rem 1.5rem;
          gap: 1rem;
        }
        .btn-edit {
          background-color: rgba(138, 79, 255, 0.1);
          color: #8a4fff;
          flex: 1;
          justify-content: center;
        }
        .btn-edit:hover {
          background-color: rgba(138, 79, 255, 0.2);
        }
        .btn-delete {
          background-color: rgba(255, 79, 79, 0.1);
          color: #ff4f4f;
          flex: 1;
          justify-content: center;
        }
        .btn-delete:hover {
          background-color: rgba(255, 79, 79, 0.2);
        }
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
        }
        .spinner {
          border: 6px solid rgba(138, 79, 255, 0.1);
          border-radius: 50%;
          border-top: 6px solid #8a4fff;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .no-products {
          text-align: center;
          padding: 4rem;
          color: #666;
          grid-column: 1 / -1;
          font-size: 1.2rem;
        }
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }
        @media (max-width: 768px) {
          .inventario-container {
            padding: 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.span-2 {
            grid-column: span 1;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
          .product-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

export default Inventario