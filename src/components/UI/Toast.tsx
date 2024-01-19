import React from 'react';

type ToastProps = {
    messages: { id: number; type: 'info' | 'success'; text: string }[];
    removeToast: (id: number) => void;
};

const Toast: React.FC<ToastProps> = ({ messages, removeToast }) => {
    return (
        <div className="toast toast-left toast-end">
            {messages.map((message) => (
                <div key={message.id} className={`alert alert-${message.type}`}>
                    <span>{message.text}</span>
                    <button className="btn btn-sm btn-ghost absolute" onClick={() => removeToast(message.id)}>
                        x
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;