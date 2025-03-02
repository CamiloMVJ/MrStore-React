import { createClient } from "@supabase/supabase-js"
import {timeStampz} from "./dateFormat"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const getTable = async (table, rowsQnt = '', columns = '') => {
  try {
    const { data, error } = await supabase.from(table).select(columns).limit(rowsQnt)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener datos:", error.message)
    throw error
  }
}

export const updateTable = async (table, id, data) => {
  try {
    const { error } = await supabase.from(table).update(data).eq('id_usuario', id)
    if (error) throw error
  } catch (e) {
    console.error("Error al actualizar datos:", e.message)
    throw e
  }
}

export const LoginValider = async (user, pass) => {
  try {
    const { data, error } = await supabase.from('usuarios').select().eq('username', user).eq('contraseña', pass)
    if (data.length){
      const date = timeStampz()
      await supabase.from('usuarios').update({ultimo_acceso: date.toString()}).eq('id_usuario', data[0].id_usuario)
      const {cedula, email,fecha_registro, nombre_completo, ultimo_acceso, ...nuevoObjeto} = data[0]
      sessionStorage.setItem('session', JSON.stringify(nuevoObjeto))
      return true
    }
  } catch (error) {
    console.error("No autenticado", error.message)
    return false
  }
}

export const LoginValiderSupabase = async (email, pass) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass
    })
    if (data.user.aud === 'authenticated') return true
  } catch (error) {
    console.error("No autenticado", error.message)
    return false
  }
}

export const SingInSupabase = async (email, pass) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pass
    })
  } catch (error) {
    console.error("Error al registrar", error.message)
    throw error
  }
}