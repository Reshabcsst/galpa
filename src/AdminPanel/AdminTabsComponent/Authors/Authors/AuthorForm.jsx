import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';
import EditAuthorDialog from './EditAuthorDialog';

const AuthorForm = ({ ServerURL }) => {
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = () => {
        axios.get(`${ServerURL}/api/Authors`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setAuthors(response.data);
            })
            .catch(error => {
                console.error('Error fetching authors:', error);
            });
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('Name', selectedAuthor.name);
        formData.append('Details', selectedAuthor.details);
        if (selectedAuthor.profilePic instanceof File) {
            formData.append('ProfilePic', selectedAuthor.profilePic);
        }
        selectedAuthor.books.forEach((book, index) => {
            formData.append(`Books[${index}].BookName`, book.bookName);
            if (book.bookImage instanceof File) {
                formData.append(`Books[${index}].BookImage`, book.bookImage);
            }
        });

        axios.put(`${ServerURL}/api/Authors/${selectedAuthor.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Author edited successfully:', response.data);
                fetchAuthors();
                setNotification({ text: 'Author Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error editing author:', error);
                setNotification({ text: 'Error editing author!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        const formData = new FormData();
        formData.append('Name', selectedAuthor.name);
        formData.append('Details', selectedAuthor.details);
        if (selectedAuthor.profilePic instanceof File) {
            formData.append('ProfilePic', selectedAuthor.profilePic);
        }
        selectedAuthor.books.forEach((book, index) => {
            formData.append(`Books[${index}].BookName`, book.bookName);
            if (book.bookImage instanceof File) {
                formData.append(`Books[${index}].BookImage`, book.bookImage);
            }
        });

        axios.post(`${ServerURL}/api/Authors`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Author added successfully:', response.data);
                fetchAuthors();
                setNotification({ text: 'Author Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error adding author:', error);
                setNotification({ text: 'Error adding author!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/Authors/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log('Author deleted successfully:', response.data);
                fetchAuthors();
                setNotification({ text: 'Author Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error('Error deleting author:', error);
                setNotification({ text: 'Error deleting author!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsDeleteDialogOpen(false);
    };

    const handleEditClick = (author) => {
        setSelectedAuthor(author);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedAuthor(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setSelectedAuthor(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setSelectedAuthor(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleBookChange = (index, e) => {
        const { name, value, files } = e.target;
        const books = [...selectedAuthor.books];
        books[index][name] = files ? files[0] : value;
        setSelectedAuthor(prev => ({ ...prev, books }));
    };

    const handleAddBook = () => {
        setSelectedAuthor(prev => ({
            ...prev,
            books: [...prev.books, { bookName: '', bookImage: null }]
        }));
    };

    const handleAddClick = () => {
        setSelectedAuthor({
            name: '',
            details: '',
            profilePic: null,
            books: [{ bookName: '', bookImage: null }]
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Authors</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button className='add' onClick={handleAddClick}>
                    Add Author
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={authors}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'name', headerName: 'Name', width: 170 },
                            { field: 'details', headerName: 'Details', width: 350 },
                            {
                                field: 'profilePic',
                                headerName: 'Profile Picture',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.profilePic}`}
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
                <EditAuthorDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    author={selectedAuthor}
                    ServerURL={ServerURL}
                    onSave={selectedAuthor && selectedAuthor.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                    onBookChange={handleBookChange}
                    onAddBook={handleAddBook}
                />
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='author'
                    Data={selectedAuthor}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedAuthor)}
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

export default AuthorForm;
