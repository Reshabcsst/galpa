import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditBlogPostDialog from './EditBlogPostDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';
import DeleteDialog from '../../DeleteDialog';

const BlogPosts = ({ ServerURL }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedBlogPost, setSelectedBlogPost] = useState(null);
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
        axios.get(`${ServerURL}/api/BlogPost`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setBlogPosts(response.data); })
            .catch(error => console.error('Error:', error));
    }, [token.token]);

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('image', selectedBlogPost.image);
        formData.append('postedBy', selectedBlogPost.postedBy);
        formData.append('authorPic', selectedBlogPost.authorPic);
        formData.append('date', selectedBlogPost.date);
        formData.append('author', selectedBlogPost.author);
        formData.append('bookImg', selectedBlogPost.bookImg);
        formData.append('heading', selectedBlogPost.heading);
        formData.append('details', selectedBlogPost.details);
        formData.append('comments', selectedBlogPost.comments);

        axios.put(`${ServerURL}/api/BlogPost/${selectedBlogPost.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/BlogPost`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setBlogPosts(response.data);
                setNotification({ text: 'Blog Post Edited Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error editing blog post!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        if (!selectedBlogPost.image || !selectedBlogPost.postedBy || !selectedBlogPost.authorPic || !selectedBlogPost.date || !selectedBlogPost.author || !selectedBlogPost.bookImg || !selectedBlogPost.heading || !selectedBlogPost.details || selectedBlogPost.comments == null) {
            alert('All fields are required for adding a blog post.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedBlogPost.image);
        formData.append('postedBy', selectedBlogPost.postedBy);
        formData.append('authorPic', selectedBlogPost.authorPic);
        formData.append('date', selectedBlogPost.date);
        formData.append('author', selectedBlogPost.author);
        formData.append('bookImg', selectedBlogPost.bookImg);
        formData.append('heading', selectedBlogPost.heading);
        formData.append('details', selectedBlogPost.details);
        formData.append('comments', selectedBlogPost.comments);

        axios.post(`${ServerURL}/api/BlogPost`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                return axios.get(`${ServerURL}/api/BlogPost`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setBlogPosts(response.data);
                setNotification({ text: 'Blog Post Added Successfully!', color: 'success' });
                setNotificationOpen(true);
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error adding blog post!', color: 'error' });
                setNotificationOpen(true);
            });

        setIsEditDialogOpen(false);
    };

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/BlogPost/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setNotification({ text: 'Blog Post Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setBlogPosts(blogPosts.filter(post => post.id !== id));
            })
            .catch(error => {
                console.error(error);
                setNotification({ text: 'Error deleting blog post!', color: 'error' });
                setNotificationOpen(true);
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEditClick = (post) => {
        setSelectedBlogPost(post);
        setIsEditDialogOpen(true);
    };
    const handleDeleteClick = (id) => {
        setSelectedBlogPost(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        setSelectedBlogPost({
            ...selectedBlogPost,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedBlogPost({
            ...selectedBlogPost,
            image: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedBlogPost({ image: '', postedBy: '', authorPic: '', date: '', author: '', bookImg: '', heading: '', details: '', comments: '' });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Blog Posts</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button
                    className='add'
                    onClick={handleAddClick}
                >
                    Add Blog Post
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={blogPosts}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 50 },
                            { field: 'heading', headerName: 'Heading', width: 380 },
                            { field: 'author', headerName: 'Author', width: 80 },
                            { field: 'date', headerName: 'Date', width: 123 },
                            {
                                field: 'image',
                                headerName: 'Image',
                                width: 150,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.image}`}
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
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Box>
                <EditBlogPostDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    blogPost={selectedBlogPost}
                    onSave={selectedBlogPost && selectedBlogPost.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='blog post'
                    Data={selectedBlogPost}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedBlogPost)}
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

export default BlogPosts;
