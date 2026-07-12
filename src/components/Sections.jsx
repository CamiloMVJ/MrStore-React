import { useCartContext } from '../context/CartContext'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'




const Sections = ({ list, Icons }) => {
    const { reloadCats, setReloadCats } = useCartContext()
    const navigate = useNavigate()

    const handleNavClick = (e) => {
        e.preventDefault()
        // console.log("Recargando cats")
        setReloadCats(!reloadCats)
        navigate(e.target.getAttribute('href'))
    }
    return (
        <>
            <ul className="nav-list d-flex">
                {list.map((item, index) => {
                    return (
                        <li className="nav-item" key={index}>
                            <Link to={`/${item.title === 'Inicio' ? '' : item.title}`} className="nav-link" onClick={handleNavClick}>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="icons d-flex">
                {Icons.map((icon, index) => {
                    return (
                        <Link to={icon.link} className="icon icon-fix" key={index}>
                            <i className={`bx ${icon.class}`}></i>
                        </Link>
                    )
                })}
            </div>
        </>
    );
};

export default Sections;