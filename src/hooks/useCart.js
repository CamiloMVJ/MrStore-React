import { useState, useEffect, use } from 'react'
import { getTable } from '../services/supabase'
import { useParams } from 'react-router-dom'
import {
    actualizarDireccionPrincipal,
    fetchCarrito,
    fetchDirecciones,
    fetchPrecioxKG,
    fetchTotal,
    generarPedido,
} from '../services/cartService'

export const useCart = () => {
    const [loading, setLoading] = useState(true)

    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [ActCarrito, setActCarrito] = useState(false)
    const [LoadedCart, setLoadedCart] = useState(false)

    const [DirActiva, setDirActiva] = useState(null)
    const [Envio, setEnvio] = useState(0)
    const session = JSON.parse(sessionStorage.getItem('session'))
    const [LoadedDirs, setLoadedDirs] = useState(false)
    const [direcciones, setDirecciones] = useState([])


    useEffect(() => {
        const loadCart = async () => {
            try {
                const carrito = await fetchCarrito()
                // console.log('Carrito cargado:', carrito)
                setCartItems(carrito)

                const total = await fetchTotal()
                setTotalPrice(total)
            } catch (error) {
                console.error('Error al cargar el carrito:', error)
            }
            finally {
                setLoadedCart(true)
            }
        }

        loadCart()
    }, [ActCarrito])

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
                        setLoadedDirs(true)
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
        const loaded = async () => {
            if (LoadedCart && LoadedDirs) {
                setLoading(false)
            }
        }
        loaded()
    }, [LoadedCart, LoadedDirs])

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

    return {
        cartItems, totalPrice, ActCarrito, DirActiva, Envio, direcciones, loading, session,
        setActCarrito, setDirActiva, handleDirChange, refreshShipping
    }
}