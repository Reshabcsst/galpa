import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditBannerDialog from './EditBannerDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const PartnerBanner = ({ ServerURL }) => {
    const [Banner, setBanner] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
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

    // Fetching Banner data
    useEffect(() => {
        axios.get(`${ServerURL}/api/PartnerBanner/get-partner-banner`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setBanner(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('heading', selectedBanner.heading);
        formData.append('subheading', selectedBanner.subheading);
        if (selectedBanner.backgroundImage) {
            formData.append('backgroundImage', selectedBanner.backgroundImage);
        }

        axios.put(`${ServerURL}/api/PartnerBanner/edit-partner-banner/${selectedBanner.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Banner data after edit
                return axios.get(`${ServerURL}/api/PartnerBanner/get-partner-banner`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setBanner(response.data);
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
        if (!selectedBanner.heading || !selectedBanner.subheading || !selectedBanner.backgroundImage) {
            alert('All fields are required for adding a Banner.');
            return;
        }

        const formData = new FormData();
        formData.append('heading', selectedBanner.heading);
        formData.append('subheading', selectedBanner.subheading);
        formData.append('backgroundImage', selectedBanner.backgroundImage);

        axios.post(`${ServerURL}/api/PartnerBanner/add-partner-banner`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Banner data after adding
                return axios.get(`${ServerURL}/api/PartnerBanner/get-partner-banner`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setBanner(response.data);
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

    const handleEditClick = (Banner) => {
        setSelectedBanner(Banner);
        setIsEditDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        console.log(e.target.value);
        setSelectedBanner({
            ...selectedBanner,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedBanner({
            ...selectedBanner,
            backgroundImage: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedBanner({ heading: '', subheading: '', backgroundImage: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Partner Banner</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {Banner == null && <button
                    className='add'
                    onClick={handleAddClick}
                    disabled={Banner !== null}
                >
                    Add Banner
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 163 }}>
                    <DataGrid
                        rows={Banner ? [Banner] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'heading', headerName: 'Heading', width: 250 },
                            { field: 'subheading', headerName: 'Subheading', width: 250 },
                            {
                                field: 'backgroundImage',
                                headerName: 'Background Image',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.backgroundImage}`}
                                        alt={params.row.heading}
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
                <EditBannerDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    Banner={selectedBanner}
                    onSave={selectedBanner && selectedBanner.id ? handleEdit : handleAdd}
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

export default PartnerBanner;
