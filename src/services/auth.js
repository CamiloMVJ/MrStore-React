import { supabase } from './supabase'
import { timeStamp, timeStampz } from './dateFormat'

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
			await supabase.schema('mrstore2').from('usuarios').update({ ultimo_acceso: timeStampz() }).eq('uuid', data.user.id).select()

			let userdata = { id_usuario: user.data[0].id_usuario, id_cliente: user.data[0].clientes[0].id_cliente, id_carrito: carrito.data[0].id_carritocompras }
			sessionStorage.setItem('session', JSON.stringify(userdata))
			sessionStorage.setItem('NavIcons', JSON.stringify([{ link: '/perfil', class: 'bx-user' }, { link: '#', class: 'bx-search' }, { link: '/cart', class: 'bx-cart' }]))

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
			p_uuid: uuid
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
