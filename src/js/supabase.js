import { createClient } from "@supabase/supabase-js"

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

export const LoginValider = async (user, pass) => {
  try {
    const { data, error } = await supabase.from('usuarios').select().eq('username', user).eq('contraseña', pass)
    if(data.length) return true
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
    if(data.user.aud === 'authenticated') return true
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