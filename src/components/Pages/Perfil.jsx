import Header from "../Header"
import Footer from "../Footer"
import { use, useEffect, useState } from 'react'
import { supabase, updateTable } from '../../js/supabase'
import FormAgregarDireccion from "../FormAgregarDireccion"

const Perfil = () => {
    const [AddDirvisible, setDirVisible] = useState(false)
    const [DelDirVisible, setDelVisible] = useState(false)
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
    

    const fetchDirecciones = async () => {
        supabase.schema('mrstore2').from('direcciones').select()
            .eq('id_cliente', session.id_cliente)
            .eq('estado', true)
            .then(data => {
                if (data.data.length > 0) {
                    let id = data.data.filter(dir => dir.es_principal === true)
                    setDirecciones(data.data)
                    if (id.length == 1) {
                        setDirActiva(id[0].id_direccion)
                        return
                    }
                    return
                }
                console.log('Si se ejecuta')
                setDirActiva('')
                setDepartamento('default')
            })
    }
    useEffect(() => {
        const fetchPerfil = async () => {
            supabase.schema('mrstore2').from('usuarios').select().eq('id_usuario', session.id_usuario).then(data => {
                // console.log(session.id_usuario)
                setPerfil(data.data[0])
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
        if (DirActiva !== null && DirActiva !== '') {
            direcciones.map(dir => {
                if (dir.id_direccion === DirActiva) {
                    console.log(dir)
                    setDireccion(dir.direccion)
                    setLinkMaps(dir.maps_link)
                    setDepartamento(dir.id_departamento)
                }
            })
        }
        else {
            setDireccion('')
            setLinkMaps('')
            setDepartamento('default')
        }

    }, [DirActiva])

    const updatePerfil = async (e) => {
        e.preventDefault()
        updateTable('usuarios', e.target.id_usuario.value, 'id_usuario', { username: e.target.username.value })
        // await updateTable('usuarios', objData.id_usuario, objData)
        window.location.href = '/perfil'
    }

    const handleDepChange = (e) => {
        setDepartamento(e.target.value)
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

    const openDelPoppUp = () => {
        setDelVisible(!DelDirVisible)
    }
    const openPopUp = () => {
        setDirVisible(!AddDirvisible)
    }

    const DelDir = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.schema('mrstore2').from('direcciones').update({ estado: false }).eq('id_direccion', DirActiva)
        if (error) {
            console.error("Error al eliminar la direccion:", error)
        }
        else {
            setDelVisible(!DelDirVisible)
            setDireccion('')
            setLinkMaps('')
            setDepartamento('default')
            setDirecciones(direcciones.filter(dir => dir.id_direccion !== DirActiva))
            setDirActiva('')
            // console.log(data)
            // window.location.reload()
        }
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
            es_principal: (DirActiva !== '' ? false : true),
            estado: true
        }

        supabase.schema('mrstore2').from('direcciones').insert(objData).select().then((data, error) => {
            if (!error) {
                window.location.reload()
                // console.log(data)
                // fetchDirecciones()
                // setDirActiva(data.data[0].id_direccion)
                // setDirVisible(!AddDirvisible)
            }
        })

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

                            <button type="submit" className="btn-1">Actualizar perfil</button>
                            <br />
                            <button onClick={signOut} className="signOut btn-1">Cerrar Sesion</button>
                        </form>
                    </div>
                    <div className="login-form">
                        <h1 className="title">Direcciones</h1>
                        {direcciones.length > 0 ? (
                            <>
                                <div className="flex" style={{ marginBottom: "10px" }}>
                                    <button onClick={openPopUp} className="btn-1" >Añadir una direcciona nueva</button>
                                </div>
                                {AddDirvisible ? (<FormAgregarDireccion
                                    AddDirvisible={AddDirvisible}
                                    DireccionEvent={DireccionEvent}
                                    departamentos={departamentos}
                                    handleDepChange={handleDepChange}
                                    departamento={departamento}
                                    openPopUp={openPopUp} />) : <form method="POST" onSubmit={() => { }}>
                                    <label htmlFor="direccion"><strong>Selecione la direccion principal</strong></label>
                                    <div className="flex">
                                        <select className="selector" name="direccion" value={DirActiva} onChange={handleDirChange}>
                                            {DirActiva === '' ? (<option value="" disabled>Seleccione una direccion</option>) : null}
                                            {direcciones.map((dir, index) => {
                                                return (
                                                    <option key={index} value={dir.id_direccion} >
                                                        {dir.nombre_dir}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                        <button type="button" onClick={openDelPoppUp} className="btn-1Trash" style={{ background: "var(--red)" }}><i className='bx bx-trash'></i></button>

                                    </div>
                                    <div className="form-popupDel" style={{ display: DelDirVisible ? 'flex' : 'none' }}>
                                        <div>
                                            <p style={{ marginBottom: '1px' }}>Esta seguro que desea eleminar la direccion?</p>
                                            <div className="flex">
                                                <button className="btn-2 bg-red" onClick={DelDir}>Si</button>
                                                <button className="btn-2 bg-green" onClick={openDelPoppUp}>No</button>
                                            </div>
                                        </div>

                                    </div>
                                    <label htmlFor="direccion"><strong>Direccion</strong></label>
                                    <input type="text" placeholder="Ingrese su direccion" name="direccion" defaultValue={direccion} />
                                    <label htmlFor="linkmaps"><strong>Link de google maps</strong></label>
                                    <input type="text" placeholder="Ingrese su link de google maps" name="linkmaps" defaultValue={linkMaps} />
                                    <label htmlFor="departamento"><strong>Departamento</strong></label>
                                    <select className="selector" name="departamento" value={departamento} onChange={handleDepChange} required>
                                        {DirActiva === '' ? <option value="default" disabled>Seleccione un departamento</option> : null}
                                        {departamentos.map(dep => {
                                            return (
                                                <option key={dep.id_departamento} value={dep.id_departamento}>
                                                    {dep.nombre_dpto}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <button className="btn-1">Actualizar direccion</button>
                                </form>}


                            </>) :
                            (
                                <div className="center-y">
                                    <p className="title">No tienes direcciones registradas</p>
                                    <button onClick={openPopUp} className="btn-1">Registar direccion</button>
                                    <FormAgregarDireccion
                                        AddDirvisible={AddDirvisible}
                                        DireccionEvent={DireccionEvent}
                                        departamentos={departamentos}
                                        handleDepChange={handleDepChange}
                                        departamento={departamento}
                                        openPopUp={openPopUp} />
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