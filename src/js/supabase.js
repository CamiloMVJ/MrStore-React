import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const getProducts = async (table, rowsQnt = '', columns = '') => {
  try {
    const { data, error } = await supabase.from(table).select(columns).limit(rowsQnt)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener datos:", error.message)
    throw error
  }
}