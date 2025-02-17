import Header from "../Header"
import Glider from "../Glider"
import Categories from "../Categories"
import Sections from "../Sections"
import { createClient } from "@supabase/supabase-js";
import { getProducts } from "../../js/supabase"

const Home = () => {
    const navSections = [{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }]
    const products = getProducts('productos', '12').then(data => data)

    return (
        <>
            <Header navSection={navSections} />
            <Glider />
            <Categories />
            <section className="section new-arrival">
                <div className="title">
                    <h1>NUESTROS PRODUCTOS</h1>
                    <p>Calidad a tus manos</p>
                </div>

            </section>
        </>
    )
}

export default Home