import Sections from "./Sections"
import { useEffect, useState } from 'react'
import { supabase } from '../js/supabase'

const Header = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    useEffect(() => {
        const fetchNavs = async () => {
            const session = JSON.parse(sessionStorage.getItem('session'))
            const nav = await supabase.from('usuarios').select(' *,id_usuario, administradores!inner(id_usuario)').eq('username', session.username).eq('contraseña', session.password).limit(1)
            if (nav.data.length) {
                setNavSections([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }])
            }
        }
        fetchNavs()
    }, [])
    return (
        <>
            <div className='top-nav hei'></div>
            <div className="navigation">
                <div className="nav-center container d-flex">
                    <a href="/" className="logo"><h1>Mr. Store</h1></a>
                    <Sections list={navSections} />
                </div>
            </div>
        </>

    )
}

export default Header