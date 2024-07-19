import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditPopularityDialog from './EditPopularityDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const Popularity = ({ServerURL}) => {
    const [Popularity, setPopularity] = useState(null);
    const [selectedPopularity, setSelectedPopularity] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [added, setAdded] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Fetching data
    useEffect(() => {
        axios.get(`${ServerURL}/api/Popularity/get-popularity-info`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { 
                setPopularity(response.data); 
                console.log(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        axios.put(`${ServerURL}/api/Popularity/edit-popularity-info/${selectedPopularity.id}`, selectedPopularity, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Item edited successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated data after edit
                return axios.get(`${ServerURL}/api/Popularity/get-popularity-info`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setPopularity(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error editing item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        axios.post(`${ServerURL}/api/Popularity/add-popularity-info`, selectedPopularity, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Added Successfully!', color: 'success' });
                console.log(response.data);
                // Fetch updated data after adding
                return axios.get(`${ServerURL}/api/Popularity/get-popularity-info`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setPopularity(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error adding item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (Popularity) => {
        setSelectedPopularity(Popularity);
        setIsEditDialogOpen(true);
    };

   

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPopularity({
            ...selectedPopularity,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setSelectedPopularity({ subheading: '', phoneNumber: '', email: '' });
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
              <h2 className='admin_heading'>Popularity</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {Popularity == null &&<button 
                    className='add' 
                    onClick={handleAddClick} 
                    disabled={Popularity !== null}
                >
                    Add Popularity details
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 170 }}>
                    <DataGrid
                        rows={Popularity ? [Popularity] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'title1', headerName: 'Title1', width: 100 },
                            { field: 'count1', headerName: 'Count1', width: 100 },
                            { field: 'title2', headerName: 'Title2', width: 100 },
                            { field: 'count2', headerName: 'Count2', width: 100 },
                            { field: 'title3', headerName: 'Title3', width: 100 },
                            { field: 'count3', headerName: 'Count3', width: 100 },
                            { field: 'title4', headerName: 'Title4', width: 100 },
                            { field: 'count4', headerName: 'Count4', width: 100 },
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
                <EditPopularityDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    Popularity={selectedPopularity}
                    onSave={selectedPopularity && selectedPopularity.id ? handleEdit : handleAdd}
                    onInputChange={handleInputChange}
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

export default Popularity;
