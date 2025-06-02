import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import FilmList from './components/FilmList';
import FilmDetails from './components/FilmDetails';
import HamburgerMenu from './components/HamburgerMenu';
import ContactForm from './components/ContactForm';
import Toast from './components/Toast';
import './components/RankingPanel.css';
import axios from 'axios';
import AddFilmPage from './components/AddFilmPage';

function App() {
    const [user, setUser] = useState(null);
    const [films, setFilms] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [view, setView] = useState('films');
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [rankingExpanded, setRankingExpanded] = useState(false);


    useEffect(() => {
        if (user) {
            fetchFilms();
        }
    }, [user]);


    const fetchFilms = () => {
        axios.get('http://localhost:5000/api/films')
            .then(res => setFilms(res.data))
            .catch(() => showToast('Błąd przy pobieraniu aktualnych filmów', 'error'));
    };


    const fetchUsers = () => {
        axios.get('http://localhost:5000/api/users')
            .then(res => setUsers(res.data))
            .catch(() => showToast('Błąd przy pobieraniu naszej bazy użytkowników', 'error'));
    };

    const handleLogout = () => {
        setUser(null);
        setFilms([]);
        setUsers([]);
        setSelectedFilm(null);
        setView('films');
    };

    const handleSelectFilm = (film) => {
        setSelectedFilm(film);
        setView('details');
    };

    const handleBack = () => {
        setSelectedFilm(null);
        setView('films');
    };

    const addFilm = (newFilm) => {
        setFilms(prev => [...prev, newFilm]);
    };

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const openContactForm = () => setView('contact');
    const closeContactForm = () => setView('films');
    const openAdminPanel = () => {
        if (user?.role === 'admin') {
            fetchUsers();
            setView('adminPanel');
        } else {
            showToast('Brak dostępu do panelu administratora', 'error');
        }
    };
    const openAddFilmForm = () => setView('addFilm');

    const updateSelectedFilm = (updatedFilm) => {
        setSelectedFilm(updatedFilm);
        setFilms(prevFilms => prevFilms.map(film =>
            film._id === updatedFilm._id ? updatedFilm : film
        ));
    };



    const topRatedFilms = [...films]
        .filter(film => film.averageRating != null)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 10);

    if (!user) {
        return <AuthForm onLogin={setUser} />;
    }

    const deleteFilm = (id) =>
    {
        if (!window.confirm('Jesteś pewien usuwania filmu z listy?')) return;
        axios.delete(`http://localhost:5000/api/films/${id}`)
            .then(() =>
            {
                setFilms(prev => prev.filter(s => s._id !== id));
                showToast('Film usunięta', 'success');
            })
            .catch(() =>
            {
                showToast('Coś poszło nie tak', 'error');
            });
    };

    return (
        <>
            <div
                style={{
                    marginRight: (view === 'films' && !selectedFilm) ? (rankingExpanded ? '33.33vw' : '250px') : 0,
                    transition: 'margin-right 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 30px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 30 }}>
                        <HamburgerMenu
                            onLogout={handleLogout}
                            isAdmin={user.role === 'admin'}
                            onContactClick={openContactForm}
                            onAdminPanelClick={openAdminPanel}
                        />
                    </div>
                    <h1 className="welcome-header" style={{ flexGrow: 1, textAlign: 'center', margin: 0 }}>
                        {view === 'films' && !selectedFilm ? `Dzień dobry, ${user.username}` : 'Film - Review'}
                    </h1>
                </div>

                {view === 'films' && !selectedFilm && (
                    <>
                        <FilmList films={films} onSelectFilm={handleSelectFilm} />
                        <button
                            onClick={openAddFilmForm}
                            style={{
                                position: 'fixed',
                                bottom: '30px',
                                right: rankingExpanded ? '35vw' : '270px',
                                padding: '12px 20px',
                                borderRadius: '50px',
                                border: 'none',
                                backgroundColor: '#5aee73',
                                color: 'white',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                zIndex: 999,
                            }}
                        >
                            <b>Dodaj swój film</b>
                        </button>
                    </>
                )}

                {view === 'details' && selectedFilm && (
                    <FilmDetails
                        film={selectedFilm}
                        onBack={handleBack}
                        showToast={showToast}
                        user={user}
                        onUpdateFilm={updateSelectedFilm}
                    />
                )}

                {view === 'addFilm' && (
                    <AddFilmPage
                        onAddFilm={addFilm}
                        showToast={showToast}
                        onBack={() => setView('films')}
                    />
                )}

                {view === 'contact' && (
                    <ContactForm
                        onClose={closeContactForm}
                        showToast={showToast}
                    />
                )}

                {view === 'adminPanel' && user.role === 'admin' && (
                    <div style={{
                        padding: 30,
                        maxWidth: 800,
                        margin: '0 auto',
                        backgroundColor: '#f7f7f7',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: '#333',
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}>
                        <h2 style={{color: 'rgba(57,41,7,0.91)', marginBottom: 20, fontWeight: '700'}}>Panel Szefa</h2>


                        <section>
                            <h3 style={{color: '#9c521e', marginBottom: 15}}>Lista dodanych filmów:</h3>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                {films.map(s => (
                                    <li
                                        key={s._id}
                                        style={{
                                            backgroundColor: 'white',
                                            marginBottom: 12,
                                            padding: '12px 15px',
                                            borderRadius: 6,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            color: '#444',
                                        }}
                                    >
                                        <span>{s.title} — {s.artist} — Średnia ocena: {s.averageRating?.toFixed(1) || 'Brak'}</span>
                                        <button
                                            onClick={() => deleteFilm(s._id)}
                                            style={{
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 5,
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                                        >
                                            Usuń
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>


                        <section style={{marginBottom: 40}}>
                            <h3 style={{color: '#ffe22a', marginBottom: 15}}>Użytkownicy:</h3>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                {users.map(u => (
                                    <li
                                        key={u._id}
                                        style={{
                                            backgroundColor: 'white',
                                            marginBottom: 10,
                                            padding: '10px 15px',
                                            borderRadius: 6,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            color: '#444',
                                        }}
                                    >
                                        <span>{u.username} <small
                                            style={{color: '#777', fontWeight: '400'}}>({u.role})</small></span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <button
                            onClick={() => setView('films')}
                            style={{
                                marginTop: 30,
                                padding: '10px 25px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: '#9c521e',
                                color: 'white',
                                fontSize: 16,
                                cursor: 'pointer',
                                fontWeight: '700',
                                boxShadow: '0 4px 10px rgba(90,125,238,0.4)',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#884747'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(238,90,208,0.27)'}
                        >
                            Powrót
                        </button>
                    </div>
                )}

                {toast.visible && (
                    <Toast message={toast.message} type={toast.type} onClose={hideToast}/>
                )}
            </div>

            {view === 'films' && !selectedFilm && (
                <div
                    className={`ranking-panel ${rankingExpanded ? 'expanded' : ''}`}
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        height: '100vh',
                        width: rankingExpanded ? '33.33vw' : '250px',
                        backgroundColor: '#f7f7f7',
                        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                        overflowY: 'auto',
                        transition: 'width 0.3s ease',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        className="ranking-header"
                        onClick={() => setRankingExpanded(!rankingExpanded)}
                        style={{
                            padding: '15px',
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            userSelect: 'none',
                            backgroundColor: 'rgba(66,44,15,0.4)',
                            color: 'white',
                        }}
                    >
                        Ranking
                        <span>{rankingExpanded ? '▲' : '▼'}</span>
                    </div>
                    <div className="ranking-list" style={{ padding: '10px 15px', flexGrow: 1 }}>
                        {topRatedFilms.map((film, index) => (
                            <div
                                key={film._id || film.id}
                                className="ranking-item"
                                style={{
                                    marginBottom: '12px',
                                    paddingBottom: '6px',
                                    borderBottom: '1px solid #ddd',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                <div
                                    className="ranking-title"
                                    style={{ fontWeight: '600', fontSize: '1rem' }}
                                >
                                    {index + 1}. {film.title}
                                </div>
                                {rankingExpanded && (
                                    <div className="ranking-details" style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
                                        <div>Artysta: {film.artist}</div>
                                        <div>Średnia ocen: {film.averageRating?.toFixed(1) || 'Brak'}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
