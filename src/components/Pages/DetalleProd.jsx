import Footer from "../Footer"
import Header from "../Header"
import { useState, useEffect, use } from "react"
import { useParams } from "react-router-dom"
import { getProductById } from "../../js/supabase"

const DetalleProd = () => {
    const [productId, setProductId] = useState(useParams().id_prod)
    const [product, setProduct] = useState()

    useEffect(() => {
        const fetchProduct = async () => {
            await getProductById(productId).then(data => {
                data = {...data, descripcion: data.descripcion.replace('.','')}
                setProduct(data)
                console.log(data)
            })
        }
        fetchProduct()
    }, [])
    if (!product) {
        return <div className="loader"></div>
    }
    else {
        return (
            <>
                <Header />
                <section className="section product-detail">
                    <div className="details container">
                        <div className="left image-container">
                            <div className="main">
                                <img src={product.imagen} id="zoom" alt="" style={{ visibility: "visible" }} />
                            </div>
                        </div>
                        <div className="right">
                            <span>{product.nombre_producto + " - " + product.color}</span>
                            <h1>{product.descripcion}</h1>
                            <div className="price">$ {product.precio_producto}</div>
                            <form>
                                <div style={{ position: "relative" }}>
                                    <select>
                                        <option value="Select Size" disabled="">
                                            Selecciona la talla
                                        </option>
                                        {product.talla.split(',').map((talla, index) => {
                                            return <option key={index} value={talla}>{talla}</option>
                                        })}
                                    </select>
                                    <span><i className="bx bx-chevron-down"></i></span>
                                </div>
                            </form>
                            <form className="form">
                                <input type="text" placeholder="1" />
                                <a href="cart.php" className="addCart">Añadir al carrito</a>
                            </form>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        )
    }
}
export default DetalleProd