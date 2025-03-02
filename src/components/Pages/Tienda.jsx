import Header from '../Header'
import Footer from '../Footer'
import Products from '../Products'
import { useEffect, useState } from 'react'
import { getTable } from '../../js/supabase'

const Tienda = () => {
    const [products, setProducts] = useState([])
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    useEffect(() => {
        getTable('productos').then(data => {
            setProducts(data)
            setTotalPages(data.length / 8)
        })
    }, [])

    const pageIncrement = () => {
        if (page < totalPages) {
            setpage(page + 1)
        }
    }
    return (
        <>
            <Header />
            <section className='section all-products' id='products'>
                <div className="top container">
                    <h1>Todos los productos</h1>
                    <form>
                        <select id="filtro">
                            <option value="1">Por defecto</option>
                            <option value="2">Por precio</option>
                            <option value="3">Por oferta</option>
                        </select>
                        <span><i className="bx bx-chevron-down"></i></span>
                    </form>
                </div>
                <div className="product-center container">
                    <Products productos={products.slice((page - 1) * 8 , page * 8)}/>
                </div>
            </section>
            <section className='pagination'>
                <div className="container">
                {Array.from({length : totalPages}).map((_,i) =>{
                    return <a className={page == (i + 1) ? 'pagina activePage' : 'pagina'} key={i + 1} onClick={() => setpage(i + 1)}>{i + 1}</a>
                })}
                <a className='pagina' onClick={pageIncrement}>
                    <i className='bx bx-right-arrow-alt'></i>
                </a>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Tienda