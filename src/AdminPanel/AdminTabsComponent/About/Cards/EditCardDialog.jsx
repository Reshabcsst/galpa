import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditCardDialog = ({ open, onClose, Card, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (Card && Card.cardPic) {
            if (Card.cardPic instanceof File) {
                const url = URL.createObjectURL(Card.cardPic);
                setPreviewUrl(url);
            } else {
                const url = `${ServerURL}${Card.cardPic}`;
                setPreviewUrl(url);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [Card, ServerURL]);

    const handleCardPicChange = (e) => {
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
        if (!Card.heading) newErrors.heading = 'Heading is required';
        if (!Card.details) newErrors.details = 'Details is required';
        if (!Card.cardPic) newErrors.cardPic = 'Card Pic is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (Card && !Card.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Card && Card.id ? 'Edit Card' : 'Add Card'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="heading">Heading</label>
                        <input
                            type="text"
                            id="heading"
                            placeholder='Heading'
                            name="heading"
                            value={Card ? Card.heading : ''}
                            onChange={onFieldChange}
                        />
                        {errors.heading && <p style={{ color: 'red' }}>{errors.heading}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details">Details</label>
                        <input
                            type="text"
                            id="details"
                            placeholder='Details'
                            name="details"
                            value={Card ? Card.details : ''}
                            onChange={onFieldChange}
                        />
                        {errors.details && <p style={{ color: 'red' }}>{errors.details}</p>}
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="cardPic">Choose Card Pic</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="cardPic"
                            name="cardPic"
                            type="file"
                            onChange={handleCardPicChange}
                        />
                    </div>
                    {errors.cardPic && <p style={{ color: 'red' }}>{errors.cardPic}</p>}
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

export default EditCardDialog;
