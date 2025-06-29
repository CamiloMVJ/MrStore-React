import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { supabase } from '../../js/supabase';

const OrderDetails = () => {
    const { orderId } = useParams().id_pedido;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data, error: supabaseError } = await supabase.schema('mrstore2').from('DetPedidos')
                    .select(`
                        SubTotal, 
                        Cantidad, 
                        PrecioVenta,
                        Pedidos(id_Pedidos),
                        detproductos(
                            proveedores(id_proveedor, nombre_proveedor),
                            colores(id_color, color),
                            tallas(id_talla, talla), 
                            productos(id_producto, nombre_producto, descripcion, precio_producto, imagen_url))`
                        
                    )
                    .eq('id_Pedidos', orderId)
                    .single();

                if (supabaseError) throw supabaseError;
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusStyle = (status) => {
        const styles = {
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'inline-block',
            marginLeft: '1rem'
        };

        const statusMap = {
            'completado': { backgroundColor: '#e6f7e6', color: '#2e7d32' },
            'procesando': { backgroundColor: '#fff8e1', color: '#ff8f00' },
            'cancelado': { backgroundColor: '#ffebee', color: '#c62828' },
            'enviado': { backgroundColor: '#e3f2fd', color: '#1565c0' },
            'pendiente': { backgroundColor: '#f5f5f5', color: '#666' }
        };

        return { ...styles, ...statusMap[status.toLowerCase()] };
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Cargando detalles del pedido...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div style={styles.errorContainer}>
                    <i className="bx bx-error-circle" style={styles.errorIcon}></i>
                    <h3 style={styles.errorTitle}>Error al cargar el pedido</h3>
                    <p style={styles.errorText}>{error}</p>
                    <Link to="/Pedidos" style={styles.backButton}>
                        Volver al historial
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Header />
                <div style={styles.notFoundContainer}>
                    <i className="bx bx-package" style={styles.notFoundIcon}></i>
                    <h3 style={styles.notFoundTitle}>Pedido no encontrado</h3>
                    <p style={styles.notFoundText}>No se encontró el pedido #{orderId}</p>
                    <Link to="/Pedidos" style={styles.backButton}>
                        Volver al historial
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <section style={styles.section}>
                <div style={styles.container}>
                    <Link to="/historial-pedidos" style={styles.backLink}>
                        <i className="bx bx-arrow-back"></i> Volver al historial
                    </Link>

                    <div style={styles.header}>
                        <h1 style={styles.title}>Detalles del Pedido #{order.id_pedido}</h1>
                        <div style={getStatusStyle(order.estado)}>
                            {order.estado}
                        </div>
                    </div>

                    <div style={styles.orderInfoContainer}>
                        <div style={styles.infoCard}>
                            <h3 style={styles.infoTitle}>Información del Pedido</h3>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Fecha:</span>
                                    <span>{formatDate(order.fecha_pedido)}</span>
                                </div>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Método de pago:</span>
                                    <span>{order.metodo_pago || 'No especificado'}</span>
                                </div>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Total:</span>
                                    <span style={styles.totalPrice}>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.infoCard}>
                            <h3 style={styles.infoTitle}>Dirección de Envío</h3>
                            <p style={styles.addressText}>
                                {order.direccion_envio || 'No especificada'}
                            </p>
                        </div>
                    </div>

                    <div style={styles.productsSection}>
                        <h2 style={styles.sectionTitle}>Productos</h2>
                        <div style={styles.productsList}>
                            {order.productos_pedidos.map((item, index) => (
                                <div key={index} style={styles.productCard}>
                                    <img 
                                        src={item.producto.imagen_principal} 
                                        alt={item.producto.nombre_producto} 
                                        style={styles.productImage}
                                    />
                                    <div style={styles.productInfo}>
                                        <h4 style={styles.productName}>{item.producto.nombre_producto}</h4>
                                        <p style={styles.productDescription}>
                                            {item.producto.descripcion || 'Sin descripción'}
                                        </p>
                                        <div style={styles.productMeta}>
                                            <span style={styles.productPrice}>
                                                ${item.producto.precio.toFixed(2)}
                                            </span>
                                            <span style={styles.productQuantity}>
                                                Cantidad: {item.cantidad}
                                            </span>
                                            <span style={styles.productSubtotal}>
                                                Subtotal: ${(item.producto.precio * item.cantidad).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.summaryCard}>
                        <h3 style={styles.summaryTitle}>Resumen del Pedido</h3>
                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Envío:</span>
                            <span>Gratis</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Descuento:</span>
                            <span>$0.00</span>
                        </div>
                        <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                            <span style={styles.totalLabel}>Total:</span>
                            <span style={styles.totalPrice}>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

// Estilos definidos como objetos JavaScript
const styles = {
    section: {
        padding: '2rem 5%',
        minHeight: '70vh',
        backgroundColor: '#f9f9f9'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#666',
        textDecoration: 'none',
        marginBottom: '1.5rem',
        transition: 'color 0.3s ease',
        fontSize: '0.95rem',
        ':hover': {
            color: '#c496f9'
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    title: {
        color: '#333',
        fontSize: '1.8rem',
        fontWeight: '600',
        margin: '0'
    },
    orderInfoContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)'
    },
    infoTitle: {
        color: '#444',
        fontSize: '1.2rem',
        marginTop: '0',
        marginBottom: '1.5rem',
        fontWeight: '600'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem'
    },
    infoLabel: {
        fontWeight: '600',
        color: '#666',
        fontSize: '0.9rem'
    },
    addressText: {
        margin: '0',
        lineHeight: '1.6'
    },
    productsSection: {
        marginBottom: '2rem'
    },
    sectionTitle: {
        color: '#333',
        fontSize: '1.5rem',
        marginBottom: '1.5rem'
    },
    productsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    productCard: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease',
        ':hover': {
            transform: 'translateY(-3px)'
        }
    },
    productImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRight: '1px solid #eee'
    },
    productInfo: {
        padding: '1.2rem',
        flex: '1'
    },
    productName: {
        margin: '0 0 0.5rem 0',
        color: '#333',
        fontSize: '1.1rem'
    },
    productDescription: {
        margin: '0 0 1rem 0',
        color: '#666',
        fontSize: '0.9rem',
        lineHeight: '1.5'
    },
    productMeta: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    productPrice: {
        fontWeight: '600',
        color: '#333'
    },
    productQuantity: {
        color: '#666',
        fontSize: '0.9rem'
    },
    productSubtotal: {
        marginLeft: 'auto',
        fontWeight: '600',
        color: '#c496f9'
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
        marginTop: '2rem'
    },
    summaryTitle: {
        color: '#444',
        fontSize: '1.2rem',
        marginTop: '0',
        marginBottom: '1.5rem',
        fontWeight: '600'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.7rem 0',
        borderBottom: '1px solid #eee'
    },
    totalRow: {
        borderBottom: 'none',
        paddingTop: '1rem',
        marginTop: '0.5rem'
    },
    totalLabel: {
        fontWeight: '600',
        fontSize: '1.1rem'
    },
    totalPrice: {
        fontWeight: '600',
        color: '#c496f9',
        fontSize: '1.1rem'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '1rem'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #c496f9',
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        color: '#666'
    },
    errorContainer: {
        textAlign: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorIcon: {
        fontSize: '3rem',
        color: '#ff4d4f',
        marginBottom: '1rem'
    },
    errorTitle: {
        color: '#333',
        marginBottom: '0.5rem'
    },
    errorText: {
        color: '#666',
        marginBottom: '1.5rem'
    },
    notFoundContainer: {
        textAlign: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notFoundIcon: {
        fontSize: '3rem',
        color: '#c496f9',
        marginBottom: '1rem'
    },
    notFoundTitle: {
        color: '#333',
        marginBottom: '0.5rem'
    },
    notFoundText: {
        color: '#666',
        marginBottom: '1.5rem'
    },
    backButton: {
        backgroundColor: '#c496f9',
        color: 'white',
        padding: '0.8rem 1.5rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: '#b080f0',
            transform: 'translateY(-2px)'
        }
    }
};

export default OrderDetails;