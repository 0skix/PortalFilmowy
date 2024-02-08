"use client";
import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import Link from "next/link";
import useUserStore from "@/store/userStore";


export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const { setCategories } = useUserStore.getState();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Sprawdź, czy użytkownik istnieje
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", email);

        if (userError) {
            toast.error("Błąd logowania");
            return;
        }

        if (userData.length === 0) {
            toast.error("Nie znaleziono użytkownika z tym adresem e-mail");
            return;
        }

        const { data: categoriesData, error: categoriesError } = await supabase
            .from("user_categories")
            .select("user_category")
            .eq("user_email", email);



        if (categoriesError) {
            toast.error("Nie udało się pobrać kategorii użytkownika");
            return;
        }
        const { data: userCategories, error: userCategoriesError } = await supabase
            .from("categories")
            .select("id, name")
            .in("id", categoriesData.map(category => category.user_category));

        if (userCategoriesError) {
            toast.error("Nie udało się pobrać kategorii użytkownika");
            return;
        }


        const res = await signIn("email", { email, callbackUrl: "/", redirect: false });
        if (res?.error) {
            toast.error("Błąd logowania");
        } else {
            setCategories(userCategories);
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
