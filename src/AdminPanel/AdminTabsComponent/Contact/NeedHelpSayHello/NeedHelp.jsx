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

const NeedHelp = ({ ServerURL }) => {
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
        axios.get(`${ServerURL}/api/NeedHelp/get-need-help`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setDetails(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('title', selectedDetails.title);
        formData.append('details1', selectedDetails.details1);
        formData.append('details2', selectedDetails.details2);

        axios.put(`${ServerURL}/api/NeedHelp/edit-need-help/${selectedDetails.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after edit
                return axios.get(`${ServerURL}/api/NeedHelp/get-need-help`, {
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
        if (!selectedDetails.title || !selectedDetails.details1 || !selectedDetails.details2) {
            alert('All fields are required for adding a Details.');
            return;
        }

        const formData = new FormData();
        formData.append('title', selectedDetails.title);
        formData.append('details1', selectedDetails.details1);
        formData.append('details2', selectedDetails.details2);

        axios.post(`${ServerURL}/api/NeedHelp/add-need-help`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after adding
                return axios.get(`${ServerURL}/api/NeedHelp/get-need-help`, {
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

   

    const handleAddClick = () => {
        setSelectedDetails({ title: '', details1: '', details2: '' });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Contact Details</h2>
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
                            { field: 'title', headerName: 'Title', width: 230 },
                            { field: 'details1', headerName: 'details1', width: 253 },
                            { field: 'details2', headerName: 'details2', width: 250 },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                width: 100,
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

export default NeedHelp;
