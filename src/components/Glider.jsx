

const Glider = () => {
    return (
        <div className="glide">
            <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                    <li className="glide__slide"><img src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-1.png" alt="" /></li>
                    <li className="glide__slide"><img src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-2.png" alt="" /></li>
                </ul>
                <div className="glide__arrows" data-glide-el="controls">
                    <button className="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
                    <button className="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
                </div>
            </div>
            <div data-glide-el="controls">
                <button data-glide-dir="<<">Start</button>
                <button data-glide-dir=">>">End</button>
            </div>

            {/* <div className="hero">
                <div className="glide glide--ltr glide--carousel glide--swipeable" id="glide_1">
                    <div className="glide__track" data-glide-el="track">
                        <ul className="glide__slides" style={{ transition: 'transform 800ms linear', width: '7320px', transform: 'translate3d(-1830px, 0px, 0px)' }}>
                            <li className="glide__slide glide__slide--clone" style={{ width: "1830px", marginRight: "0px" }}>
                                <div className="center">
                                    <div className="left">
                                        <span>Inspiracion 2024</span>
                                        <h1>EL OUTFIT PERFECTO!!</h1>
                                        <p>Encuentra tu outfit con nosotros</p>
                                        <a className="hero-btn" draggable="true" data-href="#" href="#">COMPRA AHORA!!</a>
                                    </div>
                                    <div className="right">
                                        <img className="img2" src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-2.png" alt="" />
                                    </div>
                                </div>
                            </li>

                            <li className="glide__slide glide__slide--active" style={{ width: "1830px", marginLeft: "0px", marginRight: "0px" }}>
                                <div className="center">
                                    <div className="left">
                                        <span>Inspiracion 2024</span>
                                        <h1>NUEVAS PRENDAS!!</h1>
                                        <p>Artículos para todo público</p>
                                        <a className="hero-btn" draggable="true" data-href="product.php" href="product.php">COMPRA AHORA!!</a>
                                    </div>
                                    <div className="right">
                                        <img className="img1" src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-1.png" alt="" />
                                    </div>
                                </div>
                            </li>

                            <li className="glide__slide" style={{ width: "1830px", marginLeft: "0px", marginRight: "0px" }}>
                                <div className="center">
                                    <div className="left">
                                        <span>Inspiracion 2024</span>
                                        <h1>EL OUTFIT PERFECTO!!</h1>
                                        <p>Encuentra tu outfit con nosotros</p>
                                        <a className="hero-btn" draggable="true" data-href="#" href="#">COMPRA AHORA!!</a>
                                    </div>
                                    <div className="right">
                                        <img className="img2" src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-2.png" alt="" />
                                    </div>
                                </div>
                            </li>

                            <li className="glide__slide glide__slide--clone" style={{ width: "1830px", marginLeft: "0px" }}>
                                <div className="center">
                                    <div className="left">
                                        <span>Inspiracion 2024</span>
                                        <h1>NUEVAS PRENDAS!!</h1>
                                        <p>Artículos para todo público</p>
                                        <a className="hero-btn" draggable="true" data-href="product.php" href="product.php">COMPRA AHORA!!</a>
                                    </div>
                                    <div className="right">
                                        <img className="img1" src="./images/hero-1.png" alt="" />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Glider
