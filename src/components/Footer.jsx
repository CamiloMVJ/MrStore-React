const Footer = () => {
    return (
        <>
            <section className="contact">
                <div className="row">
                    <div className="col">
                        <h2>SOPORTE DE CLIENTE</h2>
                        <p>Amamos atender a nuestros clientes con el mejor servicio por eso si
                            tienes alguna duda no dudes en contactarnos
                        </p>
                        <a href="" className="btn btn-1">Contacto</a>
                    </div>
                    <div className="col">
                        <form action="">
                            <div>
                                <input type="email" placeholder="Email Address" name="email"/>
                                    <a href="">enviar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="row">
                    <div className="col d-flex">
                        <h4>INFORMACION</h4>
                        <a href="">Acerca de nosotros</a>
                        <a href="">Contactanos</a>
                        <a href="">Terminos</a>
                    </div>
                    <div className="col d-flex">
                        <span><i className='bx bxl-facebook-square'></i></span>
                        <span><i className='bx bxl-instagram-alt'></i></span>
                        <span><i className='bx bxl-github'></i></span>
                        <span><i className='bx bxl-twitter'></i></span>
                        <span><i className='bx bxl-pinterest'></i></span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer