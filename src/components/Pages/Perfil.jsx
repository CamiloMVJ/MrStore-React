import Header from "../Header"
import Footer from "../Footer"
import { useEffect, useState } from 'react'
import { supabase, updateTable } from '../../js/supabase'

const Perfil = () => {

    const [visible, setVisible] = useState(false)
    const [perfil, setPerfil] = useState(null)
    const [session, setSession] = useState(() => {
        return JSON.parse(sessionStorage.getItem('session'))
    })
    useEffect(() => {
        const fetchPerfil = async () => {
            await supabase.from('usuarios').select().eq('id_usuario', session.id_usuario).then(data => {
                setPerfil(data.data[0])
            })
        }
        fetchPerfil()
    }, [])

    const updatePerfil = async (e) => {
        e.preventDefault()
        const objData = Object.fromEntries(new FormData(e.target).entries())
        await updateTable('usuarios', objData.id_usuario, objData)
        window.location.href = '/perfil'
    }

    const signOut = (e) => {
        e.preventDefault()
        sessionStorage.removeItem('session')
        window.location.href = '/login'
    }

    if (perfil) {
        return (
            <>
                <Header />
                <div className="container">
                    <div className="login-form">
                        <form onSubmit={updatePerfil} method="POST">
                            <div className="container">
                                <h1 className="title">Perfil</h1>
                                <button onClick={signOut} className="signOut">Cerrar Sesion</button>
                            </div>
                            <label htmlFor="nombre_completo">Nombre Completo</label>
                            <input type="text" placeholder="Ingrese su Nombre" id='nombre_completo' name="nombre_completo" defaultValue={perfil.nombre_completo} required />
                            <input type="hidden" name="id_usuario" defaultValue={perfil.id_usuario} required />

                            <label htmlFor="cedula">Cedula de identidad (con guiones)</label>
                            <input type="text" placeholder="Ingrese su cedula" name="cedula" id="cedula" defaultValue={perfil.cedula} required />

                            <label htmlFor="email">Email</label>
                            <input type="text" placeholder="Ingrese el Email" name="email" id='email' defaultValue={perfil.email} required />

                            <label htmlFor="username">Usuario</label>
                            <input type="text" placeholder="Ingrese su Usuario" name="username" id='username' defaultValue={perfil.username} required />

                            <label htmlFor="psw">Contraseña</label>
                            <div className="pass-container">
                                <input type={visible ? "text" : "password"} placeholder="Ingrese la contraseña" name="contraseña" id='psw' className="pass" defaultValue={perfil.contraseña} required />
                                <button
                                    type="checkbox"
                                    className="show-pass"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setVisible(!visible)
                                    }}
                                >Mostrar</button>
                            </div>

                            <button type="submit">Actualizar perfil</button>
                        </form>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
    else {
        return (
            <>
                <Header />
                <div className="container">
                    <div className="login-form">
                        <h1 className="title">Perfil</h1>
                        <p>Cargando...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

}

export default Perfil