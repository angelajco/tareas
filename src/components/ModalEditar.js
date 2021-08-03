import { Modal, Form, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

export default function ModalEditar(props) {
    //Datos para crear el formulario
    const { register, handleSubmit, setValue } = useForm();

    //Se asignan los valores que se pasaran al formulario
    setValue("descripcion", props.datos.descripcion)
    setValue("duracion", props.datos.duracion)
    setValue("id", props.datos.id)

    return (
        <>
            <Modal show={props.show} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>
                        Editar tarea: {props.datos.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit(props.funcion)} className="row">
                        <input type="hidden" {...register('id')}/>
                        <Form.Group controlId="duracion" className="col-12">
                            <Form.Label>Duración (segundos) *</Form.Label>
                            <Form.Control type="number" step="1" min="1" max="7200" list="tiempo" required {...register("duracion")} />
                            <Form.Text className="text-muted tw-block"> (1 hora = 3600 segundos)</Form.Text>
                        </Form.Group>
                        <datalist id="tiempo">
                            <option value="900">15 minutos (900 segundos)</option>
                            <option value="1800">30 minutos (1800 segundos)</option>
                            <option value="3600">1 hora (3600 segundos)</option>
                        </datalist>
                        <Form.Group controlId="descripcion" className="col-12">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" {...register("descripcion")} />
                        </Form.Group>
                        <div className="col-12 tw-text-center tw-mt-6">
                            <Button variant="success" type="submit">Editar</Button>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="tw-border-none">
                    <Button variant="secondary" onClick={() => props.onHide()}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}