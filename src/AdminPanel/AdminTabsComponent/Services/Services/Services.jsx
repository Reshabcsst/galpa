import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditServiceDialog from './EditServiceDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';

const Services = ({ ServerURL }) => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    useEffect(() => {
        axios.get(`${ServerURL}/api/Services/get-services`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setServices(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('name', selectedService.name);
        formData.append('details', selectedService.details);
        if (selectedService.image) {
            formData.append('image', selectedService.image);
        }

        axios.put(`${ServerURL}/api/Services/edit-service/${selectedService.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/Services/get-services`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setServices(response.data);
                setNotification({ text: 'Service Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error editing service!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        if (!selectedService.name || !selectedService.details || !selectedService.image) {
            alert('All fields are required for adding a service.');
            return;
        }

        const formData = new FormData();
        formData.append('name', selectedService.name);
        formData.append('details', selectedService.details);
        formData.append('image', selectedService.image);

        axios.post(`${ServerURL}/api/Services/add-service`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/Services/get-services`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setServices(response.data);
                setNotification({ text: 'Service Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error adding service!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/Services/delete-service/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: 'Item Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setServices(services.filter(carousel => carousel.id !== id));
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error deleteing item!', color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEditClick = (service) => {
        setSelectedService(service);
        setIsEditDialogOpen(true);
    };
    const handleDeleteClick = (id) => {
        setSelectedService(id);
        setIsDeleteDialogOpen(true);
    };


    const handleFieldChange = (e) => {
        setSelectedService({
            ...selectedService,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedService({
            ...selectedService,
            image: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedService({ name: '', details: '', image: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Services</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button
                    className='add'
                    onClick={handleAddClick}
                >
                    Add Service
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={services}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'name', headerName: 'Name', width: 250 },
                            { field: 'details', headerName: 'Details', width: 273 },
                            {
                                field: 'image',
                                headerName: 'Image',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.image}`}
                                        alt={params.row.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                width: 100,
                                renderCell: (params) => (
                                    <div>
                                        <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                )
                            }
                        ]}
                        pageSize={1}
                        rowsPerPageOptions={[1]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditServiceDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    service={selectedService}
                    onSave={selectedService && selectedService.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />
                 <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='carousel'
                    Data={selectedService}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedService)}
                />
                <Notification
                    text={notification.text}
                    color={notification.color}
                    open={notificationOpen}
                    handleClose={handleNotificationClose}
                />
            </Box>
        </div>
    );
};

export default Services;
