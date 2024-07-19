import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditFAQDialog from './EditFAQDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';

const FAQ = ({ ServerURL }) => {
    const [FAQs, setFAQs] = useState([]);
    const [selectedFAQ, setSelectedFAQ] = useState(null);
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
        axios.get(`${ServerURL}/api/FAQ/get-all-faqs`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setFAQs(response.data); })
            .catch(error => console.error('Error:', error));
    }, [ServerURL, token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('question', selectedFAQ.question);
        formData.append('answer', selectedFAQ.answer);

        axios.put(`${ServerURL}/api/FAQ/edit-faq/${selectedFAQ.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return axios.get(`${ServerURL}/api/FAQ/get-all-faqs`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setFAQs(response.data);
                setNotification({ text: 'FAQ Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error editing FAQ!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        if (!selectedFAQ.question || !selectedFAQ.answer ) {
            alert('All fields are required for adding a FAQ.');
            return;
        }

        const formData = new FormData();
        formData.append('question', selectedFAQ.question);
        formData.append('answer', selectedFAQ.answer);

        axios.post(`${ServerURL}/api/FAQ/add-faq`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return axios.get(`${ServerURL}/api/FAQ/get-all-faqs`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setFAQs(response.data);
                setNotification({ text: 'FAQ Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error adding FAQ!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };


    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/FAQ/delete-faq/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: 'Item Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setFAQs(FAQs.filter(carousel => carousel.id !== id));
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error deleteing item!', color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };


    const handleEditClick = (FAQ) => {
        setSelectedFAQ(FAQ);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedFAQ(id);
        setIsDeleteDialogOpen(true);
    };


    const handleFieldChange = (e) => {
        setSelectedFAQ({
            ...selectedFAQ,
            [e.target.name]: e.target.value
        });
    };


    const handleAddClick = () => {
        setSelectedFAQ({ question: '', answer: ''});
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>FAQs</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button
                    className='add'
                    onClick={handleAddClick}
                    disabled={FAQs.length >= 10}
                >
                    Add FAQ
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 267 }}>
                    <DataGrid
                        rows={FAQs}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'question', headerName: 'Question', width: 373 },
                            { field: 'answer', headerName: 'Answer', width: 350 },
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
                <EditFAQDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    FAQ={selectedFAQ}
                    onSave={selectedFAQ && selectedFAQ.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                />
                  <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='carousel'
                    Data={selectedFAQ}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedFAQ)}
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

export default FAQ;
