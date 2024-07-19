import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditFAQDialog = ({ open, onClose, FAQ, onSave, onFieldChange }) => {
    const [errors, setErrors] = useState({});
  
    const validateFields = () => {
        const newErrors = {};
        if (!FAQ.question) newErrors.question = 'Question is required';
        if (!FAQ.answer) newErrors.answer = 'Answer is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (FAQ && !FAQ.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{FAQ && FAQ.id ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="question">Question</label>
                        <input
                            type="text"
                            id="question"
                            placeholder='Question'
                            name="question"
                            value={FAQ ? FAQ.question : ''}
                            onChange={onFieldChange}
                        />
                        {errors.question && <p style={{ color: 'red' }}>{errors.question}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="answer">Answer</label>
                        <input
                            type="text"
                            id="answer"
                            placeholder='Answer'
                            name="answer"
                            value={FAQ ? FAQ.answer : ''}
                            onChange={onFieldChange}
                        />
                        {errors.answer && <p style={{ color: 'red' }}>{errors.answer}</p>}
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

export default EditFAQDialog;
