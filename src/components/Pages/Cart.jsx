import React, { act, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import { supabase } from '../../js/supabase'
import Product from '../Product'

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    const [ActTotal, setActTotal] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            supabase.schema('mrstore2').from('carritocompras').select(`total`).then(data => {
                if (data.data.length > 0) {
                    setTotalPrice(data.data[0].total)
                }
            })
        }, 100)
    }, [ActTotal])

    const updateTotal = () => {
        setActTotal(!ActTotal)
    }
    const actualizarProductos = () => {

    }

    const fetchCarrito = async () => {
        supabase.schema('mrstore2').from('detcarritocompras').select(`id_carritocompras, cantidad, subtotal, 
                detproductos(
                            proveedores(id_proveedor, nombre_proveedor),
                            colores(id_color, color),
                            tallas(id_talla, talla),
                            productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto))`)
            .order('id_producto', { ascending: false })
            .then(data => {
                // console.log(data)
                if (data.data.length === 0) {
                    setCartItems([])
                    setLoading(false)
                    return
                }
                console.log(data.data)
                setCartItems(data.data)
                setLoading(false)
            })
        supabase.schema('mrstore2').from('carritocompras').select(`total`).then(data => {
            if (data.data.length > 0) {
                setTotalPrice(data.data[0].total)
            }
        })
    }
    useEffect(() => {
        fetchCarrito()
    }, [])

    if (loading) {
        return (
            <>
                <Header />
                <br />
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
            <div className='center'>
                <div className='flex-container center bgshadow' style={{ alignItems: 'self-start' }}>
                    {cartItems.length > 0 ? (
                        <table className='cart-table '>
                            <thead>
                                <tr>
                                    <th style={{ width: '20%' }}>Descripcion</th>
                                    <th style={{ width: '30%' }}>Detalles</th>
                                    <th style={{ width: '20%', textAlign: 'center' }}>Cantidad</th>
                                    <th style={{ width: '20%', textAlign: 'center' }}>Precio</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => {
                                    return (
                                        <Product ActualizarTotal={updateTotal} ActualizarProductos={fetchCarrito} key={item.detproductos.productos.id_producto} producto={item} />
                                    )
                                })}
                            </tbody>
                        </table>) : null}

                    {cartItems.length > 0 ? (<div className='cart-total'>
                        <h2 className='title'>Resumen de carrito</h2>
                        <p className='center'>Total a pagar: <strong>{totalPrice}$</strong></p>
                    </div>) : null}

                </div>
            </div>
            {cartItems.length > 0 ? null : (<p className='title margin'>El carrito esta vacio</p>)}


            <Footer />
        </>
    )
}

export default Cart