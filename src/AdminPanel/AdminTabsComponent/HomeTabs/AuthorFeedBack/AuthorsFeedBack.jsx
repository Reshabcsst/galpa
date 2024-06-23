import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import EditFeedbackDialog from './EditFeedbackDialog';
import DeleteDialog from '../../DeleteDialog';

const AuthorsFeedback = () => {
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [selectedFeedbackItem, setSelectedFeedbackItem] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData")); // Assuming token is stored in localStorage

    // Notification close handler
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    // Fetching feedback items
    useEffect(() => {
        axios.get('http://localhost:5241/api/AuthorsFeedback/get-authors-feedback', {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
        .then(response => {
            setFeedbackItems(response.data);
        })
        .catch(error => {
            console.error('Error fetching feedback:', error);
        });
    }, []);

    // Delete feedback item
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5241/api/AuthorsFeedback/delete-authors-feedback/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
        .then(response => {
            console.log(response.data);
            setNotification({ text: 'Feedback item deleted successfully', color: 'success' });
            setNotificationOpen(true);
            setFeedbackItems(feedbackItems.filter(item => item.id !== id));
        })
        .catch(error => {
            console.error('Error deleting feedback item:', error);
            setNotification({ text: 'Error deleting feedback item', color: 'error' });
            setNotificationOpen(true);
        });
        setIsDeleteDialogOpen(false);
    };

    // Edit feedback item
    const handleEdit = () => {
        const formData = new FormData();
        formData.append('name', selectedFeedbackItem.name);
        formData.append('quote', selectedFeedbackItem.quote);
        if (selectedFeedbackItem.image) {
            formData.append('image', selectedFeedbackItem.image);
        }

        axios.put(`http://localhost:5241/api/AuthorsFeedback/edit-authors-feedback/${selectedFeedbackItem.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            return axios.get('http://localhost:5241/api/AuthorsFeedback/get-authors-feedback', {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
        })
        .then(response => {
            setFeedbackItems(response.data);
            setNotification({ text: 'Feedback item edited successfully', color: 'success' });
            setNotificationOpen(true);
        })
        .catch(error => {
            console.error('Error editing feedback item:', error);
            setNotification({ text: 'Error editing feedback item', color: 'error' });
            setNotificationOpen(true);
        });

        setIsEditDialogOpen(false);
    };

    // Add feedback item
    const handleAdd = () => {
        const formData = new FormData();
        formData.append('name', selectedFeedbackItem.name);
        formData.append('quote', selectedFeedbackItem.quote);
        formData.append('image', selectedFeedbackItem.image);

        axios.post('http://localhost:5241/api/AuthorsFeedback/add-authors-feedback', formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            return axios.get('http://localhost:5241/api/AuthorsFeedback/get-authors-feedback', {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
        })
        .then(response => {
            setFeedbackItems(response.data);
            setNotification({ text: 'Feedback item added successfully', color: 'success' });
            setNotificationOpen(true);
        })
        .catch(error => {
            console.error('Error adding feedback item:', error);
            setNotification({ text: 'Error adding feedback item', color: 'error' });
            setNotificationOpen(true);
        });

        setIsEditDialogOpen(false);
    };

    // Edit button click handler
    const handleEditClick = (item) => {
        setSelectedFeedbackItem(item);
        setIsEditDialogOpen(true);
    };

    // Delete button click handler
    const handleDeleteClick = (id) => {
        setSelectedFeedbackItem(id);
        setIsDeleteDialogOpen(true);
    };

    // Dialog form field change handler
    const handleFieldChange = (e) => {
        setSelectedFeedbackItem({
            ...selectedFeedbackItem,
            [e.target.name]: e.target.value
        });
    };

    // Dialog file input change handler
    const handleFileChange = (e) => {
        setSelectedFeedbackItem({
            ...selectedFeedbackItem,
            image: e.target.files[0]
        });
    };

    // Add button click handler
    const handleAddClick = () => {
        setSelectedFeedbackItem({ name: '', quote: '', image: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <Box sx={{ height: 'auto', width: '100%', maxWidth: '974px', position: 'relative', padding: '0 16px' }}>
                <button className='add' onClick={handleAddClick}>
                    Add Feedback
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={feedbackItems}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'name', headerName: 'Name', width: 150 },
                            { field: 'quote', headerName: 'Quote', width: 250 },
                            {
                                field: 'image',
                                headerName: 'Image',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`http://localhost:5241${params.row.image}`}
                                        alt={params.row.name}
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
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditFeedbackDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    feedbackItem={selectedFeedbackItem}
                    onSave={selectedFeedbackItem && selectedFeedbackItem.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='Feedback'
                    Data={selectedFeedbackItem}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedFeedbackItem)}
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

export default AuthorsFeedback;
