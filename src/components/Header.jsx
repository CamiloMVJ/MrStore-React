import Sections from "./Sections"
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { supabase } from '../js/supabase'

const Header = () => {
    const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
    const [navIcons, setNavIcons] = useState([{link: '/login', class: 'bx-user'}, {link: '#', class: 'bx-search'}])
    useEffect(() => {
        const fetchNavs = async () => {
            if (sessionStorage.getItem('NavIcons') && sessionStorage.getItem('NavSections')){
                setNavIcons(JSON.parse(sessionStorage.getItem('NavIcons')))
                setNavSections(JSON.parse(sessionStorage.getItem('NavSections')))
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