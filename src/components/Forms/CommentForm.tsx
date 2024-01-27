import { useSession } from "next-auth/react";
import { useState } from "react";

const CommentForm = ({ contentId }: { contentId: string }) => {
    const [comment, setComment] = useState('');
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!session) {
            console.error('Musisz być zalogowany, aby dodać komentarz.');
            return;
        }

        const userId = session.user?.id; // Pobieranie ID użytkownika z sesji
        if (!userId) {
            console.error('Błąd: Brak ID użytkownika.');
            return;
        }

        // Przygotowanie danych do wysłania
        const commentData = {
            content_id: contentId,
            user_id: userId,
            comment: comment
        };

        // Wysyłanie danych do API
        try {
            const response = await fetch('/api/comments/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Komentarz dodany:', result);
                setComment(''); // Wyczyszczenie formularza po sukcesie
            } else {
                console.error('Błąd przy dodawaniu komentarza:', result.error);
            }
        } catch (error) {
            console.error('Błąd przy wysyłaniu komentarza:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-control">
            <label className="label">
                <span className="label-text">Twój komentarz</span>
            </label>
            <textarea
                className="textarea textarea-bordered"
                placeholder="Napisz komentarz..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button type="submit" className="btn btn-primary mt-4">
                Dodaj Komentarz
            </button>
        </form>
    );
};

export default CommentForm;