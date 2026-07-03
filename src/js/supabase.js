import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const getTable = async (table, rowsQnt = '', columns = '') => {
  try {
    const { data, error } = await supabase.schema('mrstore2').from(table).select(columns).limit(rowsQnt)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener datos:", error.message)
    throw error
  }
}

export const getProducts = async (limit = 10, all = false) => {
  try {
    const { data, error } = await supabase.schema('mrstore2').from('detproductos')
      .select(`stock,
      productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto, id_categoria, estado)`)
      .eq('productos.estado', true)
      .gt('stock', 0)
      .order('id_producto', { ascending: false })
    const products = data.filter(item => {
      if (item.productos === null) return false
      return true
    }).map(item => {
      return {
        id_producto: item.productos.id_producto,
        nombre_producto: item.productos.nombre_producto,
        descripcion: item.productos.descripcion,
        imagen_url: item.productos.imagen_url,
        precio_producto: item.productos.precio_producto,
        id_categoria: item.productos.id_categoria,
        estado: item.productos.estado
      }
    })

    const response = Object.values(products.reduce((acc, curr) => {
      if (!acc[curr.id_producto]) {
        acc[curr.id_producto] = curr
      }
      return acc
    }, {}))

    if (error) throw error
    if (all) return response
    return response.slice(0, limit)
  } catch (error) {
    console.error("Error al obtener productos:", error.message)
    throw error
  }
}

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase.schema('mrstore2').rpc('detproducto', {
      id: id
    })
    return data
    console.log(error)
    console.log(data)
  }
  catch (error) {
    console.error("Error al obtener producto:", error.message)
    throw error
  }
  // try {
  //   const { data, error } = await supabase.schema('mrstore2').from('productos').select().eq('id_producto', id)
  //   if (error) throw error
  //   return data[0]
  // } catch (error) {
  //   console.error("Error al obtener producto:", error.message)
  //   throw error
  // }
}

export const updateTable = async (table, id, idName, updatedData) => {
  try {
    const { data, error } = await supabase.schema('mrstore2').from(table).update(updatedData).eq(idName, id)
    if (error) return false
    return true
  } catch (e) {
    console.error("Error al actualizar datos:", e.message)
    throw e
  }
}

export const getOrderDetailsById = async (id_pedido) => {
  try {
    const [orderResult, detailsResult, shippingResult] = await Promise.all([
      supabase
        .schema('mrstore2')
        .from('pedidos')
        .select(`id_pedido, total, estadopedido, fecha_pedido`)
        .eq('id_pedido', id_pedido)
        .single(),
      supabase
        .schema('mrstore2')
        .from('detpedidos')
        .select(`
          id_producto,color,talla,id_proveedor,id_pedido,cantidad,subtotal,precioventa,
          detproductos(
            productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto)
          )
        `)
        .eq('id_pedido', id_pedido)
        .order('subtotal', { ascending: false }),
      supabase
        .schema('mrstore2')
        .from('envios')
        .select(`
          id_pedido,
          costo_envio,
          empresa_envio,
          fechaentrega,
          descuento,
          direcciones(id_direccion, direccion, nombre_dir)
        `)
        .eq('id_pedido', id_pedido)
        .single(),
    ])

    if (orderResult.error) throw orderResult.error
    if (detailsResult.error) throw detailsResult.error
    if (shippingResult.error) throw shippingResult.error

    return {
      order: orderResult.data,
      details: detailsResult.data ?? [],
      shipping: shippingResult.data,
    }
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error.message)
    throw error
  }
}

export const confirmOrderPayment = async (id_pedido) => {
  try {
    const { data, error } = await supabase
      .schema('mrstore2')
      .from('pagos')
      .update({ estado_pago: true })
      .eq('id_pedido', id_pedido)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al confirmar el pago:', error.message)
    throw error
  }
}

export const getTableFiltered = async (table, filtro = [], orderedBy = 1, page = 1) => {
  let query = supabase.schema('mrstore2').from('productos').select().range((page - 1) * 12, (page * 12) - 1)
  // console.log("productos", query)

  if (filtro.length > 0) {
    query = query.in('id_categoria', filtro)
  }
  // console.log("productos", query)
  // Apply sorting
  if (orderedBy != 1) {
    query = query.order('precio_producto', { ascending: orderedBy === 2 })
  }
  const { data } = await query
  return data
}

export const getTotalRowsFiltered = async (table, filtro = []) => {
  try {
    let query = supabase.schema('mrstore2').from(table).select('*', { count: 'exact', head: true })
    if (filtro.length > 0) {
      query = query.in('id_categoria', filtro)
    }
    const { count, error } = await query
    if (error) throw error
    return count
  } 
  catch (error) {
    throw new Error(`Error al obtener el total de filas filtradas de la tabla ${table}: ${error.message}`)
  }
}

export const getTotalRows = async (table) => {
  try {
    const { count, error } = await supabase.schema('mrstore2').from(table).select('*', { count: 'exact', head: true })
    if (error) throw error
    return count
  }
  catch (error) {
    throw new Error(`Error al obtener el total de filas de la tabla ${table}: ${error.message}`)
  }
}