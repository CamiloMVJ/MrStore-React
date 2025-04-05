import { Link } from "react-router-dom";

const Sections = ({ list }) => {
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
                <Link to="/login" className="icon icon-fix">
                    <i className="bx bx-user"></i>
                </Link>
                <Link to="#" className="icon icon-fix">
                    <i className="bx bx-search"></i>
                </Link>
            </div>
        </>
    );
};

export default Sections;