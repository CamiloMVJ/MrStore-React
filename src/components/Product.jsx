import { useState, useEffect } from 'react'
import { supabase } from '../js/supabase'

const Product = ({ producto }) => {
    const [tallas, setTallas] = useState()
    const [colores, setColores] = useState()

    useEffect(() => {
        const fetchTallas = async () => {
            const { data, error } = await supabase.schema('mrstore2').from('detproductos').select('tallas(id_talla, talla)').eq('id_producto', producto.detproductos.productos.id_producto)
            setTallas(data.map(talla => talla.tallas))
        }
        fetchTallas()
    }, [])
    useEffect(() => {
        const fetchColores = async () => {
            const { data, error } = await supabase.schema('mrstore2').from('detproductos').select('colores(id_color, color)').eq('id_producto', producto.detproductos.productos.id_producto)
            setColores([...new Map(data.map(color => [color.colores.id_color, color.colores])).values()])
            console.log([...new Map(data.map(color => [color.colores.id_color, color.colores])).values()])
        }
        fetchColores()
    }, [])

    const handleChange = (e) => {
        document.getElementById("miFormulario").submit(); // Envío automático
    };

    const ActualizarCantidad = (e) => {
        e.preventDefault()
    }

    const EliminarDelCarrito = (e) => {
        e.preventDefault()
    }

    const ActualizarTalla = (e) => {
        e.preventDefault()
    }

    const ActualizarColor = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
                <td>
                    <div className="cart-info">
                        <img className="cart-img" src={producto.detproductos.productos.imagen_url} alt="product-image" />
                        <div className="cart-text">
                            <p><strong>{producto.detproductos.productos.nombre_producto}</strong></p>
                            <span>{producto.detproductos.productos.descripcion}</span> <br />
                            <span>{ }</span>
                            <form onSubmit={EliminarDelCarrito} method="POST" style={{ display: 'inline' }}>
                                <input type="hidden" name="id_carrito" defaultValue={producto.id_carritocompras} />
                                <input type="hidden" name="id_producto" defaultValue={producto.detproductos.productos.id_producto} />
                                <input type="hidden" name="id_color" defaultValue={producto.detproductos.colores.id_color} />
                                <input type="hidden" name="id_talla" defaultValue={producto.detproductos.tallas.id_talla} />
                                <input type="hidden" name="id_proveedor" defaultValue={producto.detproductos.proveedores.id_proveedor} />
                                <button type="submit" className="btn btn-danger btn-sm">Eliminar del carrito</button>
                            </form>
                        </div>
                    </div>
                </td>
                <td className="txt-center">
                    <table>
                        <tbody>
                            <tr>
                                <td>Talla</td>
                                <td>
                                    <form id='TallasForm' method="POST" onSubmit={ActualizarTalla} style={{ display: 'inline' }}>
                                        <input type="hidden" name="id_carrito" defaultValue={producto.id_carritocompras} />
                                        <input type="hidden" name="id_producto" defaultValue={producto.detproductos.productos.id_producto} />
                                        <input type="hidden" name="id_color" defaultValue={producto.detproductos.colores.id_color} />
                                        <input type="hidden" name="id_talla" defaultValue={producto.detproductos.tallas.id_talla} />
                                        <input type="hidden" name="id_proveedor" defaultValue={producto.detproductos.proveedores.id_proveedor} />
                                        <div style={{ display: 'flex' }}>
                                            <select name="Talla" className='form-select'>
                                                {Array.isArray(tallas) && tallas.map(talla => (
                                                    <option key={Math.random() * 15} defaultValue={talla.id_talla}>
                                                        {talla.talla}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <td>Color</td>
                                <td>
                                    <form id="ColorForm" method="POST" onSubmit={ActualizarColor} style={{ display: 'inline' }}>
                                        <input type="hidden" name="id_carrito" defaultValue={producto.id_carritocompras} />
                                        <input type="hidden" name="id_producto" defaultValue={producto.detproductos.productos.id_producto} />
                                        <input type="hidden" name="id_color" defaultValue={producto.detproductos.colores.id_color} />
                                        <input type="hidden" name="id_talla" defaultValue={producto.detproductos.tallas.id_talla} />
                                        <input type="hidden" name="id_proveedor" defaultValue={producto.detproductos.proveedores.id_proveedor} />
                                        <div style={{ display: 'flex' }}>
                                            <select name="Color" className='form-select' >
                                                {Array.isArray(colores) && colores.map(color => (
                                                    <option key={Math.random() * 15} defaultValue={color.id_color}>
                                                        {color.color}
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
                        <input type="hidden" name="id_carrito" defaultValue={producto.id_carritocompras} />
                        <input type="hidden" name="id_producto" defaultValue={producto.detproductos.productos.id_producto} />
                        <input type="hidden" name="id_color" defaultValue={producto.detproductos.colores.id_color} />
                        <input type="hidden" name="id_talla" defaultValue={producto.detproductos.tallas.id_talla} />
                        <input type="hidden" name="id_proveedor" defaultValue={producto.detproductos.proveedores.id_proveedor} />
                        <input type="number" name="cantidad" defaultValue={1} />
                        <button type="submit" style={{ display: 'none' }}>Actualizar</button>
                    </form>
                </td>
                <td className="txt-center">
                    <p>{producto.detproductos.productos.precio_producto}$</p>
                </td>
                <td className="txt-center">

                </td>
            </tr >

        </>
    )
}

export default Product