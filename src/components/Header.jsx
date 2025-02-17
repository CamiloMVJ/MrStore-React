import Sections from "./Sections"

const Header = ({ navSection }) => {
    return (
        <>
            <div className='top-nav hei'></div>
            <div className="navigation">
                <div className="nav-center container d-flex">
                    <a href="" className="logo"><h1>Mr. Store</h1></a>
                    <Sections list={navSection} />
                </div>
            </div>
        </>

    )
}

export default Header