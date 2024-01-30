import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";


interface User {
    id: string | undefined;
    name: string;
}

interface Comment {
    id: number;
    user_id: string;
    user: User;
    comment: string;
    created_at: string;
}

const CommentsList = ({ contentId }: { contentId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const { data: currentUser } = useSession();
    const [comment, setComment] = useState("");
    const { data: session } = useSession();

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `/api/comments/getComments?contentId=${contentId}`
            );
            const data = await response.json();
            if (response.ok) {
                setComments(data);
            } else {
                console.error("Błąd podczas pobierania komentarzy:", data.error);
            }
        } catch (error) {
            console.error("Błąd:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!session) {
            console.error("Musisz być zalogowany, aby dodać komentarz.");
            return;
        }

        const userId = session.user?.id; // Pobieranie ID użytkownika z sesji
        if (!userId) {
            console.error("Błąd: Brak ID użytkownika.");
            return;
        }

        // Przygotowanie danych do wysłania
        const commentData = {
            content_id: contentId,
            user_id: userId,
            comment: comment,
        };

        // Wysyłanie danych do API
        try {
            const response = await fetch("/api/comments/addComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commentData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Komentarz dodany:", result);
                setComment(""); // Wyczyszczenie formularza po sukcesie
                fetchComments();
            } else {
                console.error("Błąd przy dodawaniu komentarza:", result.error);
            }
        } catch (error) {
            console.error("Błąd przy wysyłaniu komentarza:", error);
        }
    };

    const deleteComment = async (commentId: number) => {
        const response = await fetch(`/api/comments/deleteComment`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId,
                userId: currentUser?.user?.id,
                isAdmin: currentUser?.user?.role === "admin",
            }),
        });

        if (response.ok) {
            setComments(comments.filter((comment) => comment.id !== commentId));
        } else {
            console.error("Błąd podczas usuwania komentarza");
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div>
            <h3 className="text-lg font-semibold">Komentarze</h3>
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-4 bg-white rounded-lg shadow-md mb-4"
                        >
                            <div className="flex justify-between gap-4 items-center">
                                <div>
                                    <div className="font-medium text-gray-700">
                                        {comment.user?.name || "Anonimowy"}
                                    </div>
                                    <p className="text-gray-600">{comment.comment}</p>
                                </div>
                                {(currentUser?.user?.id === comment.user.id ||
                                    currentUser?.user?.role === "admin") && (
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => deleteComment(comment.id)}
                                        >
                                            Usuń
                                        </button>
                                    )}
                            </div>
                            <small className="text-gray-500">
                                Data: {new Date(comment.created_at).toLocaleDateString()}
                            </small>
                        </div>
                    ))
                ) : (
                    <p>Brak komentarzy.</p>
                )}
                {currentUser && (
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
                )}
            </div>
        </div>
    );
};

export default CommentsList;
