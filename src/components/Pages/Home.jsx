import Header from "../Header"
import Glider from "../Glider"
import Categories from "../Categories"

const Home = () => {
    const navSections = [{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }]
    return (
        <>
            <div className='top-nav hei'></div>
            <Header navSection={navSections}/>
            <Glider />
            <Categories></Categories>
        </>
    )
}

export default Home