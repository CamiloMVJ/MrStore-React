import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Product from '../components/Product'
import Notification from '../components/Notification'
import {
    actualizarDireccionPrincipal,
    fetchCarrito,
    fetchDirecciones,
    fetchPrecioxKG,
    fetchTotal,
    generarEnvio,
    generarPago,
    generarPedido,
} from '../services/cartService'

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    const [direcciones, setDirecciones] = useState([])
    const [DirActiva, setDirActiva] = useState(null)
    const session = JSON.parse(sessionStorage.getItem('session'))
    const [Descuento, setDescuento] = useState(0)
    const [Envio, setEnvio] = useState(0)
    const [ActCarrito, setActCarrito] = useState(false)
    const [PopUpPago, setPopUpPago] = useState(false)
    const [banco, setBanco] = useState('')
    const [numTransferencia, setNumTransferencia] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')

    useEffect(() => {
        if (message === null) return
        const timer = setTimeout(() => {
            setMessage(null)
            setType(null)
        }, 3000)
        return () => clearTimeout(timer)
    }, [message])

    useEffect(() => {
        const loadDirecciones = async () => {
            if (!session?.id_cliente) {
                setDirActiva('')
                return
            }

            try {
                const direccionesData = await fetchDirecciones(session.id_cliente)
                setDirecciones(direccionesData)

                if (direccionesData.length > 0) {
                    const principal = direccionesData.filter(dir => dir.es_principal === true)
                    if (principal.length === 1) {
                        setDirActiva(principal[0].id_direccion)
                        const shippingData = await fetchPrecioxKG(principal[0].id_direccion, session.id_carrito)
                        setEnvio(shippingData.envio)
                        return
                    }
                    return
                }

                setDirActiva('')
            } catch (error) {
                console.error(error)
                setDirActiva('')
            }
        }

        loadDirecciones()
        setActCarrito(prev => !prev)
    }, [])

    useEffect(() => {
        const loadCart = async () => {
            try {
                const carrito = await fetchCarrito()
                console.log('Carrito cargado:', carrito)
                setCartItems(carrito)

                const total = await fetchTotal()
                setTotalPrice(total)

                if (DirActiva && session?.id_carrito) {
                    const shippingData = await fetchPrecioxKG(DirActiva, session.id_carrito)
                    setEnvio(shippingData.envio)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadCart()
    }, [ActCarrito])

    const refreshShipping = async (idDir) => {
        try {
            if (!idDir || !session?.id_carrito) {
                return
            }

            const shippingData = await fetchPrecioxKG(idDir, session.id_carrito)
            setEnvio(shippingData.envio)
        }
        catch (error) {
            console.error(error)
        }
    }



    const ValidarStock = () => {
        const hayStockInsuficiente = cartItems.some(item => {
            if (item.detproductos.stock < item.cantidad) {
                setMessage(`El producto ${item.detproductos.productos.nombre_producto} no tiene suficiente stock, solo hay ${item.detproductos.stock} unidades disponibles`)
                setType('error')
                return true // Retorna true si hay stock insuficiente
            }
            return false
        })
        if (hayStockInsuficiente) return false
        return true
    }

    const GenerarPedido = async (e) => {
        e.preventDefault()
        try {
            if (cartItems.length === 0) {
                setMessage("El carrito está vacío.")
                setType("error")
                return
            }
            if (DirActiva === "") {
                console.error("Por favor seleccione una direccion de envio")
                return
            }
            if (ValidarStock()) {
                const idPedido = await generarPedido(session.id_cliente)
                if (idPedido) {
                    GenerarPago(e, idPedido)
                }
            }
            else{
                setPopUpPago(!PopUpPago)
            }
        }
        catch (error) {
            console.error("Error al generar el pedido:", error)
        }
    }

    const GenerarPago = async (e, id_pedido) => {
        e.preventDefault()
        const transferencia =  numTransferencia
        const banco = banco
        if (!transferencia || !banco) {
            console.error("Por favor complete todos los campos")
            return
        }
        // Validar que session y session.id_cliente existan
        if (!session || !session.id_cliente) {
            console.error("Sesión inválida. Por favor inicie sesión nuevamente.")
            return
        }
        try {
            await generarPago({
                id_pedido,
                transferencia,
                banco,
                monto: (totalPrice + Envio - Descuento),
            })
        }
        catch (error) {
            console.error("Error al generar el pago:", error.message)
            return
        }
        // window.location.reload()
        GenerarEnvio(id_pedido)
        setPopUpPago(false)
        setCartItems([])
    }

    const GenerarEnvio = async (id_pedido) => {
        try {
            if (DirActiva === 0) {
                console.error("Por favor seleccione una direccion de envio")
                return
            }
            await generarEnvio({
                descuento: Descuento,
                costo_envio: Envio,
                id_pedido,
                id_direccion: DirActiva,
            })
        }
        catch (error) {
            console.error("Error al generar el envio:", error)
        }
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
        actualizarDireccionPrincipal(session.id_cliente, selectedId).then((data) => {
            if (data) {
                refreshShipping(selectedId)
                setActCarrito(prev => !prev)
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
            <Notification message={message} type={type} />
            <div className='center'>
                {session ? (
                    <div className='flex-container center bgshadow' style={{ display: cartItems.length > 0 ? 'flex' : 'none', alignItems: 'self-start', marginBottom: "20px", paddingBottom: "20px" }}>
                        {cartItems.length > 0 ? (
                            <>
                                <table className='cart-table'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>Descripcion</th>
                                            <th style={{ width: '20%' }}>Detalles</th>
                                            <th style={{ width: '20%', textAlign: 'center' }}>Cantidad</th>
                                            <th style={{ width: '20%', textAlign: 'center' }}>Precio</th>
                                            <th style={{ width: '10%', textAlign: 'center' }}>Subtotal</th>
                                            <th style={{ width: '10%', textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => {
                                            return (
                                                <Product ActualizarProductos={() => setActCarrito(!ActCarrito)} key={(item.detproductos.productos.id_producto + item.detproductos.tallas.id_talla)} producto={item} />
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className='cart-total'>
                                    <h2 className='title'>Resumen de carrito</h2>
                                    <div className='flex' style={{ justifyContent: "center", alignItems: "baseline" }}>
                                        <label htmlFor=""> Diccion de envio</label>
                                        <select className="selector" style={{ width: "100px", textAlign: "center", height: "25px", marginBottom: "20px" }} name="direccion" value={DirActiva || ""} onChange={handleDirChange}>
                                            {DirActiva === '' ? (<option value="" disabled>Seleccione una direccion</option>) : null}
                                            {direcciones.map((dir, index) => {
                                                return (
                                                    <option key={index} value={dir.id_direccion}>
                                                        {dir.nombre_dir}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='bgshadow flex' style={{ width: "80%", margin: "0 auto" }}>
                                        <table className='summaryTable'>
                                            <tbody>
                                                <tr>
                                                    <td>Subtotal por productos</td>
                                                    <td style={{ textAlign: "right" }}>{totalPrice}$</td>
                                                </tr>
                                                <tr>
                                                    <td>Descuentos</td>
                                                    <td style={{ textAlign: "right" }}>{Descuento}$</td>
                                                </tr>
                                                <tr style={{ borderBottom: "1px solid #ccc" }}>
                                                    <td>Costo del envio</td>
                                                    <td style={{ textAlign: "right" }}>{Envio}$</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "right" }}><strong>Total</strong></td>
                                                    <td><strong>{totalPrice + Envio - Descuento} $</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='center' style={{ marginTop: "20px" }}>
                                        <button className='btn-1' style={{ textAlign: "center" }} onClick={() => {
                                            if (DirActiva === null || DirActiva === '') {
                                                setMessage("Por favor seleccione una direccion de envio")
                                                setType("error")
                                                return
                                            }
                                            setPopUpPago(!PopUpPago)
                                        }}>Pagar</button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {(cartItems.length <= 0 && session != null) ? (<p className='title margin'>El carrito esta vacio</p>) : null}
            {session ? null : (<p className='title margin'>Para realizar una compra, por favor <Link className="colorPurple" to='/login'>Login</Link></p>)}

            <div className='checkPopUp center' style={{ display: PopUpPago ? 'flex' : 'none' }}>
                <div className='bg-black' style={{ padding: "20px", borderRadius: "10px", width: "400px" }}>
                    <form className='table' onSubmit={GenerarPedido}>
                        <h2 htmlFor="confirmacion" style={{ color: "white" }}>¿Desea confirmar su pedido?</h2>
                        <p className='colorWhite'>Total a pagar: {totalPrice + Envio - Descuento} $</p>
                        <input type="text" value={numTransferencia} name="transferencia" placeholder="Ingrese el numero de transferencia" onChange={(e) => setNumTransferencia(e.target.value)} required />
                        <select name="banco" value={banco} onChange={(e) => setBanco(e.target.value)} required>
                            <option value="">Selecione el banco</option>
                            <option value="BAC 1234567-8901234">BAC 1234567-8901234</option>
                            <option value="LAFISE 5432109-87654">LAFISE 5432109-87654</option>
                        </select>
                        <div style={{ display: "flex", gap: "10px", width: "240px", justifyContent: "space-between", marginTop: "5px" }}>
                            <button type="button" className="btn-1" onClick={() => {
                                setBanco('')
                                setNumTransferencia('')
                                setPopUpPago(!PopUpPago)
                            }}>Cancelar</button>
                            <button type="submit" className="btn-1">Confirmar</button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Cart