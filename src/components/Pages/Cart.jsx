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
    const [direcciones, setDirecciones] = useState([])
    const [DirActiva, setDirActiva] = useState(null)
    const [session, setSession] = useState(JSON.parse(sessionStorage.getItem('session')))

    useEffect(() => {
        const timer = setTimeout(() => {
            supabase.schema('mrstore2').from('carritocompras').select(`total`).then(data => {
                if (data.data.length > 0) {
                    setTotalPrice(data.data[0].total)
                }
            })
        }, 100)
    }, [ActTotal])

    useEffect(() => {
        fetchCarrito()
        fetchDirecciones()
    }, [])

    const fetchDirecciones = async () => {
        supabase.schema('mrstore2').from('direcciones').select()
            .eq('id_cliente', session.id_cliente)
            .eq('estado', true)
            .then(data => {
                if (data.data.length > 0) {
                    let id = data.data.filter(dir => dir.es_principal === true)
                    setDirecciones(data.data)
                    if (id.length == 1) {
                        setDirActiva(id[0].id_direccion)
                        return
                    }
                    return
                }
                setDirActiva('')
            })
    }

    const updateTotal = () => {
        setActTotal(!ActTotal)
    }
    const actualizarProductos = () => {

    }

    const handleDirChange = (e) => {
        e.preventDefault()
        const selectedId = Number(e.target.value)
        // Validar que haya direcciones y que el id exista
        if (!direcciones || direcciones.length === 0) {
            console.error("No hay direcciones disponibles.")
            return
        }
        const selectedDir = direcciones.find(dir => dir.id_direccion === selectedId)
        if (!selectedDir) {
            console.error("Dirección seleccionada no válida.")
            return
        }
        setDirActiva(selectedId)
        // Validar que session y session.id_cliente existan
        if (!session || !session.id_cliente) {
            console.error("Sesión inválida. Por favor inicie sesión nuevamente.")
            return
        }
        updateTable('direcciones', session.id_cliente, 'id_cliente', { es_principal: false }).then((data) => {
            if (data) {
                updateTable('direcciones', selectedId, 'id_direccion', { es_principal: true }).then(data => {
                    if (!data) {
                        console.error("Error al actualizar la direccion principal")
                    }
                })
            }
        })
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
                // console.log(data.data)
                setCartItems(data.data)
                setLoading(false)
            })
        supabase.schema('mrstore2').from('carritocompras').select(`total`).then(data => {
            if (data.data.length > 0) {
                setTotalPrice(data.data[0].total)
            }
        })
    }

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
                        <table className='cart-table'>
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
                        <div className='flex' style={{justifyContent: "center" , alignItems: "baseline"}}>
                            <label htmlFor=""> Diccion de envio</label>
                            <select className="selector" style={{ width: "100px", textAlign: "center", height: "25px", marginBottom: "20px" }} name="direccion" value={DirActiva} onChange={handleDirChange}>
                                {DirActiva === '' ? (<option value="" disabled>Seleccione una direccion</option>) : null}
                                {direcciones.map((dir, index) => {
                                    return (
                                        <option key={index} value={dir.id_direccion} >
                                            {dir.nombre_dir}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>

                        <p className='center'>Total a pagar: <strong>{totalPrice}$</strong></p>
                        <div className='center'>
                            <Link to='/checkout' className='btn btn-primary'>Pagar</Link>
                        </div>
                    </div>) : null}

                </div>
            </div>
            {(cartItems.length <= 0 && session == null) ? null : (<p className='title margin'>El carrito esta vacio</p>)}
            {session ? null : (<p className='title margin'>Para realizar una compra, por favor <Link className="colorPurple" to='/login'>Login</Link></p>)}


            <Footer />
        </>
    )
}

export default Cart