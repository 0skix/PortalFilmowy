'use client'
import React, { FormEvent, useState } from 'react';

export default function LoginComponent() {
    const [email, setEmail] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // Obsługa logowania
        console.log("Logowanie z:", email);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">


            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Logowanie</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Zaloguj się</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}