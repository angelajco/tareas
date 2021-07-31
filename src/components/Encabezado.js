import {Image} from 'react-bootstrap'

//Muestra el encabezado que se verá en todas las páginas
export default function encabezado() {
    return (
        <div className="container tw-p-6">
            <div className="row">
                <div className="col-12 tw-text-center tw-text-white">
                    <h1>Listado de</h1>
                    <Image alt="tareas" src="/listado/tareas.png" fluid/>
                </div>
            </div>
        </div>
    )
}