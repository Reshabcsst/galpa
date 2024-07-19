import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const EditPopularityDialog = ({ open, onClose, Popularity, onSave, onInputChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!Popularity.title1) newErrors.title1 = 'Title1 is required';
        if (!Popularity.count1) newErrors.count1 = 'Count1 is required';
        if (!Popularity.title2) newErrors.title2 = 'Title2 is required';
        if (!Popularity.count2) newErrors.count2 = 'Count2 is required';
        if (!Popularity.title3) newErrors.title3 = 'Title3 is required';
        if (!Popularity.count3) newErrors.count3 = 'Count3 is required';
        if (!Popularity.title4) newErrors.title4 = 'Title4 is required';
        if (!Popularity.count4) newErrors.count4 = 'Count4 is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (Popularity && !Popularity.id && !validateFields()) {
            return;
        }
        onSave();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Popularity && Popularity.id ? 'Edit Popularity Info' : 'Add Popularity Info'}</DialogTitle>
            <DialogContent>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="title1">Title1</label>
                        <input
                            type="text"
                            id="title1"
                            placeholder='Title1'
                            name="title1"
                            value={Popularity ? Popularity.title1 : ''}
                            onChange={onInputChange}
                        />
                        {errors.title1 && <p style={{ color: 'red' }}>{errors.title1}</p>}
                    </div>
                    <div>
                        <label htmlFor="count1">Count1</label>
                        <input
                            type="text"
                            id="count1"
                            placeholder='Count1'
                            name="count1"
                            value={Popularity ? Popularity.count1 : ''}
                            onChange={onInputChange}
                        />
                        {errors.count1 && <p style={{ color: 'red' }}>{errors.count1}</p>}
                    </div>
                    <div>
                        <label htmlFor="title2">Title2</label>
                        <input
                            type="text"
                            id="title2"
                            placeholder='Title2'
                            name="title2"
                            value={Popularity ? Popularity.title2 : ''}
                            onChange={onInputChange}
                        />
                        {errors.title2 && <p style={{ color: 'red' }}>{errors.title2}</p>}
                    </div>
                    <div>
                        <label htmlFor="count2">Count2</label>
                        <input
                            type="text"
                            id="count2"
                            placeholder='Count2'
                            name="count2"
                            value={Popularity ? Popularity.count2 : ''}
                            onChange={onInputChange}
                        />
                        {errors.count2 && <p style={{ color: 'red' }}>{errors.count2}</p>}
                    </div>
                    <div>
                        <label htmlFor="title3">Title3</label>
                        <input
                            type="text"
                            id="title3"
                            placeholder='Title3'
                            name="title3"
                            value={Popularity ? Popularity.title3 : ''}
                            onChange={onInputChange}
                        />
                        {errors.title3 && <p style={{ color: 'red' }}>{errors.title3}</p>}
                    </div>
                    <div>
                        <label htmlFor="count3">Count3</label>
                        <input
                            type="text"
                            id="count3"
                            placeholder='Count3'
                            name="count3"
                            value={Popularity ? Popularity.count3 : ''}
                            onChange={onInputChange}
                        />
                        {errors.count3 && <p style={{ color: 'red' }}>{errors.count3}</p>}
                    </div>
                    <div>
                        <label htmlFor="title4">Title4</label>
                        <input
                            type="text"
                            id="title4"
                            placeholder='Title4'
                            name="title4"
                            value={Popularity ? Popularity.title4 : ''}
                            onChange={onInputChange}
                        />
                        {errors.title4 && <p style={{ color: 'red' }}>{errors.title4}</p>}
                    </div>
                    <div>
                        <label htmlFor="count4">Count4</label>
                        <input
                            type="text"
                            id="count4"
                            placeholder='Count4'
                            name="count4"
                            value={Popularity ? Popularity.count4 : ''}
                            onChange={onInputChange}
                        />
                        {errors.count4 && <p style={{ color: 'red' }}>{errors.count4}</p>}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPopularityDialog;
