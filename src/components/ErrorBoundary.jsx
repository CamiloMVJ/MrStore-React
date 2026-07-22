import { Link } from "react-router-dom"
const ErrorBoundary = () => {
    return (
        <>
            <h1>404 Not found</h1>
            <Link to={'/'}>Ir a Inicio</Link>
        </>
    )
}

export default ErrorBoundary