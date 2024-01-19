import { createMovieEntry } from '@/utils/MovieServices';
import { useMovieStore } from '@/store/store';
import React, { useState } from 'react';


type Props = {
    isOpen: boolean;
    closeModal: () => void;
};

const CreateMovieModal: React.FC<Props> = ({ isOpen, closeModal }) => {
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [actors, setActors] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [duration, setDuration] = useState('');
    const [plot, setPlot] = useState('');
    const [poster, setPoster] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Convert actors string to array, assuming comma separated
        const actorsArray = actors.split(',').map(actor => actor.trim());

        // Construct the movie object based on your Contentful model
        const movieData = {
            title,
            director,
            actors: actorsArray,
            genre,
            releaseDate: new Date(releaseDate),
            duration: parseFloat(duration), // Ensure this is a number
        };

        try {
            await createMovieEntry(movieData);
            closeModal();
        } catch (error) {
            console.error('Failed to create movie entry:', error);
            // Handle the error accordingly
        }
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Dodaj nowy film</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tytuł</span>
                        </label>
                        <input type="text" className='input input-bordered w-full max-w-xs' placeholder="Tytuł filmu" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Reżyser</span>
                        </label>
                        <input type="text" className='input input-bordered w-full max-w-xs' placeholder="Reżyser" value={director} onChange={(e) => setDirector(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Aktorzy</span>
                        </label>
                        <input type="text" className='input input-bordered w-full max-w-xs' placeholder="Aktorzy" value={actors} onChange={(e) => setActors(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Gatunek</span>
                        </label>
                        <input type="text" className='input input-bordered w-full max-w-xs' placeholder="Gatunek" value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Data premiery</span>
                        </label>
                        <input type="date" className='input input-bordered w-full max-w-xs' placeholder="Data premiery" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Czas trwania</span>
                        </label>
                        <input type="text" className='input input-bordered w-full max-w-xs' placeholder="Czas trwania" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Opis</span>
                        </label>
                        <textarea placeholder="Opis" className='textarea textarea-bordered' value={plot} onChange={(e) => setPlot(e.target.value)} />
                    </div>
                    {/* <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Link do plakatu</span>
                        </label>
                        <input type="text" placeholder="Link do plakatu" value={poster} onChange={(e) => setPoster(e.target.value)} />
                    </div> */}
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">Dodaj</button>
                        <button type="button" className="btn" onClick={closeModal}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMovieModal;