import React, { useEffect, useState } from 'react';

interface User {
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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments/getComments?contentId=${contentId}`);
                const data = await response.json();
                if (response.ok) {
                    setComments(data);
                } else {
                    console.error('Błąd podczas pobierania komentarzy:', data.error);
                }
            } catch (error) {
                console.error('Błąd:', error);
            }
        };

        fetchComments();
    }, [contentId]);
    console.log(comments)

    return (
        <div>
            <h3 className="text-lg font-semibold">Komentarze</h3>
            <div className="space-y-4">

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-white rounded-lg shadow">
                            <div className="font-medium text-gray-600">
                                Użytkownik: {comment.user?.name || 'Anonimowy'}
                            </div>
                            <p className="text-gray-600">{comment.comment}</p>
                            <small className="text-gray-500">
                                Data: {new Date(comment.created_at).toLocaleDateString()}
                            </small>
                        </div>
                    ))
                ) : (
                    <p>Brak komentarzy.</p>
                )}
            </div>
        </div>
    );
};

export default CommentsList;