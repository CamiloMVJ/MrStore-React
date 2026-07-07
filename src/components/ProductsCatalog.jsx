// ProductsCatalog.js
import { addOneProductToCart } from "../services/cartService"
import { useState } from 'react'

const ProductsCatalog = ({ productos }) => {
    const [addingToCart, setAddingToCart] = useState(null)
    
    const handleProductDetail = (e, id) => {
        e.preventDefault()
        window.location.href = `/DetProd/${id}`
    }

    const handleAddToCart = async (e, productId) => {
        e.preventDefault()
        setAddingToCart(productId)
        try {
            const session = JSON.parse(sessionStorage.getItem('session'))
            if (!session || !session.id_carrito) {
                alert('Debes iniciar sesión para agregar productos al carrito')
                window.location.href = '/login'
                return
            }
            await addOneProductToCart(session.id_carrito, productId)
        } catch (error) {
            console.error("Error adding to cart:", error)
        } finally {
            setTimeout(() => {
                setAddingToCart(null)
            },700)
        }
    }

    return (
        <>
        <div className="products-grid">
            {productos.map(producto => (
                <div className="product-card" key={producto.id_producto}>
                    {/* Product Image */}
                    <div className="product-image-container">
                        <button 
                            onClick={(e) => handleProductDetail(e, producto.id_producto)}
                            className="product-image-btn"
                            aria-label="Ver detalles del producto"
                        >
                            {/* {console.log(producto.imagen_url)} */}
                            <img 
                                src={producto.imagen_url || '/placeholder-product.jpg'} 
                                alt={producto.nombre_producto} 
                                className="product-image"
                                onError={(e) => {
                                    e.target.src = '/placeholder-product.jpg'
                                }}
                            />
                        </button>
                        {/* Add to Cart Button */}
                        <button
                            onClick={(e) => handleAddToCart(e, producto.id_producto)}
                            className="add-to-cart-btn"
                            disabled={addingToCart === producto.id_producto}
                            aria-label="Añadir al carrito"
                        >
                            {addingToCart === producto.id_producto ? (
                                <span className="spinner"></span>
                            ) : (
                                <i className="bx bx-cart"></i>
                            )}
                        </button>
                    </div>
                    {/* Product Info */}
                    <div className="product-info">
                        <h3 className="product-name">{producto.nombre_producto}</h3>
                        <p className="product-description">{producto.descripcion}</p>
                        <div className="product-footer">
                            <span className="product-price">${producto.precio_producto}</span>
                            <button 
                                onClick={(e) => handleProductDetail(e, producto.id_producto)}
                                className="view-details-btn"
                            >
                                Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}

export default ProductsCatalog