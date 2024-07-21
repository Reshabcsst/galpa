import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';
import EditWhatAuthorSaysDialog from './EditWhatAuthorSaysDialog';

const WhatAuthorSays = ({ ServerURL }) => {
    const [WhatAuthorSays, setWhatAuthorSays] = useState([]);
    const [selectedWhatAuthorSays, setSelectedWhatAuthorSays] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Notification close handler
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    // Fetching feedback items
    useEffect(() => {
        axios.get(`${ServerURL}/api/WhatAuthorSays`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setWhatAuthorSays(response.data);
            })
            .catch(error => {
                console.error("Error fetching Author's Thought:", error);
            });
    }, []);

    // Delete feedback item
    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/WhatAuthorSays/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: "Author's Thought deleted successfully", color: 'success' });
                setNotificationOpen(true);
                setWhatAuthorSays(WhatAuthorSays.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error("Error deleting Author's Thought:", error);
                setNotification({ text: "Error deleting Author's Thought", color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };

    // Edit feedback item
    const handleEdit = () => {
        const formData = new FormData();
        formData.append('name', selectedWhatAuthorSays.name);
        formData.append('quote', selectedWhatAuthorSays.quote);
        if (selectedWhatAuthorSays.image) {
            formData.append('image', selectedWhatAuthorSays.image);
        }

        axios.put(`${ServerURL}/api/WhatAuthorSays/${selectedWhatAuthorSays.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/WhatAuthorSays`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setWhatAuthorSays(response.data);
                setNotification({ text: "Author's Thought edited successfully", color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error editing feedback item:', error);
                setNotification({ text: "Error editing Author's Thought", color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    // Add feedback item
    const handleAdd = () => {
        const formData = new FormData();
        formData.append('name', selectedWhatAuthorSays.name);
        formData.append('quote', selectedWhatAuthorSays.quote);
        formData.append('image', selectedWhatAuthorSays.image);

        axios.post(`${ServerURL}/api/WhatAuthorSays`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/WhatAuthorSays`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setWhatAuthorSays(response.data);
                setNotification({ text: "Author's Thought added successfully", color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error("Error adding Author's Thought:", error);
                setNotification({ text: "Error adding Author's Thought", color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    // Edit button click handler
    const handleEditClick = (item) => {
        setSelectedWhatAuthorSays(item);
        setIsEditDialogOpen(true);
    };

    // Delete button click handler
    const handleDeleteClick = (id) => {
        setSelectedWhatAuthorSays(id);
        setIsDeleteDialogOpen(true);
    };

    // Dialog form field change handler
    const handleFieldChange = (e) => {
        setSelectedWhatAuthorSays({
            ...selectedWhatAuthorSays,
            [e.target.name]: e.target.value
        });
    };

    // Dialog file input change handler
    const handleFileChange = (e) => {
        setSelectedWhatAuthorSays({
            ...selectedWhatAuthorSays,
            image: e.target.files[0]
        });
    };

    // Add button click handler
    const handleAddClick = () => {
        setSelectedWhatAuthorSays({ name: '', quote: '', image: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>What Our Author Says</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: '974px', position: 'relative', padding: '0 16px' }}>
                <button className='add' onClick={handleAddClick}>
                    Add Author's Thought
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={WhatAuthorSays}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'name', headerName: 'Name', width: 150 },
                            { field: 'quote', headerName: 'Quote', width: 333 },
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
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditWhatAuthorSaysDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    WhatAuthorSays={selectedWhatAuthorSays}
                    onSave={selectedWhatAuthorSays && selectedWhatAuthorSays.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name="Author's Thought"
                    Data={selectedWhatAuthorSays}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedWhatAuthorSays)}
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

export default WhatAuthorSays;
