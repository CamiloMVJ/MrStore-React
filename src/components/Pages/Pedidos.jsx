import { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { supabase } from '../../js/supabase';

const OrderHistory = () => {
    const [id_pedido, setId_Pedido] = useState(null)
    const [detpedidos, setdetpedidos] = useState([])
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .schema('mrstore2')
                    .from('pedidos')
                    .select(`
                        id_pedido,
                        total,
                        estadopedido,
                        fecha_pedido
                    `)
                    .order('fecha_pedido', { ascending: false });

                if (error) throw error;
                console.log(data)
                setOrders(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        const fetchDetOrders = async () => {
            try {
                const { data, error } = await supabase.schema('mrstore2')
                    .from('detpedidos')
                    .select(`id_producto,color,talla,id_proveedor,id_pedido,cantidad,subtotal,precioventa, detproductos(
                            productos(id_producto, nombre_producto, descripcion, imagen_url, precio_producto))`)
                    .order('subtotal', { ascending: false });
                if (error) throw error;
                setdetpedidos(data)
                console.log(data)

            }
            catch (error) {
                console.error('Error fetching orders:', error);


            }
        }
        fetchDetOrders()
        fetchOrders();
    }, []);

    // useEffect(() => {
    //     fetchDetOrders(id_pedido)

    // },[id_pedido])


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusStyle = (status) => {
        const lowerStatus = status.toLowerCase();
        const styles = {
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'inline-block'
        };

        if (lowerStatus === 'completado') {
            return { ...styles, backgroundColor: '#e6f7e6', color: '#2e7d32' };
        } else if (lowerStatus === 'procesando') {
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #c496f9',
                        borderTop: '4px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#666' }}>Cargando tu historial de pedidos...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <section style={{
                padding: '2rem 5%',
                minHeight: '70vh',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h1 style={{
                        color: '#333',
                        marginBottom: '2rem',
                        fontSize: '2rem',
                        fontWeight: '600'
                    }}>Historial de Pedidos</h1>

                    {orders.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                        }}>
                            <i className="bx bx-package" style={{
                                fontSize: '3rem',
                                color: '#c496f9',
                                marginBottom: '1rem'
                            }}></i>
                            <h3 style={{
                                color: '#333',
                                marginBottom: '0.5rem'
                            }}>Aún no has realizado ningún pedido</h3>
                            <p style={{
                                color: '#666',
                                marginBottom: '1.5rem'
                            }}>Cuando hagas un pedido, aparecerá aquí.</p>
                            <a href="/tienda" style={{
                                backgroundColor: '#c496f9',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '5px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}>Ir a la tienda</a>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            {orders.map((order) => {
                                return (
                                    (
                                        <div key={order.id_pedido} style={{
                                            background: 'white',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1.5rem',
                                                borderBottom: '1px solid #eee'
                                            }}>
                                                <div>
                                                    <h3 style={{
                                                        color: '#333',
                                                        margin: '0',
                                                        fontSize: '1.9rem'
                                                    }}>Pedido #{order.id_pedido}</h3>
                                                    <p style={{
                                                        color: '#888',
                                                        fontSize: '1.2rem',
                                                        marginTop: '0.3rem'
                                                    }}>{formatDate(order.fecha_pedido)}</p>
                                                </div>
                                                <div style={getStatusStyle(order.estadopedido)}>
                                                    {order.estadopedido}
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '1rem 1.5rem'
                                            }}>
                                                { detpedidos.filter(item => item.id_pedido == order.id_pedido).slice(0,2).map((item, index) => {
                                            return(
                                                (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.8rem 0',
                                                borderBottom: '1px solid #f5f5f5'
                                            }}>
                                                <img 
                                                    src={item.detproductos.productos.imagen_url} 
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '5px'
                                                    }} 
                                                />
                                                <div>
                                                    <h4 style={{
                                                        margin: '0',
                                                        fontSize: '1.5rem',
                                                        color: '#444'
                                                    }}>{item.detproductos.productos.nombre_producto}</h4>
                                                    <p style={{
                                                        margin: '0.3rem 0 0',
                                                        fontSize: '1.3rem',
                                                        color: '#666'
                                                    }}>{item.cantidad} x ${item.detproductos.productos.precio_producto.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )
                                            )
                                        })}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1.2rem 1.5rem',
                                                backgroundColor: '#fafafa',
                                                borderTop: '1px solid #eee'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem',
                                                    fontWeight: '600',
                                                    color: '#333'
                                                }}>
                                                    <span>Total:</span>
                                                    <span style={{ color: '#c496f9' }}>${order.total.toFixed(2)}</span>
                                                </div>
                                                <button onClick={() => { window.location.href = `/DetPedidos/${order.id_pedido}` }} style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#c496f9',
                                                    border: '1px solid #c496f9',
                                                    padding: '0.5rem 1.2rem',
                                                    borderRadius: '5px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .order-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }
                    
                    .order-footer {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </>
    );
};

export default OrderHistory;
// 