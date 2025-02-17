const Products = () => {
    return (
        <div className="product-center">
            <div className="product-item">
                <div className="overlay">
                    <form action="productDetails.php" method="POST">
                        <input type="hidden" name="id" value="0A5Syt+f8bmAlNJJV2dUeg==" />
                        <input type="hidden" name="nombre" value="yM5o+knOyLOCwS4+kHarjA==" />
                        <input type="hidden" name="precio" value="gokCl7EGVOgx0lP2JWPaug==" />
                        <input type="hidden" name="descripcion" value="xl2Kl7k0qf4dxS71rZT/TegBByCbH/FCeJnF3ia0KB0X19pGVxr6BBEihwylW+zG" />
                        <input type="hidden" name="tallas" value="bbkcbyv+uVHdLr1OjIijWQ==" />
                        <input type="hidden" name="color" value="0tvhb9RtWDUGlij89SXUIA==" />
                        <input type="hidden" name="imagen" value="./productos/producto1.jpg" />
                        <button type="submit" name="MostrarDetalle" value="detalle" className="product-thumb" style={{ border: 'none', background: 'none', padding: 0 }}>
                            <img src="./productos/producto1.jpg" alt="" />
                        </button>
                    </form>
                </div>
                <div className="product-info">
                    <span>Chaqueta</span>
                    <a href="productDetails.php">Abrigo informal de doble botonadura</a>
                    <h4>35$</h4>
                </div>
                <form action="mostrarCarrito.php" method="POST" id="formProducto">
                    <input type="hidden" name="id" value="0A5Syt+f8bmAlNJJV2dUeg==" />
                    <input type="hidden" name="cantidad" value="0A5Syt+f8bmAlNJJV2dUeg==" />
                    <button className="btn btn-primary" name="btnAccion" value="Agregar" type="submit">
                        <i className="bx bx-cart bx-tada"></i>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Products