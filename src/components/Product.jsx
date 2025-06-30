import { useState, useEffect, act } from 'react'
import { supabase, updateTable } from '../js/supabase'
import Notification from './Notification'

const Product = ({ producto, ActualizarTotal, ActualizarProductos }) => {
    const [colorYtalla, setColorYTalla] = useState([])
    const [indexColorYTalla, setIndexColorYTalla] = useState()
    const [product, setProduct] = useState(producto)
    const [cantidad, setCantidad] = useState(product.cantidad)
    const [precio, setPrecio] = useState(product.detproductos.productos.precio_producto)
    const [subtotal, setSubtotal] = useState(product.subtotal)
    const [message, setMessage] = useState(null)
    const [type, setType] = useState(null)

    useEffect(() => {
        if (message === null) return
        const timer = setTimeout(() => {
            setMessage(null)
            setType(null)
        }, 3000)
        return () => clearTimeout(timer)
    }, [message])

    useEffect(() => {
        const fetchTallasyColoresIniciales = async () => {
            const { data, error } = await supabase.schema('mrstore2').from('detproductos').select('colores(id_color,color), tallas(id_talla, talla), proveedores(id_proveedor)').eq('id_producto', product.detproductos.productos.id_producto)
            // console.log(data)
            setColorYTalla(data)
            setIndexColorYTalla(data.findIndex(
                item => item.tallas.id_talla === product.detproductos.tallas.id_talla
                    && item.colores.id_color === product.detproductos.colores.id_color))
        }
        fetchTallasyColoresIniciales()
    }, [])

    const handleColorYTallaChange = (e) => {
        try {
            const ChangeDet = async (value) => {
                const { data, error } = await supabase.schema('mrstore2').from('detcarritocompras').update(
                    {
                        color: colorYtalla[value].colores.id_color,
                        talla: colorYtalla[value].tallas.id_talla,
                        id_proveedor: colorYtalla[value].proveedores.id_proveedor
                    })
                    .eq('id_carritocompras', product.id_carritocompras)
                    .eq('id_producto', product.detproductos.productos.id_producto)
                    .eq('color', product.detproductos.colores.id_color)
                    .eq('id_proveedor', product.detproductos.proveedores.id_proveedor)
                    .eq('talla', product.detproductos.tallas.id_talla)
                    .select()
                if (!error) {
                    setIndexColorYTalla(value)
                    ActualizarSubtotal(data[0])
                    // console.log(data[0])
                }
                else {
                    console.log(error)
                    setMessage('Error al actualizar talla y color')
                    setType('error')
                }
            }
            ChangeDet(e.target.value)
            ActualizarTotal()
        }
        catch (error) {
            console.log(error)
        }
    }

    const ActualizarSubtotal = async (item) => {
        const { data, error } = await supabase
            .schema('mrstore2')
            .from('detcarritocompras')
            .select(`id_carritocompras, cantidad, subtotal, 
                detproductos(
                    proveedores(id_proveedor, nombre_proveedor),
                    colores(id_color, color),
                    tallas(id_talla, talla), 
                    productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto))`)
            .eq('id_carritocompras', item.id_carritocompras)
            .eq('id_producto', item.id_producto)
            .eq('color', item.color)
            .eq('talla', item.talla)
            .eq('id_proveedor', item.id_proveedor)
        setProduct(data[0])
        setPrecio(data[0].detproductos.productos.precio_producto)
        setSubtotal(data[0].subtotal)
        // console.log('id_carritocompras:', item.id_carritocompras)
        // console.log('id_producto:', item.id_producto)
        // console.log('color:', item.color)
        // console.log('talla:', item.talla)

    }

    const ActualizarCantidad = (e) => {
        e.preventDefault()
        supabase.schema('mrstore2').from('detcarritocompras').update({
            cantidad: e.target.cantidad.value
        })
            .eq('id_producto', product.detproductos.productos.id_producto)
            .eq('color', product.detproductos.colores.id_color)
            .eq('id_proveedor', product.detproductos.proveedores.id_proveedor)
            .eq('talla', product.detproductos.tallas.id_talla)
            .select()
            .then(data => {
                ActualizarSubtotal(data.data[0])
                ActualizarTotal()
            })

    }
    const EliminarDelCarrito = (e) => {
        e.preventDefault()
        supabase.schema('mrstore2')
            .from('detcarritocompras')
            .delete()
            .eq('id_producto', product.detproductos.productos.id_producto)
            .eq('color', product.detproductos.colores.id_color)
            .eq('id_proveedor', product.detproductos.proveedores.id_proveedor)
            .eq('talla', product.detproductos.tallas.id_talla)
            .then(data => {
                // console.log(data)
                ActualizarProductos()
            })
        ActualizarTotal()
    }
    const ActualizarColorYTalla = (e) => {
        e.preventDefault()
    }
    return (
        <>
            <tr className='borderbottom'>
                <td>
                    <div className="cart-info">
                        <img className="cart-img" src={product.detproductos.productos.imagen_url} alt="product-image" />
                        <div className="cart-text">
                            <p><strong>{product.detproductos.productos.nombre_producto}</strong></p>
                            <span>{product.detproductos.productos.descripcion}</span> <br />
                            <span>{}</span>
                            <form onSubmit={EliminarDelCarrito} method="POST" style={{ display: 'inline' }}>
                                <input type="hidden" name="id_carrito" defaultValue={product.id_carritocompras} />
                                <input type="hidden" name="id_producto" defaultValue={product.detproductos.productos.id_producto} />
                                <input type="hidden" name="id_color" defaultValue={product.detproductos.colores.id_color} />
                                <input type="hidden" name="id_talla" defaultValue={product.detproductos.tallas.id_talla} />
                                <input type="hidden" name="id_proveedor" defaultValue={product.detproductos.proveedores.id_proveedor} />
                                <button type="submit" className="btn-danger">Eliminar del carrito</button>
                            </form>
                        </div>
                    </div>
                </td>
                <td className="txt-center">
                    <Notification message={message} type={type}></Notification>
                    <table>
                        <tbody>
                            <tr>
                                <td>Talla y color</td>
                                <td>
                                    <form id='TallasForm' method="POST" onSubmit={ActualizarColorYTalla} style={{ display: 'inline' }}>
                                        <input type="hidden" name="id_carrito" defaultValue={product.id_carritocompras} />
                                        <input type="hidden" name="id_producto" defaultValue={product.detproductos.productos.id_producto} />
                                        <input type="hidden" name="id_color" defaultValue={product.detproductos.colores.id_color} />
                                        <input type="hidden" name="id_talla" defaultValue={product.detproductos.tallas.id_talla} />
                                        <input type="hidden" name="id_proveedor" defaultValue={product.detproductos.proveedores.id_proveedor} />
                                        <div style={{ display: 'flex' }}>
                                            <select name="Talla" className='form-select' id='TallaSelect' value={indexColorYTalla} onChange={handleColorYTallaChange}>
                                                {Array.isArray(colorYtalla) && colorYtalla.map((item, index) => (
                                                    <option key={index} value={index}>
                                                        {item.tallas.talla} Y {item.colores.color}
                                                        {/* {console.log(colorYtalla[indexColorYTalla],'index:', indexColorYTalla)} */}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td className="txt-center">
                    <form onSubmit={ActualizarCantidad} method="POST">
                        <input type="hidden" name="id_carrito" defaultValue={product.id_carritocompras} />
                        <input type="hidden" name="id_producto" defaultValue={product.detproductos.productos.id_producto} />
                        <input type="hidden" name="id_color" defaultValue={product.detproductos.colores.id_color} />
                        <input type="hidden" name="id_talla" defaultValue={product.detproductos.tallas.id_talla} />
                        <input type="hidden" name="id_proveedor" defaultValue={product.detproductos.proveedores.id_proveedor} />
                        <input type="number" name="cantidad" defaultValue={cantidad} />
                    </form>
                </td>
                <td className="txt-center">
                    <p>{precio}$</p>
                </td>
                <td className="txt-center">
                    <p>{subtotal}$</p>
                </td>
                <td>

                </td>
            </tr >
        </>
    )
}

export default Product