import { useState, useEffect } from 'react'
import { getTableFiltered, getTotalRowsFiltered } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export const useProducts = (categoriaInicial, categoriaURL) => {
    // console.log(categoriaInicial)
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [filtro, setFiltro] = useState(categoriaInicial?.length ? categoriaInicial : [])
    const [loading, setLoading] = useState(true)
    const [sortOption, setSortOption] = useState('1')
    const [totalPages, setTotalPages] = useState(0)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        // console.log("Trayendo productos")
        const fetchProducts = async () => {
            try {
                // console.log(filtro)
                if (filtro.length == 1 && filtro[0] === undefined) {
                    setLoading(true)
                }
                else {
                    let query = await getTableFiltered('productos', filtro, parseInt(sortOption), page)
                    console.log("Fetched products:", query)
                    setProducts(query || [])
                }
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
                if (filtro.length !== 1 || filtro[0] !== undefined) {
                    let totalRows = await getTotalRowsFiltered('productos', filtro)
                    // console.log("Filtro:", filtro)
                    setTotalPages(Math.ceil((totalRows || 0) / 12))
                }
            }
            catch (error) {
                console.error("Error fetching total rows:", error)
            }
        }
        fetchTotalRows()
    }, [filtro])

    const handleCategoryChange = (e) => {
        // let newURL = '/Tienda/'
        const { value, checked, id } = e.target
        const nextFiltro = checked
            ? [...filtro, parseInt(id)]
            : filtro.filter((item) => item !== parseInt(id))

        setFiltro(nextFiltro)
        let arrayCategorias = categoriaURL ? categoriaURL.split(',') : []
        if (checked) {
            arrayCategorias.push(value)
        }
        else {
            arrayCategorias = arrayCategorias.filter(cat => cat.trim().toLowerCase() !== value.toLowerCase())
        }
        const newURL = arrayCategorias.length > 0
            ? `/Tienda/${arrayCategorias.join(',')}`
            : '/Tienda'

        navigate(newURL)

        // Cierra el sidebar móvil al seleccionar/desmarcar
        if (window.innerWidth <= 768) setMobileFiltersOpen(false)
    }

    return {
        products, page, filtro, loading, totalPages, sortOption, mobileFiltersOpen,
        setSortOption, setFiltro, setPage, setSortOption, setMobileFiltersOpen, handleCategoryChange
    }
}