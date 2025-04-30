import { addProductToCart } from "../js/supabase"
const Products = ({ productos }) => {
    const DetalleProducto = (e) => {
        e.preventDefault()
        window.location.href = '/DetProd/' + e.target.id.value
    }
    const AddCart = (e) => {
        e.preventDefault()
        addProductToCart(JSON.parse(sessionStorage.getItem('session')).id_usuario,e.target.id.value,e.target.cantidad.value)
    }
    return (
        <div className="product-center">
            {productos.map(producto => {
                return (
                        <div className="product-item" key={producto.id_producto} >
                            <div className="ovarlay">
                                <form onSubmit={DetalleProducto} method="POST">
                                    <input type="hidden" name="id" value={producto.id_producto} />
                                    <input type="hidden" name="nombre" value={producto.nombre_producto} />
                                    <input type="hidden" name="precio" value={producto.precio_producto} />
                                    <input type="hidden" name="descripcion" value={producto.descripcion} />
                                    <input type="hidden" name="tallas" value={producto.tallas} />
                                    <input type="hidden" name="color" value={producto.color} />
                                    <input type="hidden" name="imagen" value={producto.imagen} />
                                    <button type="submit" name="MostrarDetalle" value="detalle" className="product-thumb" style={{ border: 'none', background: 'none', padding: 0 }}>
                                        <img src={producto.imagen} alt=""/>
                                    </button>
                                </form>
                            </div>
                            <div className="product-info">
                                <span>{producto.nombre_producto}</span>
                                <a>{producto.descripcion}</a>
                                <h4>{producto.precio_producto} $</h4>
                            </div>
                            <form onSubmit={AddCart} method="POST" id="formProducto">
                                <input type="hidden" name="id" value={producto.id_producto} />
                                <input type="hidden" name="cantidad" value={1} />
                                <button className="btn btn-primary" name="btnAccion" value="Agregar" type="submit">
                                    <i className="bx bx-cart bx-tada"></i>
                                </button>
                            </form>
                        </div>
                )
            })}
        </div>
    )
}

export default Products