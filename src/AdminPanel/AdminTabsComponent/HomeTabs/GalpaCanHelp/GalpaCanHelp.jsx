import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditCompanyInfoDialog from './EditCompanyInfoDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const GalpaCanHelp = ({ServerURL}) => {
    const [companyInfo, setCompanyInfo] = useState(null);
    const [selectedCompanyInfo, setSelectedCompanyInfo] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [added, setAdded] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Fetching company info data
    useEffect(() => {
        axios.get(`${ServerURL}/api/GalpaCanHelp/get-company-info`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { 
                setCompanyInfo(response.data); 
                console.log(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/GalpaCanHelp/delete-company-info/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Deleted Successfully!', color: 'success' });
                console.log(response.data);
                setCompanyInfo(null);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error deleting item!', color: 'error' });
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        axios.put(`${ServerURL}/api/GalpaCanHelp/edit-company-info/${selectedCompanyInfo.id}`, selectedCompanyInfo, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Item edited successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated company info data after edit
                return axios.get(`${ServerURL}/api/GalpaCanHelp/get-company-info`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCompanyInfo(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error editing item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        axios.post(`${ServerURL}/api/GalpaCanHelp/add-company-info`, selectedCompanyInfo, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Added Successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated company info data after adding
                return axios.get(`${ServerURL}/api/GalpaCanHelp/get-company-info`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCompanyInfo(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error adding item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (companyInfo) => {
        setSelectedCompanyInfo(companyInfo);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedCompanyInfo(id);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCompanyInfo({
            ...selectedCompanyInfo,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setSelectedCompanyInfo({ subheading: '', phoneNumber: '', email: '' });
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
              <h2 className='admin_heading'>Galpa Can Help</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {companyInfo == null &&<button 
                    className='add' 
                    onClick={handleAddClick} 
                    disabled={companyInfo !== null}
                >
                    Add Company Info
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 163 }}>
                    <DataGrid
                        rows={companyInfo ? [companyInfo] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'subheading', headerName: 'Subheading', width: 390 },
                            { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
                            { field: 'email', headerName: 'Email', width: 200 },
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
                <EditCompanyInfoDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    companyInfo={selectedCompanyInfo}
                    onSave={selectedCompanyInfo && selectedCompanyInfo.id ? handleEdit : handleAdd}
                    onInputChange={handleInputChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='company-info'
                    Data={selectedCompanyInfo}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedCompanyInfo)}
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

export default GalpaCanHelp;
