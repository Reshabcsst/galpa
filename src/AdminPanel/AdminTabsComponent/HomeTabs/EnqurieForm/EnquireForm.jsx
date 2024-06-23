import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const EnquireFormGrid = () => {
    const [enquireForms, setEnquireForms] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState('');
    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    useEffect(() => {
        fetchEnquireForms();
    }, []);

    const fetchEnquireForms = async () => {
        try {
            const response = await axios.get('http://localhost:5241/api/EnquireForm', {
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
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'date', headerName: 'Date', width: 165},
        { field: 'message', headerName: 'Message', width: 270 }
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
        if (!column.renderCell) {
            column.renderCell = renderCell;
        }
    });

    return (
        <div className='our_work'>
            <h2 className='admin_heading'>Enquire Form Data</h2>
            <Box sx={{ width: '100%', overflowX: 'auto', height: 350, maxWidth: "1100px",padding:"0 16px" }}>
                <DataGrid
                    rows={enquireForms}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
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
