import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Main.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EditCarouselDialog from './EditCarouselDialog';
import DeleteDialog from '../../DeleteDialog';
import Notification from '../../../../Components/Home/Components/PopNotification/Notification';

const CarouselTable = ({ ServerURL }) => {
    const [carousels, setCarousels] = useState([]);
    const [selectedCarousel, setSelectedCarousel] = useState(null);
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

    // Fetching carousel data
    useEffect(() => {
        axios.get(`${ServerURL}/api/HomeBannerCarousel/get-home-banner-carousel`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => { setCarousels(response.data); })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`${ServerURL}/api/HomeBannerCarousel/delete-home-banner-carousel/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setAdded({ text: 'Item Deleted Successfully!', color: 'success' });
                setNotificationOpen(true);
                setCarousels(carousels.filter(carousel => carousel.id !== id));
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
        formData.append('heading', selectedCarousel.heading);
        formData.append('subheading', selectedCarousel.subheading);
        if (selectedCarousel.backgroundImage) {
            formData.append('backgroundImage', selectedCarousel.backgroundImage);
        }

        axios.put(`${ServerURL}/api/HomeBannerCarousel/edit-home-banner-carousel/${selectedCarousel.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated carousel data after edit
                return axios.get(`${ServerURL}/api/HomeBannerCarousel/get-home-banner-carousel`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCarousels(response.data);
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
        if (!selectedCarousel.heading || !selectedCarousel.subheading || !selectedCarousel.backgroundImage) {
            alert('All fields are required for adding a new carousel.');
            return;
        }

        const formData = new FormData();
        formData.append('heading', selectedCarousel.heading);
        formData.append('subheading', selectedCarousel.subheading);
        if (selectedCarousel.backgroundImage) {
            formData.append('backgroundImage', selectedCarousel.backgroundImage);
        }

        axios.post(`${ServerURL}/api/HomeBannerCarousel/add-home-banner-carousel`, formData, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                // Fetch updated carousel data after adding
                return axios.get(`${ServerURL}/api/HomeBannerCarousel/get-home-banner-carousel`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });
            })
            .then(response => {
                setCarousels(response.data);
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


    const handleEditClick = (carousel) => {
        setSelectedCarousel(carousel);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedCarousel(id);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldChange = (e) => {
        console.log(e.target.value);
        setSelectedCarousel({
            ...selectedCarousel,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedCarousel({
            ...selectedCarousel,
            backgroundImage: e.target.files[0]
        });
    };

    const handleAddClick = () => {
        setSelectedCarousel({ heading: '', subheading: '', backgroundImage: null });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="our_work">
            <h2 className='admin_heading'>Banner Carousel</h2>
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
                            { field: 'heading', headerName: 'Heading', width: 250 },
                            { field: 'subheading', headerName: 'Subheading', width: 250 },
                            {
                                field: 'backgroundImage',
                                headerName: 'Background Image',
                                width: 200,
                                renderCell: (params) => (
                                    <img
                                        src={`${ServerURL}${params.row.backgroundImage}`}
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
                <EditCarouselDialog
                    ServerURL={ServerURL}
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    carousel={selectedCarousel}
                    onSave={selectedCarousel && selectedCarousel.id ? handleEdit : handleAdd}
                    onFieldChange={handleFieldChange}
                    onFileChange={handleFileChange}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    Name='carousel'
                    Data={selectedCarousel}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDelete={() => handleDelete(selectedCarousel)}
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

export default CarouselTable;
