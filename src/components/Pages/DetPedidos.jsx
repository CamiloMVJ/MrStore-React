import { useEffect, useState } from 'react';
import { useParams, Link, data } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { supabase } from '../../js/supabase';

const OrderDetails = () => {
    const [id_pedido, setId_Pedido] = useState(useParams().id_pedido)
    const [order, setOrder] = useState()
    const [detpedidos, setdetpedidos] = useState([])
    const [orders, setOrders] = useState(null);
    const [envio, setenvio] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
    const fetchDetOrderDetails = async () => {
        try {
            const { data, error: supabaseError } = await supabase
                .schema('mrstore2')
                .from('detpedidos')
                .select(`
                    id_producto,color,talla,id_proveedor,id_pedido,cantidad,subtotal,precioventa, detproductos(
                            productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto))`)
                 .eq('id_pedido', id_pedido).order('subtotal', {ascending: false});
             if (supabaseError) throw error;
                setdetpedidos(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };
    const fetchOrder = async () => {
        try {
            const { data, error : supabaseError } = await supabase.schema('mrstore2').from('pedidos')
            .select(`id_pedido,
                        total,
                        estadopedido,
                        fecha_pedido`).eq('id_pedido', id_pedido).order('fecha_pedido', { ascending: false });

                if (supabaseError) throw error;
                
                setOrders(data[0])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            
        }
    };

    const fetchShipping = async () => {
        try {
            const { data, error : supabaseError } = await supabase.schema('mrstore2').from('envios')
            .select(`id_pedido,
                costo_envio,
                empresa_envio,
                fechaentrega,
                descuento,
                direcciones(id_direccion, direccion, nombre_dir)
                `).eq('id_pedido', id_pedido ).order('costo_envio', {ascending:false});
            if (supabaseError) throw error;
                console.log(data[0])
                setenvio(data[0])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            
        }
        
    };
    fetchOrder()
    fetchDetOrderDetails();
    fetchShipping()
}, []);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusStyle = (status) => {
       const lowerStatus = status.toLowerCase();
        const styles = {
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'inline-block',
            marginLeft: '1rem'
        };

        if (lowerStatus === 'completado') {
            return { ...styles, backgroundColor: '#e6f7e6', color: '#2e7d32' };
        } else if (lowerStatus === 'pendiente') {
            return { ...styles, backgroundColor: '#fff8e1', color: '#ff8f00' };
        } else if (lowerStatus === 'cancelado') {
            return { ...styles, backgroundColor: '#ffebee', color: '#c62828' };
        } else if (lowerStatus === 'enviado') {
            return { ...styles, backgroundColor: '#e3f2fd', color: '#1565c0' };
        }
        return styles;
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

    if (!detpedidos) {
        return (
            <>
                <Header />
                <div style={styles.notFoundContainer}>
                    <i className="bx bx-package" style={styles.notFoundIcon}></i>
                    <h3 style={styles.notFoundTitle}>Pedido no encontrado</h3>
                    <p style={styles.notFoundText}>No se encontró el pedido #{order.id_pedido}</p>
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
            {(orders && envio) ? (<section style={styles.section}>
                <div style={styles.container}>
                    <Link to="/Pedidos" style={styles.backLink}>
                        <i className="bx bx-arrow-back"></i> Volver al historial
                    </Link>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Detalles del Pedido #{orders.id_pedido}</h1>
                        <div style={getStatusStyle(orders.estadopedido)}>
                            {orders.estadopedido}
                        </div>
                    </div>

                    <div style={styles.orderInfoContainer}>
                        <div style={styles.infoCard}>
                            <h3 style={styles.infoTitle}>Información del Pedido</h3>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Fecha:</span>
                                    <span>{formatDate(orders.fecha_pedido)}</span>
                                </div>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Método de pago:</span>
                                    <span>{orders.metodo_pago || 'Transferencia'}</span>
                                </div>
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Total:</span>
                                    <span style={styles.totalPrice}>${orders.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.infoCard}>
                            <h3 style={styles.infoTitle}>Dirección de Envío</h3>
                            <p style={styles.addressText}>
                                {envio.direcciones.direccion || 'No especificada'}
                            </p>
                        </div>
                    </div>

                    <div style={styles.productsSection}>
                        <h2 style={styles.sectionTitle}>Productos</h2>
                        <div style={styles.productsList}>
                            {detpedidos.map((item, index) => (
                                <div key={index} style={styles.productCard}>
                                    <img 
                                        src={item.detproductos.productos.imagen_url} 
                                        alt={item.detproductos.productos.nombre_producto} 
                                        style={styles.productImage}
                                    />
                                    <div style={styles.productInfo}>
                                        <h4 style={styles.productName}>{item.detproductos.productos.nombre_producto}</h4>
                                        <p style={styles.productDescription}>
                                            {item.detproductos.productos.descripcion || 'Sin descripción'}
                                        </p>
                                        <div style={styles.productMeta}>
                                            <span style={styles.productPrice}>
                                                ${item.detproductos.productos.precio_producto.toFixed(2)}
                                            </span>
                                            <span style={styles.productQuantity}>
                                                Cantidad: {item.cantidad}
                                            </span>
                                            <span style={styles.productSubtotal}>
                                                Subtotal: ${(item.detproductos.productos.precio_producto * item.cantidad).toFixed(2)}
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
                            <span>{orders.total.toFixed(2)} $</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Envío:</span>
                            <span>{envio.costo_envio} $</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Descuento:</span>
                            <span>{envio.descuento} $</span>
                        </div>
                        <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                            <span style={styles.totalLabel}>Total:</span>
                            <span style={styles.totalPrice}>${(Number(orders.total.toFixed(2)) + envio.costo_envio)}</span>
                        </div>
                    </div>
                </div>
            </section>):null}
            
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