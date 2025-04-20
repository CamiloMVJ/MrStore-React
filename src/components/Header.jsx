import Sections from "./Sections"
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { supabase } from '../js/supabase'

const Header = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    const [navIcons, setNavIcons] = useState([{link: '/login', class: 'bx-user'}, {link: '#', class: 'bx-search'}])
    useEffect(() => {
        const fetchNavs = async () => {
            if (sessionStorage.getItem('session')) {
                const session = JSON.parse(sessionStorage.getItem('session'))
                const nav = await supabase.from('administradores').select().eq('id_usuario', session.id_usuario).limit(1)
                if (nav.data.length) {
                    setNavSections([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }])
                    setNavIcons([{link: '/login', class: 'bx-user'}, {link: '#', class: 'bx-search'}, {link: '/carrito', class: 'bx-cart'}])
                }
                else {
                    setNavSections([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }])
                    setNavIcons([{link: '/login', class: 'bx-user'}, {link: '#', class: 'bx-search'}, {link: '/carrito', class: 'bx-cart'}])
                }
            }

        }
        fetchNavs()
    }, [])
    return (
        <>
            <div className='top-nav hei'></div>
            <div className="navigation">
                <div className="nav-center container d-flex">
                    <Link to={'/'}><h1>Mr. Store</h1></Link>
                    <Sections list={navSections} Icons={navIcons} />
                </div>
            </div>
        </>

    )
}

export default Header