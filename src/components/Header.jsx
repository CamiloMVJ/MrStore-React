import Sections from "./Sections"
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useCartContext } from '../context/CartContext'


const Header = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    const [navIcons, setNavIcons] = useState([{ link: '/login', class: 'bx-user' }, { link: '#', class: 'bx-search' }])
    const context = useCartContext()

    useEffect(() => {
        const fetchNavs = async () => {
            if (sessionStorage.getItem('NavIcons') && sessionStorage.getItem('NavSections')) {
                setNavIcons(JSON.parse(sessionStorage.getItem('NavIcons')))
                setNavSections(JSON.parse(sessionStorage.getItem('NavSections')))
            }
        }
        fetchNavs()
        context.cargarCarrito()
        // console.log(context.cartItems)
    }, [])
    return (
        <>
        {/* {console.log(context.cartItems)} */}
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