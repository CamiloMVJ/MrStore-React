// Tienda.js
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductsCatalog from '../components/ProductsCatalog'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useNavigate } from 'react-router-dom'

const Tienda = () => {
    // const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const { categories, upFiltro, upPage, categoria } = useCategories()
    const { reloadCats, setReloadCats } = useCartContext()
    const { products, loading, filtro, page, totalPages, sortOption, mobileFiltersOpen,
        setPage, setFiltro, setSortOption, setMobileFiltersOpen, handleCategoryChange } = useProducts(upFiltro, categoria)

    const navigate = useNavigate()
    const capitalizar = (str) => str?.charAt(0)?.toUpperCase() + str?.slice(1) || ''

    useEffect(() => {
        setFiltro(upFiltro)
        setPage(1)
    }, [upFiltro])

    const handleSortChange = (e) => {
        // console.log("Cambiando opción de ordenamiento a:", e.target.value)
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
                        {loading ? (<></>) : (
                            <>
                                <div className="categories-list">
                                    {categories.map((cat) => (
                                        <div key={cat.id_categoria} className="category-item">
                                            <input
                                                type="checkbox"
                                                id={cat.id_categoria}
                                                value={cat.nombre_categoria}
                                                onChange={handleCategoryChange}
                                                className="category-checkbox"
                                                checked={filtro.includes(cat.id_categoria)}
                                            />
                                            <label htmlFor={cat.id_categoria}>
                                                {cat.nombre_categoria}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

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
                        ) : products.length === 0 && !loading ? (
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