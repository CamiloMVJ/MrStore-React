import Header from "../Header"
import Footer from "../Footer"
import { use, useEffect, useState } from 'react'
import { supabase, updateTable } from '../../js/supabase'

const Perfil = () => {
    const [visible, setVisible] = useState(false)
    const [perfil, setPerfil] = useState(null)
    const [session, setSession] = useState(() => {
        return JSON.parse(sessionStorage.getItem('session'))
    })
    const [direcciones, setDirecciones] = useState([])
    const [DirActiva, setDirActiva] = useState(null)
    const [direccion, setDireccion] = useState()
    const [linkMaps, setLinkMaps] = useState()
    const [departamento, setDepartamento] = useState()
    const [departamentos, setDepartamentos] = useState([])
    useEffect(() => {
        const fetchPerfil = async () => {
            supabase.schema('mrstore2').from('usuarios').select().eq('id_usuario', session.id_usuario).then(data => {
                // console.log(session.id_usuario)
                setPerfil(data.data[0])
            })
        }
        const fetchDirecciones = async () => {
            supabase.schema('mrstore2').from('direcciones').select()
                .eq('id_cliente', session.id_cliente)
                .eq('estado', true)
                .then(data => {
                    if (data.data.length > 0) {
                        setDirecciones(data.data)
                        setDirActiva(data.data.filter(dir => dir.es_principal === true)[0].id_direccion)
                    }
                })
        }
        const fetchDepartamentos = async () => {
            const { data, error } = await supabase.schema('mrstore2').from('departamentos').select()

            if (data.length > 0) {
                setDepartamentos(data)
            }
        }
        fetchDepartamentos()
        fetchDirecciones()
        fetchPerfil()
    }, [])

    useEffect(() => {
        direcciones.map(dir => {
            if (dir.id_direccion === DirActiva) {
                setDireccion(dir.direccion)
                setLinkMaps(dir.maps_link)
            }
        })
    }, [DirActiva])

    const updatePerfil = async (e) => {
        e.preventDefault()
        updateTable('usuarios', e.target.id_usuario.value, 'id_usuario', { username: e.target.username.value })
        // await updateTable('usuarios', objData.id_usuario, objData)
        window.location.href = '/perfil'
    }

    const handleDepChange = (e) => {

    }
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

    const openPopUp = () => {
        setVisible(!visible)
    }
    const DireccionEvent = async (e) => {
        e.preventDefault()
        if (e.target.name.value === '' || e.target.direccion.value === '' || e.target.mapsLink.value === '' || e.target.departamento.value === 'default') {
            alert('Por favor, complete todos los campos.')
            return
        }

        const objData = {
            id_cliente: session.id_cliente,
            nombre_dir: e.target.name.value,
            direccion: e.target.direccion.value,
            maps_link: e.target.mapsLink.value,
            id_departamento: e.target.departamento.value,
            es_principal: true,
            estado: true
        }

        const { data, error } = await supabase.schema('mrstore2').from('direcciones').insert(objData)
        if (!error) {
            console.log(data)
        }
    }

    const signOut = (e) => {
        e.preventDefault()
        localStorage.clear()
        sessionStorage.removeItem('NavIcons')
        sessionStorage.removeItem('NavSections')
        sessionStorage.removeItem('session')
        supabase.auth.signOut()
        window.location.href = '/'
    }

    if (perfil) {
        return (
            <>
                <Header />
                <div className="container flex">
                    <div className="login-form">
                        <form onSubmit={updatePerfil} method="POST">

                            <h1 className="title">Perfil</h1>

                            <label htmlFor="nombre_completo"><strong>Nombre Completo</strong></label>
                            <input type="text" placeholder="Ingrese su Nombre" id='nombre_completo' name="nombre_completo" defaultValue={perfil.nombre_completo} required readOnly />
                            <input type="hidden" name="id_usuario" defaultValue={perfil.id_usuario} required />

                            <label htmlFor="cedula"><strong>Cedula de identidad (con guiones)</strong></label>
                            <input type="text" placeholder="Ingrese su cedula" name="cedula" id="cedula" defaultValue={perfil.cedula} required readOnly />

                            <label htmlFor="email"><strong>Email</strong></label>
                            <input type="text" placeholder="Ingrese el Email" name="email" id='email' defaultValue={perfil.email} required readOnly />

                            <label htmlFor="username"><strong>Usuario</strong></label>
                            <input type="text" placeholder="Ingrese su Usuario" name="username" id='username' defaultValue={perfil.username} required />

                            <button type="submit">Actualizar perfil</button>
                            <br />
                            <button onClick={signOut} className="signOut">Cerrar Sesion</button>
                        </form>
                    </div>
                    <div className="login-form">
                        <h1 className="title">Direcciones</h1>
                        {direcciones.length > 0 ? (
                            <>
                                <form method="POST" onSubmit={() => { }}>
                                    <div>
                                        <label htmlFor="direccion"><strong>Selecione la direccion principal</strong></label>
                                        <select className="selector" name="direccion" value={DirActiva} onChange={handleDepChange}>
                                            {direcciones.map((dir, index) => {
                                                return (
                                                    <option key={index} value={dir.id_direccion} >
                                                        {dir.nombre_dir}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <label htmlFor="direccion"><strong>Direccion</strong></label>
                                    <input type="text" placeholder="Ingrese su direccion" name="direccion" defaultValue={direccion} />
                                    <label htmlFor="linkmaps"><strong>Link de google maps</strong></label>
                                    <input type="text" placeholder="Ingrese su link de google maps" name="linkmaps" defaultValue={linkMaps} />
                                    <label htmlFor="departamento"><strong>Departamento</strong></label>
                                    <select className="selector" name="departamento" value={departamento}>
                                        {departamentos.map(dep => {
                                            return (
                                                <option key={dep.id_departamento} value={dep.id_departamento}>
                                                    {dep.nombre_dpto}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </form>
                            </>) :
                            (
                                <div className="center-y">
                                    <p className="title">No tienes direcciones registradas</p>
                                    <button onClick={openPopUp} className="btn-1">Registar direccion</button>
                                    <div className="form-popup" style={{ display: visible ? 'flex' : 'none' }}>
                                        <form className="form-container" onSubmit={DireccionEvent}>
                                            <h1>Agregar direccion</h1>
                                            <label htmlFor="name"><b>Nombre de direccion</b></label>
                                            <input type="text" placeholder="Ingrese el nombre de la direccion" name="name" required />

                                            <label htmlFor="direccion"><b>Direccion</b></label>
                                            <input type="text" placeholder="Ingrese la direccion" name="direccion" required />

                                            <label htmlFor="mapsLink"><b>Link de google maps</b></label>
                                            <input type="text" placeholder="Pegue el link" name="mapsLink" required />

                                            <label htmlFor="departamento"><b>Seleccione el departamento</b></label>
                                            <select name="departamento" required>
                                                <option value="default">Seleccione el departamento</option>
                                                {Array.isArray(departamentos) && departamentos.map((dep, index) => {
                                                    return (
                                                        <option key={dep.id_departamento} value={dep.id_departamento}>
                                                            {dep.nombre_dpto}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                            <button type="submit" className="btn">Agregar direccion</button>
                                            <button type="button" className="btn cancel" onClick={openPopUp}>Cerrar</button>

                                        </form>
                                    </div>
                                </div>
                            )}
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