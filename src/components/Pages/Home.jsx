import Header from "../Header"
import Glider from "../Glider"
import { useState, useEffect } from "react";
import {  getProducts } from "../../js/supabase"
import Footer from "../Footer"; 
import ProductsCatalog from "../ProductsCatalog";

const Home = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    const [products, setProducts] = useState([])
    useEffect(() => {
        if(!sessionStorage.getItem('session')) {
            localStorage.clear()
        }

        getProducts().then(data => {
            setProducts(data)
        })
    }, [])

    const Tienda = (e) => {
        e.preventDefault()
        window.location.href = `/tienda/${e.target.categoria.value}`
    }
    return (
        <>
            <Header navSection={navSections} />
            <Glider />
            <section className="section category">
                <div className="cat-center">
                    <form onSubmit={Tienda}>
                        <button className="category-btn" type="submit">
                            <div className="cat">
                                <img src="https://th.bing.com/th/id/OIP.hc5ryGVwPtP0Jo3v79biMAHaJh?rs=1&pid=ImgDetMain" alt="" />
                                <div>
                                    <p>MUJERES</p>
                                    <input type="hidden" defaultValue='Mujeres' id="categoria" name="categoria" />
                                </div>
                            </div>
                        </button>
                    </form>

                    <form onSubmit={Tienda}>
                        <button className="category-btn" type="submit">
                            <div className="cat">
                                <img src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//acce.jpeg" alt="" />
                                <div>
                                    <p>ACCESORIOS</p>
                                    <input type="hidden" defaultValue='Accesorios' id="categoria" name="categoria" />
                                </div>
                            </div>
                        </button>
                    </form>

                    <form onSubmit={Tienda}>
                        <button className="category-btn" type="submit">
                            <div className="cat">
                                <img src="https://revistavelvet.cl/wp-content/uploads/2021/12/TCF-001.jpg" alt="" />
                                <div>
                                    <p>HOMBRES</p>
                                    <input type="hidden" defaultValue='Hombres' id="categoria" name="categoria" />
                                </div>
                            </div>
                        </button>
                    </form>

                </div>
            </section>

            <section className="section new-arrival">
                <div className="title">
                    <h1>NUESTROS PRODUCTOS</h1>
                    <p>Calidad a tus manos</p>
                </div>
                <ProductsCatalog productos={products} />
            </section>
            <Footer />
        </>
    )
}

export default Home