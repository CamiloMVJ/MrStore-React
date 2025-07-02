import React from 'react';

const FormAgregarDireccion = ({
    AddDirvisible,
    DireccionEvent,
    departamentos,
    handleDepChange,
    departamento,
    openPopUp,
    display = 'flex'
}) => {
    return (
        <div className="form-popup" style={{ display: AddDirvisible ? display : 'none' }}>
            <form className="form-container" onSubmit={DireccionEvent}>
                <h1>Agregar dirección</h1>

                <label htmlFor="name"><b>Nombre de dirección</b></label>
                <input
                    type="text"
                    placeholder="Ingrese el nombre de la dirección"
                    name="name"
                    required
                />

                <label htmlFor="direccion"><b>Dirección</b></label>
                <input
                    type="text"
                    placeholder="Ingrese la dirección"
                    name="direccion"
                    required
                />

                <label htmlFor="mapsLink"><b>Link de Google Maps</b></label>
                <input
                    type="text"
                    placeholder="Pegue el link"
                    name="mapsLink"
                    required
                />

                <label htmlFor="departamento"><b>Seleccione el departamento</b></label>
                <select
                    name="departamento"
                    required
                    onChange={handleDepChange}
                    value={departamento}
                >
                    <option value="default">Seleccione el departamento</option>
                    {Array.isArray(departamentos) &&
                        departamentos.map((dep) => (
                            <option key={dep.id_departamento} value={dep.id_departamento}>
                                {dep.nombre_dpto}
                            </option>
                        ))}
                </select>

                <button type="submit" className="btn">Agregar dirección</button>
                <button type="button" className="btn cancel" onClick={openPopUp}>Cerrar</button>
            </form>
        </div>
    );
};

export default FormAgregarDireccion;