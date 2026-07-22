import { useState, useEffect } from "react"
import { fetchDirecciones, fetchDepartamentos, updatePerfil } from '../services/perfilService'
import { useCartContext } from '../context/CartContext'
import { updateTable } from '../services/supabase'

export const usePerfil = () => {
    const [direcciones, setDirecciones] = useState([])
    const [DirActiva, setDirActiva] = useState(null)
    const [departamentos, setDepartamentos] = useState([])
    const [direccion, setDireccion] = useState()
    const [linkMaps, setLinkMaps] = useState()
    const [departamento, setDepartamento] = useState()
    const { session } = useCartContext()

    useEffect(() => {
        fetchDirecciones(session).then((data) => {
            if (data.length > 0) {
                let id = data.filter(dir => dir.es_principal === true)
                setDirecciones(data)
                if (id.length == 1) {
                    setDirActiva(id[0].id_direccion)
                    return
                }
                return
            }
        })

    }, [])

    useEffect(() => {
        fetchDepartamentos().then((data) => {
            if (data.length > 0) {
                setDepartamentos(data)
            }
            else {
                setDepartamentos([])
            }
        })
    }, [])

    const handleDirChange = (e) => {
        e.preventDefault()
        let id = direcciones.filter(dir => dir.id_direccion === Number(e.target.value))[0].id_direccion
        setDirActiva(id)
        updateTable('direcciones', session.id_cliente, 'id_cliente', { es_principal: false }).then((data) => {
            if (data) {
                updateTable('direcciones', id, 'id_direccion', { es_principal: true }).then(data => {
                    if (!data) {
                        console.error("Error al actualizar la direccion principal")
                    }
                })
            }
        })
    }

    const UpdateDireccion = (e) => {
        e.preventDefault()
        updatePerfil(DirActiva, { id_departamento: departamento, direccion: direccion, maps_link: linkMaps })
    }

    return {
        direcciones,
        DirActiva,
        departamentos,
        direccion,
        departamento,
        linkMaps,
        setDirActiva,
        setDirecciones,
        handleDirChange,
        setDireccion,
        setLinkMaps,
        setDepartamento
    }
}