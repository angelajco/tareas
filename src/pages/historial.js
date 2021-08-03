import Parse from 'parse/dist/parse.min.js';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Timer from 'react-compound-timer'

import '../styles/historial.css'

import Grafica from '../components/Grafica'

export default function Historial() {
    //Keys para inicializar el parse de  back4app
    //Key de aplicación
    Parse.initialize("TxdhCjGbqnJuv3U9WljAR98Ojxt1a1uiBNBcbjT8", "KkCxfaDgvQJ7iuT4pwS34P6QkYroUsW3oywmioxa");
    //Key de la URL
    Parse.serverURL = "https://parseapi.back4app.com/";

    //State donde se guardarán las tareas
    const [tareas, setTareas] = useState([])

    //Para guardar los datos que se mostraran en las graficas
    const [datosGraficas, setDatosGraficas] = useState([])

    //Función que trae las tareas del backend
    const leerTareas = async function () {
        //Lectura de objetos de "Tareas"
        const parseQuery = new Parse.Query('Tareas');
        //Se ponen las tareas solo completadas
        parseQuery.equalTo('completada', true);
        //Obtenemos las tareas solo de la ultima semana
        let semanaAnterior = new Date();
        semanaAnterior.setDate(semanaAnterior.getDate() - 7);
        parseQuery.greaterThan('createdAt', semanaAnterior);
        //Si se pudieron obtener las tareas
        try {
            let arrayTempTareas = []
            //Find va por todos los objetos
            let todas = await parseQuery.find();
            //Se recorre las tareas para guardar los datos que se mostraran en la grafica
            todas.map(valor => {
                let objTemp = {}
                objTemp.nombre = valor.get('nombre')
                objTemp.finalizado = valor.get('finalizado')
                arrayTempTareas.push(objTemp)
                return null
            })
            setDatosGraficas(arrayTempTareas);
            //Asignamos todas las tareas al state
            setTareas(todas);
            return true;
        } catch (error) {
            //Si no se pudo obtener las tareas manda un alert
            alert("No se pudieron obtener las tareas")
            return false;
        }
    };

    useEffect(() => {
        //Despues de que se renderiza manda a llamar la función para obtener las tareas del backend
        leerTareas();
    }, [])

    return (
        <>
            <div className="container">
                <div className="row">
                    {
                        // Si existen tareas se muestra la tabla
                        tareas.length !== 0 ? (
                            <>
                                <div className="col-12 tw-mt-6">
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr className="tabla-cabecera">
                                                <th className="tw-text-center">Nombre</th>
                                                <th className="tw-text-center">Descripción</th>
                                                <th className="tw-text-center">Duración de la tarea</th>
                                                <th className="tw-text-center">Tarea finalizada en</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                // Se recorren los valores de las tareas para mostrar
                                                tareas.map((valor, index) => (
                                                    <tr key={index} className="tabla-datos">
                                                        <th>{valor.get('nombre')}</th>
                                                        <th>{valor.get('descripcion')}</th>
                                                        <th>
                                                            {(
                                                                <Timer
                                                                    //Se multiplica por 1000 ya que se maneja en milisegundos
                                                                    initialTime={valor.get('duracion') * 1000}
                                                                    lastUnit="h"
                                                                    startImmediately={false}
                                                                >
                                                                    {() => (
                                                                        <>
                                                                            <span>
                                                                                <Timer.Hours /> hora(s) <Timer.Minutes /> minuto(s) <Timer.Seconds /> segundo(s)
                                                                            </span>
                                                                            <br />
                                                                        </>
                                                                    )}
                                                                </Timer>
                                                            )}
                                                        </th>
                                                        <th>
                                                            {(
                                                                <Timer
                                                                    //Se multiplica por 1000 ya que se maneja en milisegundos
                                                                    initialTime={valor.get('finalizado') * 1000}
                                                                    lastUnit="h"
                                                                    startImmediately={false}
                                                                >
                                                                    {() => (
                                                                        <>
                                                                            <span>
                                                                                <Timer.Hours /> hora(s) <Timer.Minutes /> minuto(s) <Timer.Seconds /> segundo(s)
                                                                            </span>
                                                                            <br />
                                                                        </>
                                                                    )}
                                                                </Timer>
                                                            )}
                                                        </th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-12 tw-mt-6">
                                    <Grafica datosGraficas={datosGraficas} />
                                </div>
                            </>
                        ) : (
                            // Si no, se muestra mensaje
                            <div className="col-12 tw-text-center tw-text-white tw-mt-6">
                                <h3>
                                    No se tienen tareas finalizadas
                                </h3>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
