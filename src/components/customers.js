import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import {Modal,Button, Navbar, Form, FormControl, Container, Row, Col} from 'react-bootstrap';

const Customers = () =>{

    let api = 'https://blaze-api.herokuapp.com/';

    const gridApi = useRef();

    const [show, setShow] = useState(false);
    const [nameModal, setNameModal] = useState("Add a customer");
    const [search, setSearch] = useState("");

    const handleClose = () => setShow(false);

    const [dataCustomer,setDataCustomer] = useState({
          customer : {}  
    });

    const [field, setField] = useState("FirstName");

  
    const [dataGrid,setDatagrid] = useState({
        columnDefs: [
            {headerName: "Id", field: "id",sortable: true, filter: true},
            {headerName: "First Name", field: "firstName",sortable: true, filter: true},
            {headerName: "Last Name", field: "lastName",sortable: true, filter: true},
            {headerName: "Email", field: "email",sortable: true, filter: true},
            {headerName: "Phone Number", field: "phoneNumber",sortable: true, filter: true},
            {
                headerName: "Edit",
                field: "id",
                colId: "edit",
                cellRendererFramework: (row)=> {
                  return <button className="btn btn-success" onClick={goToEdit(row.data.id)} >Edit </button>
                },
            },
            {
                headerName: "Delete",
                field: "id",
                colId: "delete",
                cellRendererFramework: (row)=> {
                  return <button className="btn btn-danger" onClick={goToDelete(row.data.id)}>Delete</button>
                },
            }
          ],
          rowData: []
    }
    );

    const saveCustomer = () => {
        
        let method = dataCustomer.customer.id ? axios.put(api + 'customers', dataCustomer.customer) : axios.post(api + 'customers', dataCustomer.customer) ;

        method.then(res => {
            setShow(false);
            loadCustomers();
        }, err=>{
            
        })
    }

    const addCustomer = () =>{
        dataCustomer.customer = {};
        console.log(gridApi.paginationGetCurrentPage);
        setShow(true);
    }

    const goToEdit = (id) => e =>{
        
        axios.get(api + 'customers/' + id).then(response=>{
                dataCustomer.customer = response.data;
                setDataCustomer({...dataCustomer});
                setNameModal("Edit a customer")
                setShow(true);
                
         });
    }
    
    const loadCustomers = () => {
        axios.get(api + 'customers?size=1200').then(response=>{
            dataGrid.rowData = response.data.content;
            setDatagrid({...dataGrid})
         });
    }

    const goToDelete = (id) => e => {
        axios.delete(api + 'customers/' + id).then(response=>{
            loadCustomers();
         });
    }


    useEffect(() => {
       
        loadCustomers();

    }, [dataGrid.rowData === []]);

    const handleChange = event => {        
        if(event.target.name === "firstName"){
            dataCustomer.customer.firstName = event.target.value;
        }
        if(event.target.name === "lastName"){
            dataCustomer.customer.lastName = event.target.value;
        }
        if(event.target.name === "email"){
            dataCustomer.customer.email = event.target.value;
        }
        if(event.target.name === "phoneNumber"){
            dataCustomer.customer.phoneNumber = event.target.value;
        }

        setDataCustomer({...dataCustomer});
    }

    const changeTextName = event => {
        setSearch(event.target.value);
        
    }

    const SearchName = () =>{
        if(search !== ""){
            axios.get(api + 'customers/search?search=' + search + '&field=' + field).then(response=>{
                dataGrid.rowData = response.data;
                setDatagrid({...dataGrid})
             });
        }else{
            loadCustomers();
        }
       
    }

    const changeField = (event) =>{
        setField(event.target.value);
    }

    return (
        
    <React.Fragment>
        <Navbar className="bg-dark justify-content-between">
            <Form inline>
            <Navbar.Brand style={{color:'white'}}>Blaze</Navbar.Brand>
            </Form>
           
            <Form inline>
            <Form.Group controlId="exampleForm.SelectCustom" style={{ marginRight:'10px' }} >
                <Form.Control as="select" custom onChange={changeField.bind(this)}>
                <option value="FirstName">First Name</option>
                <option value="LastName">Last Name</option>
                <option value="Email">Email</option>
                <option value="PhoneNumber">Phone Number</option>
                </Form.Control>
            </Form.Group>
                <FormControl type="text" placeholder="Search a customer" onChange={changeTextName} className=" mr-sm-2" />
                <Button type="button" onClick={SearchName}>Search</Button>
            </Form>
        </Navbar>
        <Container>
            
                <h1 className="mt-5">List Customers</h1>
                <Button type="submit" onClick={addCustomer}>Add a customer</Button>
                <div className="ag-theme-alpine" style={ {height: '600px', width: '100%', marginTop:'10px'} }>
                        <AgGridReact
                            columnDefs={dataGrid.columnDefs}
                            rowData={dataGrid.rowData}
                            pagination={true}
                            paginationAutoPageSize={true}
                            >
                        </AgGridReact>
                    </div>
        </Container>
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{nameModal}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" value={dataCustomer.customer.firstName} onChange={handleChange} name="firstName" id="firstName" placeholder="Enter First Name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" value={dataCustomer.customer.lastName} onChange={handleChange} name="lastName" id="lastName" placeholder="Enter Last Name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={dataCustomer.customer.email} onChange={handleChange} name="email" id="email" placeholder="Enter Email" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" value={dataCustomer.customer.phoneNumber} onChange={handleChange} name="phoneNumber" id="phoneNumber" placeholder="Enter phone Number" />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveCustomer}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
           
    </React.Fragment>
    );
}

export default Customers;