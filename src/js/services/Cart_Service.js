import { supabase, updateTable } from '../supabase'

const CART_ITEMS_SELECT = `id_carritocompras, cantidad, subtotal,
    detproductos(
        stock,
        proveedores(id_proveedor, nombre_proveedor),
        colores(id_color, color),
        tallas(id_talla, talla),
        productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto)
    )`

export const fetchCarrito = async () => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('detcarritocompras')
            .select(CART_ITEMS_SELECT)
            .order('id_producto', { ascending: false })

        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        throw error
    }
}

export const fetchTotal = async () => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('carritocompras')
            .select('total')

        if (error) throw error
        return data?.[0]?.total ?? 0
    } catch (error) {
        console.error('Error al obtener el total del carrito:', error)
        throw error
    }
}

export const fetchDirecciones = async (idCliente) => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('direcciones')
            .select()
            .eq('id_cliente', idCliente)
            .eq('estado', true)

        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Error al obtener las direcciones:', error)
        throw error
    }
}

export const fetchPrecioxKG = async (idDir, idCarrito) => {
    try {
        if (!idDir || !idCarrito) {
            return { precio: 0, cantidad: 0, envio: 0 }
        }

        const { data, error } = await supabase
            .schema('mrstore2')
            .from('direcciones')
            .select(`
                departamentos(id_departamento, precio_envio),
                clientes(id_cliente, carritocompras(id_carritocompras, detcarritocompras(id_carritocompras, cantidad)))
            `)
            .eq('clientes.carritocompras.id_carritocompras', idCarrito)
            .eq('id_direccion', idDir)

        if (error) throw error

        const direccion = data?.[0]
        if (!direccion) {
            return { precio: 0, cantidad: 0, envio: 0 }
        }

        const cantidad = direccion.clientes?.carritocompras?.[0]?.detcarritocompras?.reduce(
            (acc, item) => acc + item.cantidad,
            0
        ) ?? 0
        const precio = direccion.departamentos?.precio_envio ?? 0

        return {
            precio,
            cantidad,
            envio: cantidad * 0.375 * precio,
        }
    } catch (error) {
        console.error('Error al obtener el precio por kg:', error)
        throw error
    }
}

export const generarPedido = async (idCliente) => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .rpc('generarpedido', { p_id_cliente: idCliente })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al generar el pedido:', error)
        throw error
    }
}

export const generarPago = async ({ id_pedido, transferencia, banco, monto }) => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('pagos')
            .insert({
                id_pedido,
                referencia_bancaria: transferencia,
                banco,
                monto,
            })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al generar el pago:', error)
        throw error
    }
}

export const generarEnvio = async ({ descuento, costo_envio, id_pedido, id_direccion }) => {
    try {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('envios')
            .insert({
                descuento,
                costo_envio,
                id_pedido,
                id_direccion,
            })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al generar el envio:', error)
        throw error
    }
}

export const actualizarDireccionPrincipal = async (idCliente, idDireccion) => {
    try {
        if (!idCliente || !idDireccion) return false

        const desactivarPrincipal = await updateTable('direcciones', idCliente, 'id_cliente', { es_principal: false })
        if (!desactivarPrincipal) return false

        const activarPrincipal = await updateTable('direcciones', idDireccion, 'id_direccion', { es_principal: true })
        return activarPrincipal
    } catch (error) {
        console.error('Error al actualizar la direccion principal:', error)
        throw error
    }
}

export const addProductToCart = async (id_carrito, idProducto, id_color, id_talla, id_proveedor, cantidad) => {
    try {
        const { data, error } = await supabase.schema('mrstore2').from('detcarritocompras').insert({
            id_carritocompras: id_carrito,
            id_producto: idProducto,
            color: id_color,
            talla: id_talla,
            id_proveedor: id_proveedor,
            cantidad: cantidad
        }).select()

        console.log(data, error)
        if (error) {
            // console.error("Error al agregar producto al carrito:", error)
            if (error.code === '23505') {
                console.error("El producto ya existe en el carrito")
                return { message: "El producto ya existe en el carrito", type: "error" }
            } else {
                console.error("Error al agregar producto al carrito:", error)
                return { message: "Error al agregar producto al carrito", type: "error" }
            }
        }
        console.log("Producto agregado al carrito:", data)
        return { message: "Producto agregado al carrito", type: "success" }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error)
        return false
    }
}

export const addOneProductToCart = async (id_carrito, idProducto) => {
    try {
        const { data: existingItem, error: existingItemError } = await supabase.schema('mrstore2').from('detcarritocompras')
            .select()
            .eq('id_producto', idProducto)
            .single()
        if (existingItemError) {
            const { data, error } = await supabase.schema('mrstore2').from('detproductos').select().eq('id_producto', idProducto).single()
            const { data: cartData, error: cartError } = await supabase.schema('mrstore2').from('detcarritocompras').insert({
                id_carritocompras: id_carrito,
                id_producto: idProducto,
                color: data.color,
                talla: data.talla,
                id_proveedor: data.id_proveedor,
                cantidad: 1
            }).select()
            // console.log("item agregado:", cartData, cartError)
        }
        else {
            const { data, error } = await supabase.schema('mrstore2')
                .from('detcarritocompras')
                .update({ cantidad: existingItem.cantidad + 1 })
                .eq('id_producto', idProducto)
                .eq('color', existingItem.color)
                .eq('talla', existingItem.talla)
                .eq('id_proveedor', existingItem.id_proveedor)
        }
    }
    catch (error) {
        console.error("Error al agregar producto al carrito:", error)
    }
}