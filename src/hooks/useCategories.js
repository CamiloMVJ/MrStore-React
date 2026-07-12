import { useState, useEffect } from 'react'
import { getTable } from '../services/supabase'
import { useParams } from 'react-router-dom'

export const useCategories = () => {
    const { categoria } = useParams()
    const [categories, setCategories] = useState([])
    const [upFiltro, setUpFiltro] = useState([undefined])
    const [upPage, setUpPage] = useState(1)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)


    useEffect(() => {
        // console.log(urlListedCats)
        // console.log("Fetching categories")
        const fetchAllCats = async () => {
            try {
                // Get categories
                const cats = await getTable('categorias')
                setCategories(cats)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchAllCats()
    }, [])

    useEffect(() => {
        const updateFiltersFromURL = async () => {
            try {
                if (categoria !== undefined) {
                    // console.log("Actualizando filtros desde la URL:", categoria)
                    let urlListedCats = categoria ? categoria.split(',').map(cat => cat.trim().toLowerCase()) : []
                    // console.log("Parsed categories from URL:", urlListedCats)
                    if (urlListedCats.length > 0 && categories.length > 0) {
                        const urlCats = categories.filter(cat => urlListedCats.includes(cat.nombre_categoria.toLowerCase()))
                            .map(cat => cat.id_categoria)
                        // console.log("Filtered categories from URL:", urlCats)
                        if (urlCats.length > 0) {
                            // console.log("Updating filters from URL:", urlCats)
                            setUpFiltro(urlCats)
                            setUpPage(1)
                        }
                    }
                }
                else{
                    setUpFiltro([])
                    setUpPage(1)
                }
            }
            catch (error) {
                console.error("Error updating filters from URL:", error)
            }
        }
        updateFiltersFromURL()
    }, [categoria, categories])

    return { categories, categoria, upFiltro, upPage, setCategories }
}