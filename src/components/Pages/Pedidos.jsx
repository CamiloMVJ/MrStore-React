import { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { supabase, getTable } from '../../js/supabase';

const OrderHistory = () => {
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

    

    const getStatusClass = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'completado') {
            return 'order-status order-status--completado';
        } else if (lowerStatus === 'procesando') {
            return 'order-status order-status--procesando';
        } else if (lowerStatus === 'cancelado') {
            return 'order-status order-status--cancelado';
        } else if (lowerStatus === 'enviado') {
            return 'order-status order-status--enviado';
        }
        return 'order-status';
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="order-history-loading">
                    <div className="order-history-spinner"></div>
                    <p className="order-history-loading-text">Cargando tu historial de pedidos...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="order-history-page">
                <div className="order-history-container">
                    <h1 className="order-history-title">Historial de Pedidos</h1>

                    {orders.length === 0 ? (
                        <div className="order-history-empty">
                            <i className="bx bx-package order-history-empty-icon"></i>
                            <h3 className="order-history-empty-title">Aún no has realizado ningún pedido</h3>
                            <p className="order-history-empty-text">Cuando hagas un pedido, aparecerá aquí.</p>
                            <a href="/tienda" className="order-history-empty-link">Ir a la tienda</a>
                        </div>
                    ) : (
                        <div className="order-history-list">
                            {orders.map((order) => {
                                return (
                                    (
                                        <div key={order.id_pedido} className="order-card">
                                            <div className="order-card-header">
                                                <div>
                                                    <h3 className="order-card-title">Pedido #{order.id_pedido}</h3>
                                                    <p className="order-card-date">{formatDate(order.fecha_pedido)}</p>
                                                </div>
                                                <div className={getStatusClass(order.estadopedido)}>
                                                    {order.estadopedido}
                                                </div>
                                            </div>

                                            <div className="order-card-items">
                                                {detpedidos.filter(item => item.id_pedido == order.id_pedido).slice(0, 2).map((item, index) => {
                                                    return (
                                                        <div key={index} className="order-card-item">
                                                            <img
                                                                src={item.detproductos.productos.imagen_url}
                                                                alt={item.detproductos.productos.nombre_producto}
                                                                className="order-card-item-image"
                                                            />
                                                            <div>
                                                                <h4 className="order-card-item-title">{item.detproductos.productos.nombre_producto}</h4>
                                                                <p className="order-card-item-text">{item.cantidad} x ${item.detproductos.productos.precio_producto.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="order-card-footer">
                                                <div className="order-card-total">
                                                    <span>Total:</span>
                                                    <span className="order-card-total-value">${order.total.toFixed(2)}</span>
                                                </div>
                                                <button onClick={() => { window.location.href = `/DetPedidos/${order.id_pedido}` }} className="order-card-button">
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
        </>
    );
};

export default OrderHistory;
// 