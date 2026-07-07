// Tienda.js
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductsCatalog from '../components/ProductsCatalog'
import { useEffect, useState } from 'react'
import { getTable, getTableFiltered, getTotalRows, getTotalRowsFiltered } from '../services/supabase'
import { useParams } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'

const Tienda = () => {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [categories, setCategories] = useState([])
    const [filtro, setFiltro] = useState([])
    const [sortOption, setSortOption] = useState('1')
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const { categoria } = useParams()

    const capitalizar = (str) => str?.charAt(0)?.toUpperCase() + str?.slice(1) || ''

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get categories
                const cats = await getTable('categorias')
                setCategories(cats)
                if (categoria) {
                    const cat = cats.find(cat => cat.nombre_categoria.toLowerCase() === categoria.toLowerCase())
                    // console.log("Found category:", cat)
                    if (cat !== undefined) {
                        setFiltro([cat.id_categoria])
                        setTimeout(() => {
                            const el = document.getElementById(cat.id_categoria)
                            if (el) el.checked = true
                        }, 100)
                        setPage(1)
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [categoria])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                let query = await getTableFiltered('productos', filtro, parseInt(sortOption), page)
                // console.log("Fetched products:", query)
                setProducts(query || [])
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [filtro, sortOption, page])

    useEffect(() => {
        const fetchTotalRows = async () => {
            try {
                let totalRows = await getTotalRowsFiltered('productos', filtro)
                setTotalPages(Math.ceil((totalRows || 0) / 12))
            }
            catch (error) {
                console.error("Error fetching total rows:", error)
            }
        }
        fetchTotalRows()
    }, [filtro])

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target
        setFiltro(prev => {
            const nuevo = checked ? Array.from(new Set([...prev, value])) : prev.filter(f => f !== value)
            return nuevo
        })
        setPage(1)
        // Cierra el sidebar móvil al seleccionar/desmarcar
        if (window.innerWidth <= 768) setMobileFiltersOpen(false)
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value)
        setPage(1)
    }

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <>
            <Header />

            <div className="tienda">
                {/* Hero Section */}
                <section className="tienda-hero">
                    <h1>🛍️ Tienda MRSTORE</h1>
                    <p>Encuentra los mejores productos</p>
                </section>

                {/* Mobile Filters Toggle */}
                <button
                    className="filters-toggle"
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                    {mobileFiltersOpen ? '✕ Cerrar filtros' : '☰ Mostrar filtros'}
                </button>

                <div className="tienda-content">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
                        <h2>Filtrar por categoría</h2>
                        <div className="categories-list">
                            {categories.map((cat) => (
                                <div key={cat.id_categoria} className="category-item">
                                    <input
                                        type="checkbox"
                                        id={cat.id_categoria}
                                        value={cat.id_categoria}
                                        onChange={handleCategoryChange}
                                        className="category-checkbox"
                                    />
                                    <label htmlFor={cat.id_categoria}>
                                        {cat.nombre_categoria}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="products-main">
                        <div className="products-header">
                            <h2>Productos</h2>
                            <div className="sort-control">
                                <label htmlFor="sort-select">Ordenar por:</label>
                                <select
                                    id="sort-select"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                >
                                    <option value="1">Por defecto</option>
                                    <option value="2">Precio: menor a mayor</option>
                                    <option value="3">Precio: mayor a menor</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                <p>Cargando productos...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="no-products">
                                <p>No se encontraron productos</p>
                            </div>
                        ) : (
                            <>
                                <ProductsCatalog productos={products} />

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            onClick={() => changePage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            &lt;
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (page <= 3) {
                                                pageNum = i + 1
                                            } else if (page >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = page - 2 + i
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => changePage(pageNum)}
                                                    className={page === pageNum ? 'active' : ''}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}

                                        <button
                                            onClick={() => changePage(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Tienda