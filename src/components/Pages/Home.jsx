import Header from "../Header"
import Glider from "../Glider"

const Home = () => {
    const navSections = [{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }]
    return (
        <>
            <div className='top-nav hei'></div>
            <Header navSection={navSections}/>
            <Glider />
        </>
    )
}

export default Home