import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditDetailsDialog from './EditDetailsDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const ContactGalpa = ({ ServerURL }) => {
    const [Details, setDetails] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [added, setAdded] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Notification
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    // Fetching Details data
    useEffect(() => {
        axios.get(`${ServerURL}/api/ContactGalpa/get-contact-details`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setDetails(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('ourLocation', selectedDetails.ourLocation);
        formData.append('number1', selectedDetails.number1);
        formData.append('number2', selectedDetails.number2);
        formData.append('opensAt', selectedDetails.opensAt);
        formData.append('closeAt', selectedDetails.closeAt);
    
        axios.put(`${ServerURL}/api/ContactGalpa/edit-contact-details/${selectedDetails.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after edit
                return axios.get(`${ServerURL}/api/ContactGalpa/get-contact-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setDetails(response.data);
                setAdded({ text: 'Item Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setAdded({ text: 'Error editing item!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        if (!selectedDetails.ourLocation || !selectedDetails.number1 || !selectedDetails.number2 || !selectedDetails.opensAt || !selectedDetails.closeAt) {
            alert('All fields are required for adding a Details.');
            return;
        }

        const formData = new FormData();
        formData.append('ourLocation', selectedDetails.ourLocation);
        formData.append('number1', selectedDetails.number1);
        formData.append('number2', selectedDetails.number2);
        formData.append('opensAt', selectedDetails.opensAt);
        formData.append('closeAt', selectedDetails.closeAt);

        axios.post(`${ServerURL}/api/ContactGalpa/add-contact-details`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after adding
                return axios.get(`${ServerURL}/api/ContactGalpa/get-contact-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setDetails(response.data);
                setAdded({ text: 'Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setAdded({ text: 'Error adding item!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (Details) => {
        setSelectedDetails(Details);
        setIsEditDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        console.log(e.target.value);
        setSelectedDetails({
            ...selectedDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedDetails({
            ...selectedDetails,
            backgroundImage: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedDetails({ ourLocation: '', number1: '', number2: '', opensAt: '', closeAt: '' });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Contact To Galpa Details</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {Details == null && <button
                    className='add'
                    onClick={handleAddClick}
                    disabled={Details !== null}
                >
                    Add Details
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 163 }}>
                    <DataGrid
                        rows={Details ? [Details] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'ourLocation', headerName: 'Our Location', width: 243 },
                            { field: 'number1', headerName: 'Phone Number 1', width: 150 },
                            { field: 'number2', headerName: 'Phone Number 2', width: 150 },
                            { field: 'opensAt', headerName: 'Opens At', width: 100 },
                            { field: 'closeAt', headerName: 'Close At', width: 100 },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                width: 90,
                                renderCell: (params) => (
                                    <div>
                                        <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
                                            <EditIcon />
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
                <EditDetailsDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    Details={selectedDetails}
                    onSave={selectedDetails && selectedDetails.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />
                <Notification
                    text={added.text}
                    color={added.color}
                    open={notificationOpen}
                    handleClose={handleNotificationClose}
                />
            </Box>
        </div>
    );
};

export default ContactGalpa;
