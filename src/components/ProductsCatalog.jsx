// ProductsCatalog.js
import { addProductToCart } from "../js/supabase"
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
            await addProductToCart(session.id_carrito, productId, 1)
            // Aquí puedes añadir una notificación de éxito si lo deseas
        } catch (error) {
            console.error("Error adding to cart:", error)
        } finally {
            setAddingToCart(null)
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
        <style jsx>{`
            /* Base Styles */
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 2rem;
                padding: 1rem 0;
            }
            .product-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
            }
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(138, 79, 255, 0.15);
            }
            .product-image-container {
                position: relative;
                height: 250px;
                overflow: hidden;
            }
            .product-image-btn {
                width: 100%;
                height: 100%;
                padding: 0;
                border: none;
                background: none;
                cursor: pointer;
            }
            .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
            .product-image-btn:hover .product-image {
                transform: scale(1.05);
            }
            .add-to-cart-btn {
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #8a4fff;
                color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            .add-to-cart-btn:hover {
                background: #7b3aff;
                transform: scale(1.1);
            }
            .add-to-cart-btn:disabled {
                background: #b18aff;
            }
            .add-to-cart-btn i {
                font-size: 1.5rem;
            }
            .spinner {
                width: 24px;
                height: 24px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .product-info {
                padding: 1.5rem;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }
            .product-name {
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
                color: #333;
            }
            .product-description {
                color: #666;
                font-size: 0.95rem;
                margin-bottom: 1rem;
                flex-grow: 1;
            }
            .product-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;
            }
            .product-price {
                font-size: 1.3rem;
                font-weight: 700;
                color: #8a4fff;
            }
            .view-details-btn {
                background: none;
                border: none;
                color: #8a4fff;
                font-weight: 600;
                cursor: pointer;
                padding: 0.5rem;
                transition: all 0.2s;
            }
            .view-details-btn:hover {
                color: #7b3aff;
                text-decoration: underline;
            }
            @media (max-width: 1024px) {
                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.5rem;
                }
                .product-image-container {
                    height: 220px;
                }
            }
            @media (max-width: 768px) {
                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1.2rem;
                }
                .product-info {
                    padding: 1rem;
                }
                .product-name {
                    font-size: 1.1rem;
                }
            }
            @media (max-width: 576px) {
                .products-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .product-image-container {
                    height: 180px;
                }
                .add-to-cart-btn {
                    width: 40px;
                    height: 40px;
                    bottom: 10px;
                    right: 10px;
                }
                .product-name {
                    font-size: 1rem;
                }
                .product-description {
                    font-size: 0.85rem;
                }
                .product-price {
                    font-size: 1.1rem;
                }
            }
            @media (max-width: 400px) {
                .products-grid {
                    grid-template-columns: 1fr;
                }
            }
        `}</style>
        </>
    )
}

export default ProductsCatalog