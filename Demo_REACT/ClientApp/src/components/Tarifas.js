import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const url = "https://localhost:44323/api/Tarifas/"


export class Tarifas extends Component {
    static displayName = Tarifas.name;

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        form: {
            IDTarifa: '',
            DescTar: '',
            Valor: ''
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
        delete this.state.form.IDTarifa;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url + this.state.form.IDTarifa, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    peticionDelete = () => {
        axios.delete(url + this.state.form.IDTarifa).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarEmpresa = (Tarifas) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                IDTarifa: Tarifas.IDTarifa,
                Nombre: Tarifas.DescTar,
                Valor: Tarifas.Valor
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
                <h1>Tarifas</h1>
                <br /><br /><br />
                <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Tarifa</button>
                <br /><br />
                <table className="table ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripción Tarifa</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(Tarifas => {
                            return (
                                <tr>
                                    <td>{Tarifas.IDTarifa}</td>
                                    <td>{Tarifas.DescTar}</td>
                                    <td>${Tarifas.Valor}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { this.seleccionarEmpresa(Tarifas); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => { this.seleccionarEmpresa(Tarifas); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
                            <label htmlFor="nombre">Descripción Tarifa</label>
                            <input className="form-control" type="text" name="DescTar" id="nombre" onChange={this.handleChange} value={form ? form.DescTar : ''} />
                            <br />
                            <label htmlFor="nombre">Valor</label>
                            <input className="form-control" type="number" name="Valor" id="localizacion" onChange={this.handleChange} value={form ? form.Valor : ''} />
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
                        Estás seguro que deseas eliminar esta Tarifa {form && form.DescTar}
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