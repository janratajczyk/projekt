import React, { useState } from 'react';
import './FilmDetails.css';
const ContactForm = ({ onClose, showToast }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !message) {
            showToast('Proszę uzupełnić wszystkie pola', 'error');
            return;
        }



        showToast('Wiadomość wysłana pomyślnie!', 'success');
        setEmail('');
        setMessage('');
        onClose();
    };

    return (
        <div className="film-details">
            <button className="back-button" onClick={onClose}>← Powrót</button>
            <h2>Kontakt</h2>
            <form onSubmit={handleSubmit}>
                <div className="rating">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Twój email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="comment">
                    <label>Wiadomość:</label>
                    <textarea
                        placeholder="Twoja wiadomość"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit" className="save-button">Wyślij</button>
            </form>
        </div>
    );
};

export default ContactForm;