import Header from "../Header"
import Footer from "../Footer"
import { useState } from "react"
import { LoginValider } from "../../js/supabase"

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
            const data = await LoginValider(e.target.usuario.value, e.target.password.value)
            if (data) {
                // const session = {
                //     username: e.target.usuario.value,
                //     password: e.target.password.value
                // }
                // setUser(user)
                // sessionStorage.setItem('session', JSON.stringify(session))
                window.location.href = '/'
            }
            else {
                alert("Usuario o contraseña incorrectos")
                window.focus()
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
                                <a href="signup.php"> Registrarse</a>
                            </p>

                            <label htmlFor="usuario" >Usuario</label>
                            <input type="text" placeholder="Ingrese usuario" name="usuario" id="usuario" required />

                            <label htmlFor="password">Contraseña</label>
                            <input type="password" placeholder="Ingrese contraseña" name="psw" id="password" required />

                            <label>
                                <input type="checkbox" defaultChecked name="remember" id="rememberme" style={{ marginBottom: "15px", marginRight: "5px" }} />
                                Recuerdame
                            </label>

                            <p>
                                Creando una cuenta indica que estas de acuerdo con nuestros
                                <a href="#">Terminos y condiciones</a>.
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