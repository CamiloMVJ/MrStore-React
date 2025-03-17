import Header from '../Header'
import Footer from '../Footer'
import Products from '../Products'
import { useEffect, useState } from 'react'
import { getTable, supabase } from '../../js/supabase'

const Tienda = () => {
    const [products, setProducts] = useState([])
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [categories, setCategories] = useState([])
    const [filtro, setFiltro] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categorias').select('nombre_categoria, id_categoria')
            setCategories(data)
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (filtro.length === 0) {
            getTable('productos').then(data => {
                setProducts(data)
                setTotalPages(Math.ceil(data.length / 8))
            })
        }
        else {
            supabase.from('productos').select().in('id_categoria', filtro).then(response => {
                setProducts(response.data)
                console.log(response.data)
                setTotalPages(Math.ceil(response.data.length / 8))
            })
        }
    }, [filtro])

    const CategoryChange = (e) => {
        if (e.target.checked) {
            setFiltro([...filtro, e.target.value])
        } else {
            setFiltro(filtro.filter(f => f !== e.target.value))
        }
    }

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
                <div className='flex-container'>

                    <div className='categories'>
                        <h1 className='title'>Categoria</h1>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, id) => {
                                        return (
                                            <tr key={id}>
                                                <td>{cat.nombre_categoria}</td>
                                                <td><input type='checkbox' onChange={CategoryChange} value={cat.id_categoria} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="product-center">
                        <Products productos={products.slice((page - 1) * 8, page * 8)} />

                    </div>
                </div>
            </section>
            <section className='pagination'>
                <div className="container">
                    {Array.from({ length: totalPages }).map((_, i) => {
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