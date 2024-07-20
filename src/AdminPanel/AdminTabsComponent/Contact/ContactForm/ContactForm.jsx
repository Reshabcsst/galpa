import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';

const ContactForm = ({ ServerURL }) => {
    const [contacts, setContacts] = useState([]);
    const [notification, setNotification] = useState({ color: '', text: '' });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Notification
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    // Fetching contact data
    useEffect(() => {
        axios.get(`${ServerURL}/api/ContactForm`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => setContacts(response.data))
            .catch(error => console.error('Error:', error));
    }, [token.token, ServerURL]);

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/ContactForm/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated contact data after deleting
                return axios.get(`${ServerURL}/api/ContactForm`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setContacts(response.data);
                setNotification({ text: 'Contact deleted successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error deleting contact!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsDeleteDialogOpen(false);
    };

    const handleDeleteClick = (id) => {
        setSelectedForm(id);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Contact Form Details</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 400 }}>
                    <DataGrid
                        rows={contacts}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'name', headerName: 'Name', width: 130 },
                            { field: 'email', headerName: 'Email', width: 150 },
                            { field: 'phone', headerName: 'Phone', width: 130 },
                            { field: 'date', headerName: 'Date', width: 120 },
                            { field: 'message', headerName: 'Message', width: 200 },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                width: 100,
                                renderCell: (params) => (
                                    <div>
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
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='Form'
                    Data={selectedForm}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedForm)}
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

export default ContactForm;
