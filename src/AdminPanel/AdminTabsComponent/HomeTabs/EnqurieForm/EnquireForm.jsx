import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Snackbar, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteDialog from '../../DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const EnquireFormGrid = ({ServerURL}) => {
    const [enquireForms, setEnquireForms] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    useEffect(() => {
        fetchEnquireForms();
    }, []);

    const fetchEnquireForms = async () => {
        try {
            const response = await axios.get(`${ServerURL}/api/EnquireForm`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
            setEnquireForms(response.data);
        } catch (error) {
            console.error('Error fetching enquire forms:', error);
        }
    };

    const handleCopyToClipboard = (value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                console.log('Copied to clipboard:', value);
                setCopiedMessage(`Copied : ${value}`);
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 20 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 100 },
        { field: 'date', headerName: 'Date', width: 166 },
        { field: 'message', headerName: 'Message', width: 250 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 70,
            renderCell: (params) => (
                <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const renderCell = (params) => {
        const { field, value } = params;
        return (
            <div onClick={() => handleCopyToClipboard(value)} style={{ cursor: 'pointer' }}>
                {value}
            </div>
        );
    };

    columns.forEach(column => {
        if (!column.renderCell && column.field !== 'actions') {
            column.renderCell = renderCell;
        }
    });

    // Delete Form 
    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/EnquireForm/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: 'Form deleted successfully', color: 'success' });
                setNotificationOpen(true);
                setEnquireForms(enquireForms.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('Error deleting Form:', error);
                setNotification({ text: 'Error deleting Form', color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };

    // Notification close handler
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    // Delete button click handler
    const handleDeleteClick = (id) => {
        setSelectedForm(id);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className='our_work'>
            <h2 className='admin_heading'>Enquire Form Data</h2>
            <Box sx={{ width: '100%', overflowX: 'auto', height: 350, maxWidth: "1100px", padding: "0 16px" }}>
                <DataGrid
                    rows={enquireForms}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
            <DeleteDialog
                open={isDeleteDialogOpen}
                Name='Enquire Form'
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={copiedMessage}
            />
        </div>
    );
};

export default EnquireFormGrid;
