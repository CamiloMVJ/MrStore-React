import Header from '../Header'
import Footer from '../Footer'
import Products from '../Products'
import { useEffect, useState } from 'react'
import { getTable, supabase } from '../../js/supabase'
import { useParams } from 'react-router-dom'

const Tienda = () => {
    const [products, setProducts] = useState([])
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [categories, setCategories] = useState([])
    const [filtro, setFiltro] = useState([])
    const [presetCat, setPresetCats] = useState(useParams().categoria)
    const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1)


    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categorias').select('nombre_categoria, id_categoria')
            setCategories(data)
        }
        const initialCategory = async () => {
            const { data } = await supabase.from('categorias').select('id_categoria').eq('nombre_categoria', capitalizar(presetCat))
            setFiltro([...filtro, data.map(d => d.id_categoria)])

            document.getElementById(data[0].id_categoria).checked = true
        }
        if (presetCat) {
            initialCategory()
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (filtro.length === 0) {
            getTable('productos').then(data => {
                setProducts(data)
                setTotalPages(Math.ceil(data.length / 10))
            })
        }
        else {
            supabase.from('productos').select().in('id_categoria', filtro).then(response => {
                setProducts(response.data)
                // console.log(response.data)
                setTotalPages(Math.ceil(response.data.length / 10))
            })
        }
    }, [filtro])

    const CategoryChange = (e) => {
        if (e.target.checked) {
            setFiltro([...filtro, e.target.value])
            setpage(1)
        } else {
            setFiltro(filtro.filter(f => f !== e.target.value))
            setpage(1)
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
                <div className='flex-container'>
                    <div className='leftside'>
                        <h1 className='center'>Categorias</h1>
                    </div>
                    <div className="top container fullwidth">
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
                </div>

                <div className='flex-container'>
                    <div className='categories'>
                        <div>
                            <table>
                                <thead className='sticky'>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, id) => {
                                        return (
                                            <tr key={id} className='categories'>
                                                <td>{cat.nombre_categoria}</td>
                                                <td><input type='checkbox' onChange={CategoryChange} value={cat.id_categoria} id={cat.id_categoria} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <Products productos={products.slice((page - 1) * 10, page * 10)} />


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