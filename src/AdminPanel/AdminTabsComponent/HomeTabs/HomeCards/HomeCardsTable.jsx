import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import EditHomeCardsDialog from './EditHomeCardsDialog';

const HomeCardsTable = ({ ServerURL }) => {
    const [homeCards, setHomeCards] = useState(null);
    const [selectedHomeCard, setSelectedHomeCard] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Fetching home cards data
    useEffect(() => {
        axios.get(`${ServerURL}/api/HomeCards/get-home-cards`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setHomeCards(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/HomeCards/delete-home-cards/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setNotification({ text: 'Deleted Successfully!', color: 'success' });
                setHomeCards(null);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setNotification({ text: 'Error deleting item!', color: 'error' });
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        axios.put(`${ServerURL}/api/HomeCards/edit-home-cards/${selectedHomeCard.id}`, selectedHomeCard, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setNotification({ text: 'Item edited successfully!', color: 'success' });
                return axios.get(`${ServerURL}/api/HomeCards/get-home-cards`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setHomeCards(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setNotification({ text: 'Error editing item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        axios.post(`${ServerURL}/api/HomeCards/add-home-cards`, selectedHomeCard, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setNotification({ text: 'Added Successfully!', color: 'success' });
                return axios.get(`${ServerURL}/api/HomeCards/get-home-cards`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setHomeCards(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setNotification({ text: 'Error adding item!', color: 'error' });
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (homeCard) => {
        setSelectedHomeCard(homeCard);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedHomeCard(id);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedHomeCard({
            ...selectedHomeCard,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setSelectedHomeCard({ cardTitle1: '', text1: '', cardTitle2: '', text2: '', cardTitle3: '', text3: '' });
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
            <h2 className='admin_heading'>Home Cards</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                {homeCards == null && 
                <button 
                    className='add' 
                    onClick={handleAddClick} 
                    disabled={homeCards !== null}>
                    Add Home Cards
                    <AddIcon />
                </button>}
                <Box sx={{ width: '100%', overflowX: 'auto', height: 180 }}>
                    <DataGrid
                        rows={homeCards ? [homeCards] : []}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'cardTitle1', headerName: 'Card Title 1', width: 200 },
                            { field: 'text1', headerName: 'Text 1', width: 200 },
                            { field: 'cardTitle2', headerName: 'Card Title 2', width: 200 },
                            { field: 'text2', headerName: 'Text 2', width: 200 },
                            { field: 'cardTitle3', headerName: 'Card Title 3', width: 200 },
                            { field: 'text3', headerName: 'Text 3', width: 200 },
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
                {/* Replace with your EditHomeCardDialog and DeleteDialog components */}
                 <EditHomeCardsDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    card={selectedHomeCard}
                    onSave={selectedHomeCard && selectedHomeCard.id ? handleEdit : handleAdd}
                    onFieldChange={handleInputChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='home-card'
                    Data={selectedHomeCard}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedHomeCard)}
                /> 
            </Box>

            <Notification
                text={notification.text}
                color={notification.color}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default HomeCardsTable;
