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

const AboutDetails = ({ ServerURL }) => {
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
        axios.get(`${ServerURL}/api/AboutDetails/get-about-details`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setDetails(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('title1', selectedDetails.title1);
        formData.append('details1', selectedDetails.details1);
        formData.append('title2', selectedDetails.title2);
        formData.append('details2', selectedDetails.details2);
        formData.append('title3', selectedDetails.title3);
        formData.append('details3', selectedDetails.details3);


        axios.put(`${ServerURL}/api/AboutDetails/edit-about-details/${selectedDetails.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after edit
                return axios.get(`${ServerURL}/api/AboutDetails/get-about-details`, {
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
        if (!selectedDetails.title1 || !selectedDetails.details1 || !selectedDetails.title2 || !selectedDetails.details2 || !selectedDetails.title3 || !selectedDetails.details3) {
            alert('All fields are required for adding a Details.');
            return;
        }

        const formData = new FormData();
        formData.append('title1', selectedDetails.title1);
        formData.append('details1', selectedDetails.details1);
        formData.append('title2', selectedDetails.title2);
        formData.append('details2', selectedDetails.details2);
        formData.append('title3', selectedDetails.title3);
        formData.append('details3', selectedDetails.details3);

        axios.post(`${ServerURL}/api/AboutDetails/add-about-details`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Details data after adding
                return axios.get(`${ServerURL}/api/AboutDetails/get-about-details`, {
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
        setSelectedDetails({
            ...selectedDetails,
            [e.target.name]: e.target.value
        });
    };


    const handleAddClick = () => {
        setSelectedDetails({ title1: '', details1: '', title2: '', details2: '', title3: '', details3: '' });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>About Details</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {Details == null && <button
                    className='add'
                    onClick={handleAddClick}
                    disabled={Details !== null}
                >
                    Add Details
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', height: 180 }}>
                    <DataGrid
                        rows={Details ? [Details] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'title1', headerName: 'Title1', width: 150 },
                            { field: 'details1', headerName: 'Details1', width: 250 },
                            { field: 'title2', headerName: 'Title2', width: 150 },
                            { field: 'details2', headerName: 'Details2', width: 250 },
                            { field: 'title3', headerName: 'Title3', width: 150 },
                            { field: 'details3', headerName: 'Details3', width: 250 },
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

export default AboutDetails;
