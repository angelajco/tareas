//Biblioteca que da acceso al backend que se conectará con back4app
import Parse from 'parse/dist/parse.min.js';

import React, { useEffect, useState } from 'react'
import { Form, OverlayTrigger, Tooltip, Button, Table } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Timer from 'react-compound-timer'


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
            console.log(todas, "todas")
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
    const agregaTarea = async (data) => {
        let duracion = Number(data.duracion);
        try {
            //Crea una nueva instancia de objeto
            const Tarea = new Parse.Object('Tareas');
            //Se definen los atributos que se quieren pasar al objetgo
            Tarea.set('nombre', `${data.nombre}`);
            Tarea.set('descripcion', `${data.descripcion}`);
            Tarea.set('duracion', duracion);

            //Guarda en back4app
            await Tarea.save();
            alert('Tarea guardada');
            leerTareas();
        } catch (error) {
            //Muestra error de que no se pudo guardar tarea
            console.log('Error guardando tarea:', error);
            alert('No se ha podido guardar la tarea');
        }
    }

    useEffect(() => {
        //Despues de que se renderiza manda a llamar la función para obtener las tareas del backend
        leerTareas();
    }, [])

    //Para saber si se muestra los controles del contador
    const [muestraContador, setMuestraContador] = useState(true);

    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        //Para ocultar temporalmente los contadores
        setMuestraContador(false)
        // setTareas([]);
        // Si el destino existe, esto es para evitar cuando se arrastra fuera del contenedor
        if (!result.destination) {
            return
        }
        // Se crea una copia de tareas
        let items = tareas.slice();
        // Lo eliminamos de acuerdo al index que le pasa
        let [reorderedItem] = items.splice(result.source.index, 1)
        // Se usa destination.index para agregar ese valor a su nuevo destino
        items.splice(result.destination.index, 0, reorderedItem)

        // Actualizamos las tareas
        setTareas(items);

        //Lo muestra despues de 1 milisegundo para que se vuelva a renderizar Time
        setTimeout(() => {
            setMuestraContador(true)
        }, 1)
    }

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
                                <option value="15">15 minutos</option>
                                <option value="30">30 minutos</option>
                                <option value="3600">1 hora (3600 segundos)</option>
                            </datalist>
                            <Form.Group controlId="descripcion" className="col-12 col-md-4 inputs-form">
                                <Form.Label>Descripción *</Form.Label>
                                <Form.Control type="text" required {...register("descripcion")} />
                            </Form.Group>
                            <div className="col-12 tw-text-center tw-mt-6">
                                <Button variant="success" type="submit">Agregar</Button>
                            </div>
                        </Form>
                    </div>
                    {
                        // Si existen tareas se muestra la tabla
                        tareas.lenght !== 0 ? (
                            <div className="col-12 tw-mt-6">
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className="tabla-cabecera">
                                            <th className="tw-text-center">Nombre</th>
                                            <th className="tw-text-center">Descripción</th>
                                            <th className="tw-text-center">Completada</th>
                                            <th className="tw-text-center">Duración</th>
                                            <th className="tw-text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Droppable droppableId="tareas">
                                            {(provided) => (
                                                // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                                    {
                                                        // Se recorren los valores de las tareas para mostrar
                                                        tareas.map((valor, index) => (
                                                            <Draggable key={`${index} + 1`} draggableId={`${index} + 1`} index={index}>
                                                                {(provided) => (
                                                                    <tr className="tabla-datos" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                        <th>{valor.get('nombre')}</th>
                                                                        <th>{valor.get('descripcion')}</th>
                                                                        {
                                                                            valor.get('completada') === true ? (
                                                                                <th>Sí</th>
                                                                            ) : (
                                                                                <th>No</th>
                                                                            )
                                                                        }
                                                                        <th>
                                                                            {
                                                                                // Verificamos que existe para que se vuelva a renderizar
                                                                                muestraContador === true && (
                                                                                    <Timer
                                                                                        //Se multiplica por 1000 ya que se maneja en milisegundos
                                                                                        initialTime={valor.get('duracion') * 1000}
                                                                                        lastUnit="h"
                                                                                        direction="backward"
                                                                                        startImmediately={false}>
                                                                                        {({ start, pause, stop, reset }) => (
                                                                                            <>
                                                                                                <Timer.Hours /> horas <Timer.Minutes /> minutos <Timer.Seconds /> segundos
                                                                                                <br />
                                                                                                {
                                                                                                    // Solo se mostrara en el index 0 el control de los botones
                                                                                                    index === 0 && (
                                                                                                        <div className="tw-mt-3 tw-inline-flex tw-flex-wrap tw-gap-4">
                                                                                                            <Button onClick={start} variant="light" className="boton-tiempo">Iniciar</Button>
                                                                                                            <Button onClick={pause} variant="light" className="boton-tiempo">Pausar</Button>
                                                                                                            <Button onClick={stop} variant="light" className="boton-tiempo">Parar</Button>
                                                                                                            <Button onClick={reset} variant="light" className="boton-tiempo">Restablecer</Button>
                                                                                                        </div>
                                                                                                    )
                                                                                                }
                                                                                            </>
                                                                                        )}
                                                                                    </Timer>
                                                                                )
                                                                            }
                                                                        </th>
                                                                        <th></th>
                                                                    </tr>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    }
                                                    {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                    {provided.placeholder}
                                                </tbody>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </Table>
                            </div>
                        ) : (
                            // Si no, se muestra mensaje
                            <div className="col-12 tw-text-center tw-text-white tw-mt-6">
                                <h3>
                                    No se tienen tareas ¡Crea una!
                                </h3>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}