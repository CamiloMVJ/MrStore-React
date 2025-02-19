import Header from "../Header"
import Glider from "../Glider"
import { useState, useEffect } from "react";
import { getProducts } from "../../js/supabase"
import Products from "../Products";
import Footer from "../Footer";

const Home = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }])
    const [products, setProducts] = useState([])
    useEffect(() =>{
        getProducts('productos', 12).then(data =>{
            setProducts(data)
        })
    }, [])
    return (
        <>
            <Header navSection={navSections} />
            <Glider />
            <section className="section category">
                <div className="cat-center">
                    <div className="cat">
                        <img src="https://th.bing.com/th/id/OIP.hc5ryGVwPtP0Jo3v79biMAHaJh?rs=1&pid=ImgDetMain" alt="" />
                        <div>
                            <p>MUJERES</p>
                        </div>
                    </div>
                    <div className="cat">
                        <img src="https://ieozatljukwgdhkwfyyz.supabase.co/storage/v1/object/public/Images//acce.jpeg" alt="" />
                        <div>
                            <p>ACCESORIOS</p>
                        </div>
                    </div>
                    <div className="cat">
                        <img src="https://revistavelvet.cl/wp-content/uploads/2021/12/TCF-001.jpg" alt="" />
                        <div>
                            <p>HOMBRES</p>
                        </div>
                    </div>
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