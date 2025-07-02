// Tienda.js
import Header from '../Header'
import Footer from '../Footer'
import ProductsCatalog from '../ProductsCatalog'
import { useEffect, useState } from 'react'
import { getTable, supabase } from '../../js/supabase'
import { useParams } from 'react-router-dom'

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
            setLoading(true)
            try {
                // Get categories
                const cats = await getTable('categorias')
                setCategories(cats)
                // If category in URL
                if (categoria) {
                    const { data } = await supabase.schema('mrstore2')
                        .from('categorias')
                        .select('id_categoria')
                        .eq('nombre_categoria', capitalizar(categoria))
                    if (data?.length > 0) {
                        setFiltro([data[0].id_categoria.toString()])
                        setTimeout(() => {
                            const el = document.getElementById(data[0].id_categoria)
                            if (el) el.checked = true
                        }, 100)
                        setPage(1)
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [categoria])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            
            try {
                let query = supabase.schema('mrstore2').from('productos').select()
                
                if (filtro.length > 0) {
                    query = query.in('id_categoria', filtro)
                }
                
                // Apply sorting
                if (sortOption === '2') {
                    query = query.order('precio_producto', { ascending: true })
                } else if (sortOption === '3') {
                    query = query.order('precio_producto', { ascending: false })
                }
                
                const { data } = await query
                setProducts(data || [])
                setTotalPages(Math.ceil((data?.length || 0) / 12))
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [filtro, sortOption])

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
                                <ProductsCatalog productos={products.slice((page - 1) * 12, page * 12)} />
                                
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

            <style jsx>{`
                /* Base Styles */
                .tienda {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .tienda-hero {
                    text-align: center;
                    padding: 40px 20px;
                    background: linear-gradient(135deg, #8a4fff, #ff4f9a);
                    color: white;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                
                .tienda-hero h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }
                
                .tienda-hero p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }
                
                /* Filters Toggle - Mobile Only */
                .filters-toggle {
                    display: none;
                    background: #8a4fff;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 5px;
                    margin: 15px 0;
                    width: 100%;
                    font-weight: bold;
                    cursor: pointer;
                }
                
                /* Layout */
                .tienda-content {
                    display: flex;
                    gap: 30px;
                    margin: 30px 0;
                }
                
                .filters-sidebar {
                    width: 250px;
                    flex-shrink: 0;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .filters-sidebar h2 {
                    font-size: 1.3rem;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .products-main {
                    flex-grow: 1;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                /* Categories List */
                .categories-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .category-item {
                    display: flex;
                    align-items: center;
                }
                
                .category-checkbox {
                    margin-right: 10px;
                    width: 18px;
                    height: 18px;
                    accent-color: #8a4fff;
                }
                
                /* Products Header */
                .products-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .products-header h2 {
                    font-size: 1.5rem;
                    color: #333;
                }
                
                .sort-control {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .sort-control select {
                    padding: 8px 12px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    background-color: white;
                }
                
                /* Loading State */
                .loading-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }
                
                .spinner {
                    border: 4px solid rgba(138, 79, 255, 0.1);
                    border-top: 4px solid #8a4fff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* No Products */
                .no-products {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                }
                
                /* Pagination */
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 30px;
                    flex-wrap: wrap;
                }
                
                .pagination button {
                    padding: 8px 15px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .pagination button:hover:not(:disabled) {
                    background: #f0f0f0;
                }
                
                .pagination button.active {
                    background: #8a4fff;
                    color: white;
                    border-color: #8a4fff;
                }
                
                .pagination button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                /* Responsive Styles */
                @media (max-width: 992px) {
                    .tienda-content {
                        flex-direction: column;
                    }
                    
                    .filters-sidebar {
                        width: 100%;
                    }
                }
                
                @media (max-width: 768px) {
                    .filters-toggle {
                        display: block;
                    }
                    
                    .filters-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 80%;
                        max-width: 300px;
                        height: 100vh;
                        z-index: 1000;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        overflow-y: auto;
                        padding-top: 60px;
                    }
                    
                    .filters-sidebar.open {
                        transform: translateX(0);
                    }
                    
                    .tienda-hero h1 {
                        font-size: 2rem;
                    }
                    
                    .tienda-hero p {
                        font-size: 1rem;
                    }
                }
                
                @media (max-width: 576px) {
                    .tienda {
                        padding: 0 15px;
                    }
                    
                    .products-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .sort-control {
                        width: 100%;
                    }
                    
                    .sort-control select {
                        width: 100%;
                    }
                    
                    .pagination {
                        gap: 5px;
                    }
                    
                    .pagination button {
                        padding: 6px 12px;
                        min-width: 36px;
                    }
                }
            `}</style>
        </>
    )
}

export default Tienda