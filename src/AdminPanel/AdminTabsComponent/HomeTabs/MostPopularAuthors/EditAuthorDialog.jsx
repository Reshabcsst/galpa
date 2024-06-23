import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditAuthorDialog = ({ open, onClose, author, onSave, onFieldChange, onFileChange }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (author && author.profilePicture) {
            if (author.profilePicture instanceof File) {
                const url = URL.createObjectURL(author.profilePicture);
                setPreviewUrl(url);
            } else {
                const url = `http://localhost:5241${author.profilePicture}`;
                setPreviewUrl(url);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [author]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onFileChange(e);
        } else {
            setPreviewUrl(null);
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!author.name) newErrors.name = 'Name is required';
        if (!author.role) newErrors.role = 'Role is required';
        if (!author.profilePicture) newErrors.profilePicture = 'Profile picture is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (author && !author.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{author && author.id ? 'Edit Author' : 'Add Author'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Name'
                            name="name"
                            value={author ? author.name : ''}
                            onChange={onFieldChange}
                            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="role">Role</label>
                        <input
                            type="text"
                            id="role"
                            placeholder='Role'
                            name="role"
                            value={author ? author.role : ''}
                            onChange={onFieldChange}
                            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                        {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}
                    </div>
                    <div>
                        <label htmlFor="facebookLink">Facebook Link</label>
                        <input
                            type="text"
                            id="facebookLink"
                            placeholder='Facebook Link'
                            name="facebookLink"
                            value={author ? author.facebookLink : ''}
                            onChange={onFieldChange}
                            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="instagramLink">Instagram Link</label>
                        <input
                            type="text"
                            id="instagramLink"
                            placeholder='Instagram Link'
                            name="instagramLink"
                            value={author ? author.instagramLink : ''}
                            onChange={onFieldChange}
                            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="twitterLink">Twitter Link</label>
                        <input
                            type="text"
                            id="twitterLink"
                            placeholder='Twitter Link'
                            name="twitterLink"
                            value={author ? author.twitterLink : ''}
                            onChange={onFieldChange}
                            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="profilePicture">Choose image</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    {errors.profilePicture && <p style={{ color: 'red' }}>{errors.profilePicture}</p>}
                </div>
                {previewUrl && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAuthorDialog;
