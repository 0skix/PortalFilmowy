"use client";
import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import Link from "next/link";


export default function LoginComponent() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const { data, error } = await supabase
            .from("users")
            .select("email")
            .eq("email", email);

        if (error) {
            toast.error("Błąd logowania");
            return;
        }
        console.log(data)

        if (data.length === 0) {
            toast.error("Nie znaleziono użytkownika z tym adresem e-mail");
            return;
        }

        // If user exists, proceed to sign in
        const res = await signIn("email", { email, redirect: false });
        if (res?.error) {
            // Handle error
            toast.error("Błąd logowania");
        } else {
            // Handle successful login
            toast.success("Mail wysłany! Sprawdź swoją skrzynkę pocztową");
        }
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
                        <div className="form-control mt-6 flex gap-1" >
                            <button type="submit" className="btn btn-primary">
                                Zaloguj się
                            </button>
                            <Link href="/signup" className="btn btn-ghost"> Zarejestruj się</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
