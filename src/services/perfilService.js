import { supabase, updateTable } from '../services/supabase'

export const fetchDirecciones = async (session) => {
    try {
        const { data, error } = await supabase.schema('mrstore2').from('direcciones').select()
            .eq('id_cliente', session.id_cliente)
            .eq('estado', true)
        // console.log('Direcciones cargadas:', data.data)
        return data

    }
    catch (error) {
        console.error("Error al cargar direcciones:", error)
    }
}

export const fetchPerfil = async (session) => {
    try {
        const { data, error } = await supabase.schema('mrstore2').from('usuarios').select().eq('id_usuario', session.id_usuario)
        if (data.length > 0) {
            return data[0]
        }
        else {
            return null
        }
    }
    catch (error) {
        console.error("Error al cargar perfil:", error)
    }
}
export const fetchDepartamentos = async () => {
    try {
        const { data, error } = await supabase.schema('mrstore2').from('departamentos').select()

        if (data.length > 0) {
            return data
        }
        else {
            return []
        }
    }
    catch (error) {
        console.error("Error al cargar departamentos:", error)
    }
}

export const updatePerfil = async (id_direccion, perfilData) => {
    try {
        const { data, error } = await updateTable('direcciones', id_direccion, 'id_direccion', perfilData)
        return data
    }
    catch (error) {
        console.error("Error al actualizar perfil:", error)
    }
}