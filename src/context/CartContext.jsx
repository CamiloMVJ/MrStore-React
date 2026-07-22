import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchCarrito } from '../services/cartService'
import { fetchPerfil } from '../services/perfilService'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [envio, setEnvio] = useState(0)
    const [loading, setLoading] = useState(true)
    const [reloadCats, setReloadCats] = useState(false)

    const [perfil, setPerfil] = useState(null)
    const [session, setSession] = useState(() => {
        return JSON.parse(sessionStorage.getItem('session'))
    })

    const cargarCarrito = async () => {
        // setLoading(true)
        try {
            const data = await fetchCarrito().then((items) => {
                setCartItems(items)
                // console.log('Carrito cargado:', items)
            })
        } catch (error) {
            console.error("Error al cargar carrito global:", error)
        } finally {
            // setLoading(false)
        }
    }

    useEffect(() => {
        cargarCarrito()
        fetchPerfil(session).then((data) => {
            setPerfil(data)
        })
    }, [])

    useEffect(() => {
        if (cartItems.length > 0) {
            const costoEnvio = cartItems.reduce((acc, item) => acc + (item.cantidad * 0.375), 0)
            setEnvio(costoEnvio)
        } else {
            setEnvio(0)
        }
    }, [cartItems])



    return (
        <CartContext.Provider value={{
            cartItems,
            totalPrice,
            envio,
            loading: loading,
            reloadCats,
            perfil,
            session,
            cargarCarrito,
            setCartItems,
            setReloadCats,
            setPerfil
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)
    // console.log(context)
    if (!context) {
        throw new Error("useCartContext debe ser usado dentro de un CartProvider")
    }
    return context
}