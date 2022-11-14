import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const url = "https://localhost:44323/api/Horarios/"


export class Horarios extends Component {
    static displayName = Horarios.name;

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        form: {
            IDHorario: '',
            HoraSalida: '',
            HoraLlegada: ''
        }
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {
        delete this.state.form.IDHorario;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url + this.state.form.IDHorario, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    peticionDelete = () => {
        axios.delete(url + this.state.form.IDHorario).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarEmpresa = (Horarios) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                IDHorario: Horarios.IDHorario,
                HoraSalida: Horarios.HoraSalida,
                HoraLlegada: Horarios.HoraLlegada
            }
        })
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App">
                <h1>Horarios</h1>
                <br /><br /><br />
                <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Horario</button>
                <br /><br />
                <table className="table ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hora Salida</th>
                            <th>Hora Llegada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(Horarios => {
                            return (
                                <tr>
                                    <td>{Horarios.IDHorario}</td>
                                    <td>{Horarios.HoraSalida}:00</td>
                                    <td>{Horarios.HoraLlegada}:00</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { this.seleccionarEmpresa(Horarios); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => { this.seleccionarEmpresa(Horarios); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>



                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">HoraSalida</label>
                            <input className="form-control" type="text" name="HoraSalida" id="nombre" onChange={this.handleChange} value={form ? form.HoraSalida : ''} />
                            <br />
                            <label htmlFor="nombre">HoraLlegada</label>
                            <input className="form-control" type="text" name="HoraLlegada" id="localizacion" onChange={this.handleChange} value={form ? form.HoraLlegada : ''} />
                            <br />

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal == 'insertar' ?
                            <button className="btn btn-success" onClick={() => this.peticionPost()}>
                                Insertar
                            </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                                Actualizar
                            </button>
                        }
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar este Horario {form && form.HoraSalida}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}