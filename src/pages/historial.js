import Parse from 'parse/dist/parse.min.js';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Timer from 'react-compound-timer'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

import '../styles/historial.css'

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
        //Si se pudieron obtener las tareas
        try {
            let arrayTempTareas = []
            //Find va por todos los objetos
            let todas = await parseQuery.find();
            todas.map(valor => {
                let objTemp = {}
                objTemp.nombre = valor.get('nombre')
                // let finalizado = valor.get('finalizado')

                objTemp.finalizado = valor.get('finalizado')
                arrayTempTareas.push(objTemp)
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

    const leyendaPersonalizada = ({ active, payload }) => {
        if (active && payload && payload.length) {
            let segundosTooltip = payload[0].value;
            let minutos = Math.floor(segundosTooltip / 60);
            let segundos = segundosTooltip - minutos * 60;
            return (
                <div className="tooltip-personalizado">
                    <p>Tarea terminada en:</p>
                    <p>{`${minutos} minuto(s) con ${segundos} segundo(s)`}</p>
                </div>
            );
        }

        return null;
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    {
                        // Si existen tareas se muestra la tabla
                        tareas.lenght !== 0 ? (
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
                                                                {({ start, pause, stop, reset }) => (
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
                                                                {({ start, pause, stop, reset }) => (
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
                        ) : (
                            // Si no, se muestra mensaje
                            <div className="col-12 tw-text-center tw-text-white tw-mt-6">
                                <h3>
                                    No se tienen tareas finalizadas
                                </h3>
                            </div>
                        )
                    }
                    <div className="col-12 tw-mt-6">
                        <ResponsiveContainer width="100%" height="110%" aspect={3} className="tw-mb-4">
                            <LineChart
                                width={500}
                                height={300}
                                data={datosGraficas}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" label={{ value: "Tarea", dy: 25, fill: 'white' }} />
                                <YAxis label={{ value: `Tiempo (seg)`, dx: -15, angle: 270, fill: 'white'}} />
                                <Tooltip content={leyendaPersonalizada} />
                                <Legend />
                                <Line type="monotone" dataKey="finalizado" stroke="#0026ff" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
