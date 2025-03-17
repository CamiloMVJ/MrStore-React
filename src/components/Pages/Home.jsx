import Header from "../Header"
import Glider from "../Glider"
import { useState, useEffect } from "react";
import { getTable } from "../../js/supabase"
import Products from "../Products";
import Footer from "../Footer";

const Home = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    const [products, setProducts] = useState([])
    useEffect(() => {
        getTable('productos', 12).then(data => {
            setProducts(data)
        })
    }, [])

    const Tienda = (e) => {
        e.preventDefault()
        window.location.href = '/tienda'
    }
    return (
        <>
            <Header navSection={navSections} />
            <Glider />
            <section className="section category">
                <div className="cat-center">
                    <button className="category-btn" onClick={Tienda}>
                        <div className="cat">
                            <img src="https://th.bing.com/th/id/OIP.hc5ryGVwPtP0Jo3v79biMAHaJh?rs=1&pid=ImgDetMain" alt="" />
                            <div>
                                <p>MUJERES</p>
                                <input type="hidden" value='Mujeres' />
                            </div>
                        </div>
                    </button>

                    <button className="category-btn" onClick={Tienda}>
                        <div className="cat">
                            <img src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//acce.jpeg" alt="" />
                            <div>
                                <p>ACCESORIOS</p>
                            </div>
                        </div>
                    </button>

                    <button className="category-btn" onClick={Tienda}>
                        <div className="cat">
                            <img src="https://revistavelvet.cl/wp-content/uploads/2021/12/TCF-001.jpg" alt="" />
                            <div>
                                <p>HOMBRES</p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            <section className="section new-arrival">
                <div className="title">
                    <h1>NUESTROS PRODUCTOS</h1>
                    <p>Calidad a tus manos</p>
                </div>
                <Products productos={products} />
            </section>
            <Footer />
        </>
    )
}

export default Home