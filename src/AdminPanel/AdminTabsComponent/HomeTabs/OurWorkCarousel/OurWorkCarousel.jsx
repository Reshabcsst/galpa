import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditOurWorkCarouselDialog from './EditOurWorkCarouselDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const OurWorkCarouselTable = () => {
    const [carousels, setCarousels] = useState([]);
    const [selectedCarousel, setSelectedCarousel] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [added, setAdded] = useState({ color: '', text: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    // Fetching carousel data
    useEffect(() => {
        axios.get('http://localhost:5241/api/OurWorkCarousel/get-our-work-carousel', {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setCarousels(response.data); console.log(response.data) })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5241/api/OurWorkCarousel/delete-our-work-carousel/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Deleted Successful!', color: 'success' })
                console.log(response.data);
                setCarousels(carousels.filter(carousel => carousel.id !== id));
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error deleting item!', color: 'error' });
            });
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('id', selectedCarousel.id); // Make sure to append the id
        if (selectedCarousel.imagePath instanceof File) {
            formData.append('Image', selectedCarousel.imagePath);
        }

        axios.put(`http://localhost:5241/api/OurWorkCarousel/edit-our-work-carousel/${selectedCarousel.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Item edited successful!', color: 'success' });
                console.log(response.data);
                // Fetch updated carousel data after edit
                return axios.get('http://localhost:5241/api/OurWorkCarousel/get-our-work-carousel', {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCarousels(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error editing item!', color: 'error' })
            });

        setIsEditDialogOpen(false);
    };

    const handleAdd = () => {
        console.log(selectedCarousel.imagePath)
        if (!selectedCarousel.imagePath) {
            alert('Image is required for adding a new carousel.');
            return;
        }

        const formData = new FormData();
        formData.append('Image', selectedCarousel.imagePath);

        axios.post('http://localhost:5241/api/OurWorkCarousel/add-our-work-carousel', formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setNotificationOpen(true);
                setAdded({ text: 'Added Successful!', color: 'success' });
                console.log(response.data);
                // Fetch updated carousel data after adding
                return axios.get('http://localhost:5241/api/OurWorkCarousel/get-our-work-carousel', {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCarousels(response.data);
            })
            .catch(error => {
                console.error(error);
                setNotificationOpen(true);
                setAdded({ text: 'Error adding item!', color: 'error' })
            });

        setIsEditDialogOpen(false);
    };

    const handleEditClick = (carousel) => {
        setSelectedCarousel(carousel);
        console.log(carousel);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedCarousel(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFileChange = (e) => {
        setSelectedCarousel({
            ...selectedCarousel,
            imagePath: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedCarousel({ imagePath: null });
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
             <h2 className='admin_heading'>Our Work Carousel</h2>
            <Box sx={{ height: 'auto', width: '100%', maxWidth: "974px", position: 'relative', padding: '0 16px' }}>
                <button className='add' onClick={handleAddClick}>
                    Add Carousel
                    <AddIcon />
                </button>
                <Box sx={{ width: '100%', overflowX: 'auto', height: 350 }}>
                    <DataGrid
                        rows={carousels}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            {
                                field: 'Image',
                                headerName: 'Image',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`http://localhost:5241${params.row.imagePath}`}
                                        alt="Carousel"
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
                <EditOurWorkCarouselDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    carousel={selectedCarousel}
                    onSave={selectedCarousel && selectedCarousel.id ? handleEdit : handleAdd}
                    onFileChange={handleFileChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='our-work-carousel'
                    Data={selectedCarousel}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedCarousel)}
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

export default OurWorkCarouselTable;
