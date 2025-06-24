import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import { supabase } from '../../js/supabase'
import Product from '../Product'
const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchCarrito = async () => {
            supabase.schema('mrstore2').from('detcarritocompras').select(`id_carritocompras, cantidad, subtotal, 
                detproductos(
                            precio_producto,
                            proveedores(id_proveedor, nombre_proveedor),
                            colores(id_color, color),
                            tallas(id_talla, talla), 
                            productos(id_producto, nombre_producto, descripcion, imagen_url))`).then(data => {
                setCartItems(data.data)
                setLoading(false)

            })
            supabase.schema('mrstore2').from('carritocompras').select(`total`).then(data => {
                if (data.data.length > 0) {
                    setTotalPrice(data.data[0].total)
                }
            })
        }
        fetchCarrito()
    }, [])

    if (loading) {
        return (
            <>
                <Header />
                <div className='top-nav hei'></div>
                <h1 className="title">Carrito de compras</h1>
                <p className='title'>Cargando...</p>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <br />
            <h1 className='title'>Carrito de compras</h1>
            <div className='flex-container' style={{ alignItems: 'self-start' }}>
                <table className='cart-table'>
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Descripcion</th>
                            <th style={{ width: '30%' }}>Detalles</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Cantidad</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Precio</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) =>{
                            return (
                                <Product key={item.detproductos.productos.id_producto + item.detproductos.colores.id_color } producto={item} />
                            )
                        })}
                        {/* <Product producto={cartItems[0]}></Product> */}
                        {/* <Product producto={cartItems[0]}></Product> */}
                    </tbody>
                </table>
                {cartItems.length > 0 ? (<div className='cart-total'>
                    <h2 className='title'>Resumen de carrito</h2>
                    <p>Total a pagar: <strong>{totalPrice}$</strong></p>
                </div>) : null }
                
            </div>
            {cartItems.length > 0 ? null : (<p className='title'>El carrito esta vacio</p>)}

            <Footer />
        </>
    )
}

export default Cart