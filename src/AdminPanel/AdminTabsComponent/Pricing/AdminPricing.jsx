import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditPricingDialog from './EditPricingDialog';
import Notification from '../../../Components/Home/Components/PopNotification/Notification';

const AdminPricing = ({ ServerURL }) => {
    const [Pricing, setPricing] = useState([]);
    const [selectedPricing, setSelectedPricing] = useState(null);
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

    // Fetching Pricing data
    useEffect(() => {
        axios.get(`${ServerURL}/api/PricingDetails/get-service-details`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setPricing(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('service', selectedPricing.service);
        formData.append('price', selectedPricing.price);
        formData.append('feature1', selectedPricing.feature1);
        formData.append('feature2', selectedPricing.feature2);
        formData.append('feature3', selectedPricing.feature3);
        formData.append('feature4', selectedPricing.feature4);
        formData.append('feature5', selectedPricing.feature5);
        formData.append('details', selectedPricing.details);


        axios.put(`${ServerURL}/api/PricingDetails/edit-service-details/${selectedPricing.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Pricing data after edit
                return axios.get(`${ServerURL}/api/PricingDetails/get-service-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setPricing(response.data);
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
        if (
            !selectedPricing.service ||
            !selectedPricing.price ||
            !selectedPricing.feature1 ||
            !selectedPricing.feature2 ||
            !selectedPricing.feature3 ||
            !selectedPricing.feature4 ||
            !selectedPricing.feature5 ||
            !selectedPricing.details
        ) {
            alert('All fields are required for adding a Pricing details.');
            return;
        }

        const formData = new FormData();
        formData.append('service', selectedPricing.service);
        formData.append('price', selectedPricing.price);
        formData.append('feature1', selectedPricing.feature1);
        formData.append('feature2', selectedPricing.feature2);
        formData.append('feature3', selectedPricing.feature3);
        formData.append('feature4', selectedPricing.feature4);
        formData.append('feature5', selectedPricing.feature5);
        formData.append('details', selectedPricing.details);

        axios.post(`${ServerURL}/api/PricingDetails/add-service-details`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated Pricing data after adding
                return axios.get(`${ServerURL}/api/PricingDetails/get-service-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setPricing(response.data);
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

    const handleEditClick = (Pricing) => {
        setSelectedPricing(Pricing);
        setIsEditDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        console.log(e.target.value);
        setSelectedPricing({
            ...selectedPricing,
            [e.target.name]: e.target.value
        });
    };

    const handleAddClick = () => {
        setSelectedPricing({
            service: '',
            price: '',
            feature1: '',
            feature2: '',
            feature3: '',
            feature4: '',
            feature5: '',
            details: ''
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Pricing Details</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {Pricing.length < 3 && (
                    <button
                        className='add'
                        onClick={handleAddClick}
                        disabled={Pricing.length >= 3}
                    >
                        Add Pricing
                        <AddIcon />
                    </button>
                )}

                <Box sx={{ width: '100%', overflowX: 'auto', height: 267 }}>
                    <DataGrid
                        rows={Pricing}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'service', headerName: 'Service', width: 100 },
                            { field: 'price', headerName: 'Price', width: 50 },
                            { field: 'feature1', headerName: 'Feature 1', width: 100 },
                            { field: 'feature2', headerName: 'Feature 2', width: 100 },
                            { field: 'details', headerName: 'Details', width: 350 },
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
                <EditPricingDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    Pricing={selectedPricing}
                    onSave={selectedPricing && selectedPricing.id ? handleEdit : handleAdd}
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

export default AdminPricing;
