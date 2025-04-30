import { createClient } from "@supabase/supabase-js"
import { timeStampz } from "./dateFormat"
import { timeStamp } from "./dateFormat"

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

export const addProductToCart = async (idUsuario, idProducto, cantidad) => {
  try {
    const {data} = await supabase.from('clientes').select('id_cliente, carritos_compras(id_carrito)').eq('id_usuario',idUsuario)
    const idCarrito = data[0].carritos_compras.id_carrito
    const {error} = await supabase.from('detcarritos_compras').insert({id_carrito: idCarrito, cantidad: cantidad, id_producto: idProducto})
    console.log(error)
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message)
    throw error
  }
}

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase.from('productos').select().eq('id_producto', id)
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error("Error al obtener producto:", error.message)
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
    if (data.length) {
      const date = timeStampz()
      await supabase.from('usuarios').update({ ultimo_acceso: date.toString() }).eq('id_usuario', data[0].id_usuario)
      const { cedula, email, fecha_registro, nombre_completo, ultimo_acceso, contraseña, username, ...nuevoObjeto } = data[0]
      sessionStorage.setItem('session', JSON.stringify(nuevoObjeto))
      return true
    }
  } catch (error) {
    console.error("No autenticado", error.message)
    return false
  }
}

const EmailVerifier = async (email) => {
  try {
    if(email === '') return false
    if(email === null) return false
    if(email === undefined) return false
    const { data, error } = await supabase.from('usuarios').select().eq('email', email)
    if (error) throw error
    return data.length === 0
  } catch (error) {
    console.error("Error al verificar email:", error.message)
    throw error
  }
}

const UserVerifier = async (user) => {
  try {
    if(user === '') return false
    if(user === null) return false
    if(user === undefined) return false
    const { data, error } = await supabase.from('usuarios').select().eq('username', user)
    if (error) throw error
    return data.length === 0
  } catch (error) {
    console.error("Error al verificar usuario:", error.message)
    throw error
  }
}

export const SignUpMeth = async (name, dni, email, username, pass, address) => {
  try {
    var emailVal = await EmailVerifier(email)
    var userVal = await UserVerifier(username)
    if (!userVal) {
      console.error("El usuario ya existe")
      return {
        message: "El usuario ya existe",
        type: "error"
      }
    }
    if (!emailVal) {
      console.error("El email ya existe")
      return {
        message: "El email ya existe",
        type: "error"
      }
    }
    
    const { data, error } = await supabase.from('usuarios').insert({
      nombre_completo: name,
      cedula: dni,
      email: email,
      username: username,
      contraseña: pass,
      fecha_registro: timeStamp(),
      ultimo_acceso: timeStampz()
    }).select()

    const idCliente = CreateClient(data[0].id_usuario, address).then((idCliente) => {
      CreateCart(idCliente)
    })
    
    if (error) throw error
    return {
      message: "Usuario registrado correctamente",
      type: "success"
    }
  } catch (error) {
    console.error("Error al registrar", error.message)
    throw error
  }
}

const CreateClient = async (idUsuario, address) => {
  try {
    const { data, error } = await supabase.from('clientes').insert({
      id_usuario: idUsuario,
      direccion: address
    }).select()
    if (error) throw error
    return data[0].id_cliente
  } catch (error) {
    console.error("Error al crear cliente:", error.message)
    throw error
  }
}

const CreateCart = async (idCliente) => {
  try {
    const { data, error } = await supabase.from('carritos_compras').insert({
      id_cliente: idCliente,
      fecha_modificacion: timeStamp(),
      total: 0
    }).select()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al crear carrito:", error.message)
    throw error
  }
}