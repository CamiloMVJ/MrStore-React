import Header from "../Header"
import Footer from "../Footer"
import { useState } from "react"
import { signInWithEmail } from "../../js/supabase"
import { Link } from "react-router-dom"

const Login = () => {
    if (sessionStorage.getItem('session')) {
        window.location.href = '/perfil'
    }
    else {
        const [navSections, setNavSections] = useState([{ title: "Inicio" }, { title: "Tienda" }])
        const [auth, setAuth] = useState(false)
        const [user, setUser] = useState({})
        const [session, setSesion] = useState(() => {
            try {
                const session = JSON.parse(sessionStorage.getItem('session'))
                return session ? JSON.parse(session) : undefined
            }
            catch (error) {
                return undefined
            }
        })

        const LoginIn = async (e) => {
            e.preventDefault()
            const res = await signInWithEmail(e.target.correo.value, e.target.password.value)
            console.log(res)
            if (res) {
                window.location.href = '/'
            }
            else {
                alert("Error al iniciar sesión")
            }
        }

        return (
            <>
                <Header />
                <div className="container">
                    <div className="login-form">
                        <form onSubmit={LoginIn}>
                            <h1>Iniciar Sesion</h1>
                            <p>
                                Ya tienes una cuenta o
                                <Link to="/signup"> Registrarse</Link>
                            </p>

                            <label htmlFor="usuario" >Correo electronico</label>
                            <input type="text" placeholder="Ingrese usuario" name="correo" id="correo" required />

                            <label htmlFor="password">Contraseña</label>
                            <input type="password" placeholder="Ingrese contraseña" name="password" id="password" required />

                            <label>
                                <input type="checkbox" defaultChecked name="remember" id="rememberme" style={{ marginBottom: "15px", marginRight: "5px" }} />
                                Recuerdame
                            </label>

                            <p>
                                Creando una cuenta indica que estas de acuerdo con nuestros
                                <Link to="/terms">Terminos y condiciones</Link>.
                            </p>

                            <div className="buttons">
                                <button type="button" className="cancelbtn">Cancelar</button>
                                <button type="submit" className="signupbtn">Iniciar Sesion</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </>
        )
    }
}

export default Login