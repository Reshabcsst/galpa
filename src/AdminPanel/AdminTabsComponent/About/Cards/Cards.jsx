import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCardDialog from './EditCardDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';

const Cards = ({ ServerURL }) => {
    const [Cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ color: '', text: '' });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    useEffect(() => {
        axios.get(`${ServerURL}/api/WhatSetUsApart/get-all-items`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setCards(response.data); })
            .catch(error => console.error('Error:', error));
    }, [ServerURL, token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('heading', selectedCard.heading);
        formData.append('details', selectedCard.details);
        if (selectedCard.cardPic) {
            formData.append('cardPic', selectedCard.cardPic);
        }

        axios.put(`${ServerURL}/api/WhatSetUsApart/edit-item/${selectedCard.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return axios.get(`${ServerURL}/api/WhatSetUsApart/get-all-items`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCards(response.data);
                setNotification({ text: 'Card Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error editing Card!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        if (!selectedCard.heading || !selectedCard.details || !selectedCard.cardPic) {
            alert('All fields are required for adding a Card.');
            return;
        }

        const formData = new FormData();
        formData.append('heading', selectedCard.heading);
        formData.append('details', selectedCard.details);
        formData.append('cardPic', selectedCard.cardPic);

        axios.post(`${ServerURL}/api/WhatSetUsApart/add-item`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return axios.get(`${ServerURL}/api/WhatSetUsApart/get-all-items`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCards(response.data);
                setNotification({ text: 'Card Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error adding Card!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };


    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/WhatSetUsApart/delete-item/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: 'Item Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setCards(Cards.filter(carousel => carousel.id !== id));
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error deleteing item!', color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };


    const handleEditClick = (Card) => {
        setSelectedCard(Card);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedCard(id);
        setIsDeleteDialogOpen(true);
    };


    const handleFieldChange = (e) => {
        setSelectedCard({
            ...selectedCard,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedCard({
            ...selectedCard,
            cardPic: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedCard({ heading: '', details: '', cardPic: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Cards</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button
                    className='add'
                    onClick={handleAddClick}
                    disabled={Cards.length >= 3}
                >
                    Add Card
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 267 }}>
                    <DataGrid
                        rows={Cards}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'heading', headerName: 'Heading', width: 250 },
                            { field: 'details', headerName: 'Details', width: 250 },
                            {
                                field: 'cardPic',
                                headerName: 'Card Pic',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.cardPic}`}
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
                <EditCardDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    Card={selectedCard}
                    onSave={selectedCard && selectedCard.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />
                  <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='carousel'
                    Data={selectedCard}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedCard)}
                />
                <Notification
                    text={notification.text}
                    color={notification.color}
                    open={notificationOpen}
                    handleClose={handleNotificationClose}
                />
            </Box>
        </div>
    );
};

export default Cards;
