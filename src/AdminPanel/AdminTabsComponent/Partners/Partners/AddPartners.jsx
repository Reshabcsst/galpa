import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPartnerDialog from './EditPartnerDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const AddPartners = ({ ServerURL }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
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
        fetchPartners();
    }, []);

    const fetchPartners = () => {
        axios.get(`${ServerURL}/api/Partners`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setPartners(response.data);
            })
            .catch(error => {
                console.error('Error fetching partners:', error);
            });
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('name', selectedPartner.name);
        formData.append('description', selectedPartner.description);
        // Ensure images is an array and append each image file
        if (selectedPartner.images && Array.isArray(selectedPartner.images)) {
            selectedPartner.images.forEach(image => {
                if (image instanceof File) {
                    formData.append('images', image);
                } else {
                    console.warn('Skipping non-file image:', image);
                }
            });
        }

        axios.put(`${ServerURL}/api/Partners/${selectedPartner.partnerId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                fetchPartners(); // Update the list of partners after editing
                setNotification({ text: 'Partner Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error editing partner:', error);
                setNotification({ text: 'Error editing partner!', color: 'error' });
                setNotificationOpen(true);
            });
        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        const formData = new FormData();
        formData.append('name', selectedPartner.name);
        formData.append('description', selectedPartner.description);
        selectedPartner.images.forEach(image => {
            formData.append('images', image);
        });

        axios.post(`${ServerURL}/api/Partners`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                fetchPartners(); // Update the list of partners after adding
                setNotification({ text: 'Partner Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error adding partner:', error);
                setNotification({ text: 'Error adding partner!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/Partners/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                fetchPartners(); // Update the list of partners after deleting
                setNotification({ text: 'Partner Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error deleting partner:', error);
                setNotification({ text: 'Error deleting partner!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsDeleteDialogOpen(false);
    };

    const handleEditClick = (partner) => {
        setSelectedPartner(partner);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedPartner(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        setSelectedPartner({
            ...selectedPartner,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedPartner({
            ...selectedPartner,
            images: Array.from(e.target.files)
        });
    };

    const handleAddClick = () => {
        setSelectedPartner({
            name: '',
            description: '',
            images: []
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Partners</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button
                    className='add'
                    onClick={handleAddClick}
                >
                    Add Partner
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={partners}
                        columns={[
                            { field: 'partnerId', headerName: 'ID', width: 50 },
                            { field: 'name', headerName: 'Name', width: 150 },
                            { field: 'description', headerName: 'Description', width: 170 },
                            {
                                field: 'imageLink',
                                headerName: 'Image',
                                width: 400,
                                renderCell: (params) => (
                                    <div>
                                        {params.row.imageLink.split(';').map((link, index) => (
                                            <img
                                                key={index}
                                                src={`${ServerURL}${link}`}
                                                alt={params.row.name}
                                                style={{ width: '70px', height: '70px', objectFit: 'cover', marginRight: '5px' }}
                                            />
                                        ))}
                                    </div>
                                )
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                width: 100,
                                renderCell: (params) => (
                                    <div>
                                        {/* <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
                                            <EditIcon />
                                        </IconButton> */}
                                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.partnerId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                )
                            }
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row.partnerId}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditPartnerDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    partner={selectedPartner}
                    ServerURL={ServerURL}
                    onSave={selectedPartner && selectedPartner.partnerId ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='partner'
                    Data={selectedPartner}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedPartner)}
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

export default AddPartners;
