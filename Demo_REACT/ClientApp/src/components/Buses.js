import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const url = "https://localhost:44323/api/Buses/"


export class Buses extends Component {
    static displayName = Buses.name;

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        form: {
            IDBus: '',
            NombreConductor: '',
            IDCooperativa: '',
            IDHorario: '',
            IDRuta: '',
            IDTarifa: '',
            Cooperativas: {
                NombreCoop: '',
                IDCooperativa:''
            },
            Rutas: {
                DescRuta: ''
            },
            Tarifas: {
                Valor: ''
            },
            Horarios: {
                HoraLlegada: '',
                HoraSalida:''
            }
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
        delete this.state.form.IDBus;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url + this.state.form.IDBus, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    peticionDelete = () => {
        axios.delete(url + this.state.form.IDBus).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarEmpresa = (Buses) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                IDBus: Buses.IDBus,
                Nombre: Buses.NombreConductor,
                Localizacion: Buses.Localizacion
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

    handleChangeCoop = async e => {
        e.persist();
        await this.setState({
            formCooperativas: {
                ...this.state.formCooperativas,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.formCooperativas);
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App">
                <h1>Buses</h1>
                <br /><br /><br />
                <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Bus</button>
                <br /><br />
                <table className="table ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Conductor</th>
                            <th>Cooperativa</th>
                            <th>Ruta</th>
                            <th>Tarifa</th>
                            <th>Hora Salida</th>
                            <th>Hora Llegada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(Buses => {
                            return (
                                <tr>
                                    <td>{Buses.IDBus}</td>
                                    <td>{Buses.NombreConductor}</td>
                                    <td>{Buses.Cooperativas.NombreCoop}</td>
                                    <td>{Buses.Rutas.DescRuta}</td>
                                    <td>${Buses.Tarifas.Valor}</td>
                                    <td>{Buses.Horarios.HoraSalida}:00</td>
                                    <td>{Buses.Horarios.HoraLlegada}:00</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { this.seleccionarEmpresa(Buses); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => { this.seleccionarEmpresa(Buses); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
                            <label htmlFor="nombre">Nombre Conductor</label>
                            <input className="form-control" type="text" name="NombreConductor" id="nombre" onChange={this.handleChange} value={form ? form.NombreConductor : ''} />
                            <br />
                            <label htmlFor="nombre">Cooperativa</label>
                            <input className="form-control" type="text" name="IDCooperativa" id="localizacion" onChange={this.handleChange} value={form ? form.Localizacion : ''} />
                            <br />
                            <label htmlFor="nombre">Ruta</label>
                            <input className="form-control" type="text" name="IDRuta" id="localizacion" onChange={this.handleChange} value={form ? form.Localizacion : ''} />
                            <br />
                            <label htmlFor="nombre">Tarifa</label>
                            <input className="form-control" type="text" name="IDTarifa" id="localizacion" onChange={this.handleChange} value={form ? form.Localizacion : ''} />
                            <br />
                            <label htmlFor="nombre">Horario</label>
                            <input className="form-control" type="int" name="IDHorario" id="localizacion" onChange={this.handleChange} value={form ? form.Localizacion : ''} />
                            <br />

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
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
                        Estás seguro que deseas eliminar este Bus {form && form.NombreConductor}
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