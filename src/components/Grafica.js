import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Grafica(props) {

    //Función para poner una leyenda personalizada en el tooltip
    const leyendaPersonalizada = ({ active, payload }) => {
        //Verificamos que exista la informacion
        if (active && payload && payload.length) {
            //Obtenemos los segundos
            let segundosTooltip = payload[0].value;
            //Convertimos a minutos
            let minutos = Math.floor(segundosTooltip / 60);
            //Convertimos a segundos
            let segundos = segundosTooltip - minutos * 60;
            return (
                <div className="tooltip-personalizado">
                    <p>Tarea terminada en:</p>
                    {/* Desplegamos los minutos con los segundos restantes */}
                    <p>{`${minutos} minuto(s) con ${segundos} segundo(s)`}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height="110%" aspect={3} className="tw-mb-4">
            <LineChart
                width={500}
                height={300}
                data={props.datosGraficas}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" label={{ value: "Tarea", dy: 25, fill: 'white' }} />
                <YAxis label={{ value: `Tiempo (seg)`, dx: -15, angle: 270, fill: 'white' }} />
                <Tooltip content={leyendaPersonalizada} />
                <Legend />
                <Line type="monotone" dataKey="finalizado" stroke="#0026ff" />
            </LineChart>
        </ResponsiveContainer>
    )
}
