import React, { useEffect } from "react"
import Glide from '@glidejs/glide'
import { Link } from "react-router-dom"
import '../css/styles.css'

const Glider = () => {
    useEffect(() => {
        const elem = document.querySelector('.glide')
        if (elem) {
            const glide = new Glide(elem, {
                type: 'carousel',
                startAt: 0,
                // autoplay: 3000,
                gap: 0,
                hoverpause: true,
                perView: 1,
                animationDuration: 800,
                animationTimingFunc: 'linear',
            })
            glide.mount()
        }
    }, [])
    return (
        <div className="hero">
            <div className="glide">
                <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides">
                        <li className="glide__slide">
                            <div className="center">
                                <div className="left">
                                    <span>Inspiracion 2024</span>
                                    <h1>NUEVAS PRENDAS!!</h1>
                                    <p>Articulos para todo publico</p>
                                    <Link className="hero-btn" draggable="true" to="/Tienda">COMPRA AHORA!!</Link>
                                </div>
                                <div className="right">
                                    <img className="img1" src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-1.png" alt="" />
                                </div>
                            </div>
                        </li>
                        <li className="glide__slide">
                            <div className="center">
                                <div className="left">
                                    <span>Inspiracion 2024</span>
                                    <h1>EL OUTFIT PERFECTO!!</h1>
                                    <p>Encuentra tu outfit con nosotros</p>
                                    <Link className="hero-btn" draggable="true" to="/Tienda">COMPRA AHORA!!</Link>
                                </div>
                                <div className="right">
                                    <img className="img2" src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//hero-2.png" alt="" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Glider
