import { Link } from "react-router-dom";

const Sections = ({ list, Icons }) => {
    return (
        <>
            <ul className="nav-list d-flex">
                {list.map((item, index) => {
                    return (
                        <li className="nav-item" key={index}>
                            <Link to={`/${item.title === 'Inicio' ? '' : item.title}`} className="nav-link">
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="icons d-flex">
                {Icons.map((icon, index) =>{
                    return(
                        <Link to={icon.link} className="icon icon-fix">
                            <i className={`bx ${icon.class}`}></i>
                        </Link>
                    )
                })}
            </div>
        </>
    );
};

export default Sections;