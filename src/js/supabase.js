import { createClient } from "@supabase/supabase-js"
import { timeStampz } from "./dateFormat.js"
import { timeStamp } from "./dateFormat.js"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const signInWithEmail = async (email, pass) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    })
    console.log(error)
    if (error) {
      console.error("Error al iniciar sesión:", error.message)
      console.log(error)
      return false
    } else { 
      console.log("Sesión iniciada correctamente:", data)
      const user = await supabase.schema('mrstore2').from('usuarios').select(`id_usuario, clientes(id_cliente)`).eq('uuid', data.user.id)
      const carrito = await supabase.schema('mrstore2').from('carritocompras').select('id_carritocompras').eq('id_cliente', user.data[0].clientes[0].id_cliente)
      console.log(user.data[0].clientes[0].id_cliente)
      console.log(carrito)
      let userdata = {id_usuario: user.data[0].id_usuario, id_cliente: user.data[0].clientes[0].id_cliente, id_carrito: carrito.data[0].id_carritocompras}
      console.log(userdata)
      sessionStorage.setItem('session', JSON.stringify(userdata))
      sessionStorage.setItem('NavIcons', JSON.stringify([{ link: '/login', class: 'bx-user' }, { link: '#', class: 'bx-search' }, { link: '/cart', class: 'bx-cart' }]))

      const operador = await supabase.schema('mrstore2').from('operadores').select().eq('id_usuario', user.data[0].id_usuario).limit(1)
      if (operador.data.length) {
        sessionStorage.setItem('NavSections', JSON.stringify([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }, { title: "Inventario" }]))
      }
      else {
        sessionStorage.setItem('NavSections', JSON.stringify([{ title: "Inicio" }, { title: "Tienda" }, { title: "Pedidos" }]))
      }
      return true
    }
  }
  catch (error) {
    console.error(error)
    return false
  }

}

export const signUpNewUser = async (email, pass, name, dni, username) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: pass,
    options: {
      emailRedirectTo: 'http://localhost:5173/login',
    },
  })
  console.log(data)
  console.log(error)
  if (error) {
    console.error("Error al registrar usuario:", error.message)
    return {
      message: "Error al registrar usuario",
      type: "error"
    }
  }
  else {
    console.log("Usuario registrado correctamente:", data)
    SignUpProc(name, dni, email, username, pass, data.user.id)
    return {
      message: "Usuario registrado correctamente",
      type: "success"
    }
  }
}


export const SignUpProc = async (name, dni, email, username, pass, uuid) => {
  try {
    const { data, error } = await supabase.schema('mrstore2').rpc('insertarusuario', {
      p_cedula: dni,
      p_contraseña: pass,
      p_email: email,
      p_fecha_registro: timeStamp(),
      p_nombre_completo: name,
      p_ultimo_acceso: timeStampz(),
      p_username: username,
      p_useruuid: uuid
    })
    if (error) throw error
    return {
      message: "Usuario registrado correctamente",
      type: "success"
    }
  }
  catch (error) {
    console.error("Error al registrar:", error.message)
    throw error
  }
}

export const getTable = async (table, rowsQnt = '', columns = '') => {
  try {
    const { data, error } = await supabase.schema('mrstore2').from(table).select(columns).limit(rowsQnt)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener datos:", error.message)
    throw error
  }
}

export const addProductToCart = async (idUsuario, idProducto, cantidad) => {
  try {
    const { data } = await supabase.schema('mrstore2').from('clientes').select('id_cliente, carritos_compras(id_carrito)').eq('id_usuario', idUsuario)
    const idCarrito = data[0].carritos_compras.id_carrito
    const { error } = await supabase.schema('mrstore2').from('detcarritos_compras').insert({ id_carrito: idCarrito, cantidad: cantidad, id_producto: idProducto })
    console.log(error)
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message)
    throw error
  }
}

export const getProductById = async (id) => {
  try{
    const { data, error } = await supabase.schema('mrstore2').rpc('detproducto',{
      ID : id
    })
    console.log(error)
    console.log(data)
  }
  catch (error) {
    console.error("Error al obtener producto:", error.message)
    throw error
  }
  // try {
  //   const { data, error } = await supabase.schema('mrstore2').from('productos').select().eq('id_producto', id)
  //   if (error) throw error
  //   return data[0]
  // } catch (error) {
  //   console.error("Error al obtener producto:", error.message)
  //   throw error
  // }
}

export const updateTable = async (table, id, data) => {
  try {
    const { error } = await supabase.schema('mrstore2').from(table).update(data).eq('id_usuario', id)
    if (error) throw error
  } catch (e) {
    console.error("Error al actualizar datos:", e.message)
    throw e
  }
}

export const LoginValider = async (user, pass) => {
  try {
    const { data, error } = await supabase.schema('mrstore2').from('usuarios').select().eq('username', user).eq('contraseña', pass)
    if (data.length) {
      const date = timeStampz()
      await supabase.schema('mrstore2').from('usuarios').update({ ultimo_acceso: date.toString() }).eq('id_usuario', data[0].id_usuario)
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
    if (email === '') return false
    if (email === null) return false
    if (email === undefined) return false
    const { data, error } = await supabase.schema('mrstore2').from('usuarios').select().eq('email', email)
    if (error) throw error
    return data.length === 0
  } catch (error) {
    console.error("Error al verificar email:", error.message)
    throw error
  }
}

const UserVerifier = async (user) => {
  try {
    if (user === '') return false
    if (user === null) return false
    if (user === undefined) return false
    const { data, error } = await supabase.schema('mrstore2').from('usuarios').select().eq('username', user)
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

    const { data, error } = await supabase.schema('mrstore2').from('usuarios').insert({
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
    const { data, error } = await supabase.schema('mrstore2').from('clientes').insert({
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
    const { data, error } = await supabase.schema('mrstore2').from('carritos_compras').insert({
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