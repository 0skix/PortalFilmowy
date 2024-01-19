import { createMovieEntry } from "@/utils/MovieServices";
import { useMovieStore } from "@/store/store";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { MovieCard } from "@/types/types";

type Props = {
    isOpen: boolean;
    closeModal: () => void;
};

const CreateMovieModal: React.FC<Props> = ({ isOpen, closeModal }) => {
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [actors, setActors] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [duration, setDuration] = useState("");
    const [plot, setPlot] = useState("");
    const [poster, setPoster] = useState<File | null>(null);
    const { fetchMovies } = useMovieStore((state) => ({
        fetchMovies: state.fetchMovies,
        setMovies: state.setMovies,
    }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Walidacja pól
        if (!title || !director || !actors || !genre || !releaseDate || !duration || !plot || !poster) {
            toast.error("Proszę wypełnić wszystkie pola.");
            return;
        }

        // Kontynuacja, jeśli wszystkie pola są wypełnione
        const actorsArray = actors.split(",").map((actor) => actor.trim());
        const movieData = {
            title,
            director,
            actors: actorsArray,
            genre,
            releaseDate: new Date(releaseDate),
            duration: parseFloat(duration),
            plot,
            poster,
        };

        try {
            await createMovieEntry(movieData);
            toast.success("Film został dodany");
            closeModal();
            fetchMovies();
        } catch (error) {
            console.error("Failed to create movie entry:", error);
            toast.error("Nie udało się dodać filmu.");
        }
    };

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Dodaj nowy film</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tytuł</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Tytuł filmu"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Reżyser</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Reżyser"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Aktorzy</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Aktorzy"
                            value={actors}
                            onChange={(e) => setActors(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Gatunek</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Gatunek"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Data premiery</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Data premiery"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Czas trwania</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Czas trwania"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Opis</span>
                        </label>
                        <textarea
                            placeholder="Opis"
                            className="textarea textarea-bordered"
                            value={plot}
                            onChange={(e) => setPlot(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Link do plakatu</span>
                        </label>
                        <input
                            type="file"
                            className="file-input w-full max-w-xs"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setPoster(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">
                            Dodaj
                        </button>
                        <button type="button" className="btn" onClick={closeModal}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMovieModal;
