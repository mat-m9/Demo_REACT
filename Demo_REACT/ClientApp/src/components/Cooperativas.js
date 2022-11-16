import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const url = "https://localhost:44323/api/Cooperativas/"


export class Cooperativas extends Component {
    static displayName = Cooperativas.name;

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        form: {
            IDCooperativa: '',
            NombreCoop: '',
            Localizacion: ''
        }
    }

    Get = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    Post = async () => {
        delete this.state.form.IDCooperativa;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.Get();
        }).catch(error => {
            console.log(error.message);
        })
    }

    Put = () => {
        axios.put(url + this.state.form.IDCooperativa, this.state.form).then(response => {
            this.modalInsertar();
            this.Get();
        })
    }

    Delete = () => {
        axios.delete(url + this.state.form.IDCooperativa).then(response => {
            this.setState({ modalEliminar: false });
            this.Get();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarCooperativa = (Cooperativas) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                IDCooperativa: Cooperativas.IDCooperativa,
                Nombre: Cooperativas.NombreCoop,
                Localizacion: Cooperativas.Localizacion
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
        this.Get();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App">
                <h1>Cooperativas</h1>
                <br /><br /><br />
                <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Cooperativa</button>
                <br /><br />
                <table className="table ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Localización</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(Cooperativas => {
                            return (
                                <tr>
                                    <td>{Cooperativas.IDCooperativa}</td>
                                    <td>{Cooperativas.NombreCoop}</td>
                                    <td>{Cooperativas.Localizacion}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { this.seleccionarCooperativa(Cooperativas); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => { this.seleccionarCooperativa(Cooperativas); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="NombreCoop" id="nombre" onChange={this.handleChange} value={form ? form.NombreCoop : ''} />
                            <br />
                            <label htmlFor="nombre">Localización</label>
                            <input className="form-control" type="text" name="Localizacion" id="localizacion" onChange={this.handleChange} value={form ? form.Localizacion : ''} />
                            <br />

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal == 'insertar' ?
                            <button className="btn btn-success" onClick={() => this.Post()}>
                                Insertar
                            </button> : <button className="btn btn-primary" onClick={() => this.Put()}>
                                Actualizar
                            </button>
                        }
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar esta Cooperativa {form && form.NombreCoop}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.Delete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
            );
    }

}