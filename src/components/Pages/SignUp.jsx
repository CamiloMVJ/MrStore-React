import Header from "../Header"
import Footer from "../Footer"
import { Link } from "react-router-dom"
import { SignUpMeth } from "../../js/supabase"
import { useState, useEffect } from "react"
import Notification from "../Notification"

const SignUp = () => {
    const [error, setError] = useState(null)
    const [type , setType] = useState(null)

    useEffect(() => {
        if (error === null) return
        const timer = setTimeout(() => {
            setError(null)
            setType(null)
        }, 3000)
        return () => clearTimeout(timer)
    }, [error])

    const SignUpMet = async (e) => {
        e.preventDefault()
        SignUpMeth(e.target.nombre.value, e.target.cedula.value, e.target.correo.value, e.target.usuario.value, e.target.psw.value, e.target.direccion.value).then(res =>{
            setError(res.message)
            setType(res.type)
        })

    }

    return (
        <>

            <Header />
            <div className="container">
                <div className="login-form">
                    <form onSubmit={SignUpMet} method="POST">
                        <Notification message={error} type={type} />

                        <h1>Registro</h1>
                        <p>
                            Por favor llena este formulario para crear una cuenta o
                            <Link to={'/login'}> Iniciar Sesion</Link>
                        </p>

                        <label htmlFor="nombre">Nombre Completo</label>
                        <input type="text" placeholder="Ingrese su Nombre" name="nombre" required></input>
                        <label htmlFor="cedula">Cedula de identidad (con guiones)</label>
                        <input type="text" placeholder="Ingrese su cedula" name="cedula" id="cedula" required></input>
                        <label htmlFor="email">Email</label>
                        <input type="text" placeholder="Ingrese el Email" name="correo" required></input>
                        <label htmlFor="usuario">Usuario</label>
                        <input type="text" placeholder="Ingrese su Usuario" name="usuario" required></input>
                        <label htmlFor="psw">Contraseña</label>
                        <input type="password" placeholder="Ingrese la contraseña" name="psw" required></input>
                        <label htmlFor="direccion">Direccion</label>
                        <input type="text" placeholder="Ingrese su direccion" name="direccion" required></input>
                        <label>
                            <input type="checkbox" name="remember" style={{ marginBottom: "15px", marginRight: "10px" }}></input>
                            Remember me
                        </label>
                        <p>
                            Al crear una cuenta usted acepta nuestros
                            <Link href="#">Terminos &amp; Condiciones</Link>.
                        </p>
                        <div className="buttons">
                            <button type="button" className="cancelbtn">Cancel</button>
                            <button type="submit" className="signupbtn">Resgistrarse</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SignUp
