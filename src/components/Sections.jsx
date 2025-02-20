const Sections = ({ list }) => {

    return (
        <>
            <ul className="nav-list d-flex">
                {list.map((item, index) => {
                    return <li className="nav-item" key={index}>
                        <a href={`/${item.title === 'Inicio' ? '' : item.title}`} className="nav-link">{item.title}</a>
                    </li>
                })}
            </ul>
            <div className="icons d-flex">
                <a href="login" className="icon icon-fix">
                    <i className="bx bx-user"></i>
                </a>
                <a className="icon icon-fix">
                    <i className="bx bx-search"></i>
                </a>
            </div>
        </>
    )
}

export default Sections