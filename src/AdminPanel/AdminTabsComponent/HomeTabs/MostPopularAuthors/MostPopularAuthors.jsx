import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditAuthorDialog from './EditAuthorDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const MostPopularAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

    // Fetching authors data
    useEffect(() => {
        axios.get('http://localhost:5241/api/MostPopularAuthors/get-authors', {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setAuthors(response.data); })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5241/api/MostPopularAuthors/delete-author/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setAdded({ text: 'Item Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setAuthors(authors.filter(author => author.id !== id));
            })
            .catch(error => {
                 console.error(error);
                 setAdded({ text: 'Error deleteing item!', color: 'error' });
                 setNotificationOpen(true);
             });
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('name', selectedAuthor.name);
        formData.append('role', selectedAuthor.role);
        if (selectedAuthor.profilePicture) {
            formData.append('profilePicture', selectedAuthor.profilePicture);
        }
        formData.append('facebookLink', selectedAuthor.facebookLink);
        formData.append('instagramLink', selectedAuthor.instagramLink);
        formData.append('twitterLink', selectedAuthor.twitterLink);

        axios.put(`http://localhost:5241/api/MostPopularAuthors/edit-author/${selectedAuthor.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated authors data after edit
                return axios.get('http://localhost:5241/api/MostPopularAuthors/get-authors', {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setAuthors(response.data);
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
        if (!selectedAuthor.name || !selectedAuthor.role || !selectedAuthor.profilePicture) {
            alert('All fields are required for adding a new author.');
            return;
        }

        const formData = new FormData();
        formData.append('name', selectedAuthor.name);
        formData.append('role', selectedAuthor.role);
        formData.append('profilePicture', selectedAuthor.profilePicture);
        formData.append('facebookLink', selectedAuthor.facebookLink);
        formData.append('instagramLink', selectedAuthor.instagramLink);
        formData.append('twitterLink', selectedAuthor.twitterLink);

        axios.post('http://localhost:5241/api/MostPopularAuthors/add-author', formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated authors data after adding
                return axios.get('http://localhost:5241/api/MostPopularAuthors/get-authors', {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setAuthors(response.data);
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

    const handleEditClick = (author) => {
        setSelectedAuthor(author);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedAuthor(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        console.log(e.target.value);
        setSelectedAuthor({
            ...selectedAuthor,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedAuthor({
            ...selectedAuthor,
            profilePicture: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedAuthor({ name: '', role: '', profilePicture: null, facebookLink: '', instagramLink: '', twitterLink: '' });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
              <h2 className='admin_heading'>Most Popular Authors</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button className='add' onClick={handleAddClick}>
                    Add Author
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={authors}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            { field: 'name', headerName: 'Name', width: 150 },
                            { field: 'role', headerName: 'Role', width: 100 },
                            {
                                field: 'profilePicture',
                                headerName: 'Profile Picture',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`http://localhost:5241${params.row.profilePicture}`}
                                        alt={params.row.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )
                            },
                            {
                                field: 'facebookLink',
                                headerName: 'Facebook',
                                width: 200
                            },
                            {
                                field: 'instagramLink',
                                headerName: 'Instagram',
                                width: 200
                            },
                            {
                                field: 'twitterLink',
                                headerName: 'Twitter',
                                width: 200
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
                    onSave={selectedAuthor && selectedAuthor.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='author'
                    Data={selectedAuthor}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedAuthor)}
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

export default MostPopularAuthors;
