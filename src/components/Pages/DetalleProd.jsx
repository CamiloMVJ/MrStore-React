import Footer from "../Footer"
import Header from "../Header"
import { useState, useEffect, use } from "react"
import { useParams } from "react-router-dom"
import { getProductById, supabase, addProductToCart } from "../../js/supabase"
import Notification from "../Notification"

const DetalleProd = () => {
    const [productId, setProductId] = useState(useParams().id_prod)
    const [product, setProduct] = useState()
    const [message, setMessage] = useState("Cargando producto...")
    const [colorYtalla, setColorYTalla] = useState([])
    const [indexColorYTalla, setIndexColorYTalla] = useState(0)
    const [cantidad, setCantidad] = useState(1)
    const [messageError, setMessageError] = useState(null)
    const [typeError, setTypeError] = useState(null)

    useEffect(() => {
        if (message === null) return
        const timer = setTimeout(() => {
            setMessageError(null)
            setTypeError(null)
        }, 5000)
    }, [messageError])

    const Addcart = (e) => {
        e.preventDefault()
        let session = sessionStorage.getItem('session') ? JSON.parse(sessionStorage.getItem('session')) : undefined
        if (!session) {
            setMessageError("Debes iniciar sesión para agregar productos al carrito")
            setTypeError("error")
            return
        }
        if (!indexColorYTalla || indexColorYTalla === "Select Size") {
            setMessageError("Debes seleccionar un color y talla")
            setTypeError("error")
            return
        }
        if (cantidad <= 0) {
            setMessageError("La cantidad debe ser mayor a 0")
            setTypeError("error")
            return
        }
        if (indexColorYTalla) {
            addProductToCart(session.id_carrito, product.id_producto, colorYtalla[indexColorYTalla].colores.id_color,
                colorYtalla[indexColorYTalla].tallas.id_talla, product.id_proveedor, cantidad).then(({ message, type }) => {
                    setMessageError(message)
                    setTypeError(type)
                })
        }
    }

    const handleColoryTalla = (e) => {
        setIndexColorYTalla(e.target.value)
    }

    useEffect(() => {
        const fetchColorYTalla = async () => {
            const { data, error } = await supabase.schema('mrstore2').from('detproductos')
                .select('colores(id_color,color), tallas(id_talla, talla)')
                .eq('id_producto', productId)
            setColorYTalla(data)
        }
        fetchColorYTalla()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("No se encontró el producto con ID: " + productId)
        }, 10000)
    }, [])

    useEffect(() => {
        const fetchProduct = async () => {
            getProductById(productId).then(data => {
                if (data.length === 0) {
                    console.error("No se encontró el producto con ID:", productId)
                }
                setProduct({ ...data[indexColorYTalla], descripcion: data[indexColorYTalla].descripcion.replace('.', '') })
                // console.log(data)
            })
        }
        fetchProduct()
    }, [indexColorYTalla])
    if (!product) {
        return (
            <div className="container center allheight">
                <div className="loader"></div>
                <h1>{message}</h1>
            </div>
        )
    }
    else {
        return (
            <>
                <Header />
                <section className="section product-detail btmSpace">
                    <div className="details container">
                        <div className="left image-container">
                            <div className="main">
                                <img src={product.imagen_url} className="my-foto" alt="" style={{ visibility: "visible" }} />
                            </div>
                        </div>
                        <div className="right">
                            <span>{product.nombre_producto}</span>
                            <h1>{product.descripcion}</h1>
                            <div className="price">$ {product.precio_producto}</div>
                            <form>
                                <div style={{ position: "relative" }}>
                                    <select onChange={handleColoryTalla}>
                                        <option value="Select Size">
                                            Selecciona la talla y color
                                        </option>
                                        {Array.isArray(colorYtalla) && colorYtalla.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.tallas.talla} Y {item.colores.color}
                                            </option>
                                        ))}

                                    </select>
                                    <span><i className="bx bx-chevron-down"></i></span>
                                </div>
                            </form>
                            <form className="form" onSubmit={Addcart}>
                                <input type="number" placeholder="" defaultValue={cantidad} onChange={(e) => { setCantidad(e.target.value) }} />
                                <button className="addCart" type="submit">Añadir al carrito</button>
                            </form>
                            <Notification message={messageError} type={typeError}></Notification>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        )
    }
}
export default DetalleProd