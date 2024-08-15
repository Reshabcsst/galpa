import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditCompanyDetailsDialog from './EditCompanyDetailsDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const CompanyDetails = ({ ServerURL }) => {
    const [companyDetails, setCompanyDetails] = useState(null);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [added, setAdded] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Fetching company details data
    useEffect(() => {
        axios.get(`${ServerURL}/api/CompanyDetails/get-company-details`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { 
                setCompanyDetails(response.data); 
                console.log(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/CompanyDetails/delete-company-details/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Deleted Successfully!', color: 'success' });
                console.log(response.data);
                setCompanyDetails(null);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error deleting item!', color: 'error' });
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        axios.put(`${ServerURL}/api/CompanyDetails/edit-company-details/${selectedCompanyDetails.id}`, selectedCompanyDetails, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Item edited successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated company details data after edit
                return axios.get(`${ServerURL}/api/CompanyDetails/get-company-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCompanyDetails(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error editing item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        axios.post(`${ServerURL}/api/CompanyDetails/add-company-details`, selectedCompanyDetails, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Added Successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated company details data after adding
                return axios.get(`${ServerURL}/api/CompanyDetails/get-company-details`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCompanyDetails(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error adding item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (companyDetails) => {
        setSelectedCompanyDetails(companyDetails);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedCompanyDetails(id);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCompanyDetails({
            ...selectedCompanyDetails,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setSelectedCompanyDetails({ companyBio: '', phoneNumber: '', email: '', address: '', facebookLink: '', twitterLink: '', instagramLink: '', linkedInLink: '', youtubeLink: '' });
        setIsEditDialogOpen(true);
    };

    // Notification
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    return (
        <div className="our_work">
              <h2 className='admin_heading'>Company Details</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {companyDetails == null &&<button 
                    className='add' 
                    onClick={handleAddClick} 
                    disabled={companyDetails !== null}
                >
                    Add Company Details
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 180 }}>
                    <DataGrid
                        rows={companyDetails ? [companyDetails] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'companyBio', headerName: 'Company Bio', width: 200 },
                            { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
                            { field: 'email', headerName: 'Email', width: 200 },
                            { field: 'address', headerName: 'Address', width: 200 },
                            { field: 'facebookLink', headerName: 'Facebook', width: 150 },
                            { field: 'twitterLink', headerName: 'Twitter', width: 150 },
                            { field: 'instagramLink', headerName: 'Instagram', width: 150 },
                            { field: 'linkedInLink', headerName: 'LinkedIn', width: 150 },
                            { field: 'youtubeLink', headerName: 'YouTube', width: 150 },
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
                        pageSize={1}
                        rowsPerPageOptions={[1]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditCompanyDetailsDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    companyDetails={selectedCompanyDetails}
                    onSave={selectedCompanyDetails && selectedCompanyDetails.id ? handleEdit : handleAdd}
                    onInputChange={handleInputChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='company-details'
                    Data={selectedCompanyDetails}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedCompanyDetails)}
                />
            </Box>

            <Notification
                text={added.text}
                color={added.color}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default CompanyDetails;
