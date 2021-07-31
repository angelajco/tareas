//Biblioteca que da acceso al backend que se conectará con back4app
import Parse from 'parse/dist/parse.min.js';

import { useEffect, useState } from 'react'
import { Form, OverlayTrigger, Tooltip, Button, Table } from 'react-bootstrap'
import { useForm } from "react-hook-form";

//Este CSS contiene los estilos que se aplican en este componente
import '../styles/listado.css'

export default function Listado() {
    //Keys para inicializar el parse de  back4app
    //Key de aplicación
    Parse.initialize("TxdhCjGbqnJuv3U9WljAR98Ojxt1a1uiBNBcbjT8", "KkCxfaDgvQJ7iuT4pwS34P6QkYroUsW3oywmioxa");
    //Key de la URL
    Parse.serverURL = "https://parseapi.back4app.com/";

    //State donde se guardarán las tareas
    const [tareas, setTareas] = useState([])

    //Función que trae las tareas del backend
    const leerTareas = async function () {
        //Lectura de objetos de "Tareas"
        const parseQuery = new Parse.Query('Tareas');
        //Si se pudieron obtener las tareas
        try {
            //Find va por todos los objetos
            let todas = await parseQuery.find();
            //Asignamos todas las tareas al state
            setTareas(todas);
            return true;
        } catch (error) {
            //Si no se pudo obtener las tareas manda un alert
            alert("No se pudieron obtener las tareas")
            return false;
        }
    };

    //Datos para crear el formulario
    const { register, handleSubmit, formState: { errors } } = useForm();
    //Función que se ejecuta al submit del formulario
    const agregaTarea = (data) => {
        console.log(data)
    }

    useEffect(() => {
        //Despues de que se renderiza manda a llamar la función para obtener las tareas del backend
        leerTareas();
    }, [])

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12 tw-mt-6">
                        {/* Se ejecuta la función agregaTarea cuando se da submit */}
                        <Form onSubmit={handleSubmit(agregaTarea)} className="row">
                            <Form.Group controlId="nombre" className="col-12 col-md-4">
                                <Form.Label>Nombre *</Form.Label>
                                <Form.Control type="text" required {...register("nombre", { maxLength: 15 })} />
                                {/* Se muestra un mensaje cuando no se cumplen las condiciones */}
                                {errors.nombre && <p className="tw-text-white">La longitud no debe ser mayor de 15 caracteres</p>}
                            </Form.Group>
                            <Form.Group controlId="duracion" className="col-12 col-md-4 inputs-form">
                                <Form.Label>Duración en segundos *</Form.Label>
                                <Form.Control type="number" step="1" min="1" max="7200" list="tiempo" required {...register("duracion")} />
                                <Form.Text className="text-muted tw-block"> (1 hora = 3600 segundos)</Form.Text>
                            </Form.Group>
                            <datalist id="tiempo">
                                <option data-value="900">15 minutos</option>
                                <option data-value="1800">30 minutos</option>
                                <option data-value="3600">1 hora</option>
                            </datalist>
                            <Form.Group controlId="descripcion" className="col-12 col-md-4 inputs-form">
                                <Form.Label>Descripción *</Form.Label>
                                <Form.Control type="text" required {...register("duracion")} />
                            </Form.Group>
                            <div className="col-12 tw-text-center tw-mt-6">
                                <Button variant="success" type="submit">Agregar</Button>
                            </div>
                        </Form>
                    </div>
                    {
                        // Si existen tareas se muestra la tabla
                        tareas.length !== 0 ? (
                            <div className="col-12 tw-mt-6">
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className="tabla-cabecera">
                                            <th className="tw-text-center">Nombre</th>
                                            <th className="tw-text-center">Descripción</th>
                                            <th className="tw-text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            // Se recorren los valores de las tareas para mostrar
                                            tareas.map((valor, index) => (
                                                <tr className="tabla-datos" key={index}>
                                                    <th>{valor.get('nombre')}</th>
                                                    <th>{valor.get('descripcion')}</th>
                                                    <th></th>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            // Si no, se muestra mensaje
                            <div className="col-12">
                                <h3>
                                    No se tienen tareas ¡Crea Una!
                                </h3>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}