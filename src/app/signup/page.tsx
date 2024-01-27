"use client";
import { Category } from "@/types/types";
import supabase from "../../utils/supabaseClient";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
const SignupPage: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("");

    const [categories, setCategories] = useState<Category[]>([]);

    // Funkcja do pobierania kategorii z Supabase
    const fetchCategories = async () => {
        let { data, error } = await supabase.from("categories").select("id, name");
        if (error) {
            console.error("Error fetching categories:", error);
        } else {
            setCategories(data || []);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;

        const newCategory = categories.find(
            (cat) => cat.id === parseInt(categoryId)
        );

        if (
            newCategory &&
            !selectedCategories.find((cat) => cat.id === newCategory.id)
        ) {
            setSelectedCategories((prevSelected) => [...prevSelected, newCategory]);
        }

        setCurrentCategory("");
    };

    const removeCategory = (categoryIdToRemove: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.filter((cat) => cat.id !== parseInt(categoryIdToRemove))
        );
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = form.email.value;
        const name = form.username.value;

        // Collect the selected category IDs from the form
        // This depends on how you're storing and selecting categories in your state.
        const selectedCategoryIds = selectedCategories.map(cat => cat.id);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, selectedCategories: selectedCategoryIds }),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle success
                console.log(data);
                toast.success("Rejestracja przebiegła pomyślnie");
            } else {
                // Handle errors
                console.error(data);
                toast.error(data.error || "Błąd rejestracji");
            }
        } catch (error) {
            console.error(error);
            toast.error("Błąd logowania");
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Rejestracja</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                className="input input-bordered"
                                required
                            />
                            <label className="label">
                                <span className="label-text">Nazwa użytkownika</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nazwa użytkownika"
                                className="input input-bordered"
                                required
                            />
                            <label className="label">
                                <span className="label-text">
                                    Twoje ulubione kategorie (wybierz minimum 1)
                                </span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={currentCategory}
                                onChange={handleSelect}
                            >
                                <option disabled value="">
                                    Wybierz kategorię
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                        disabled={selectedCategories.includes(category)}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => removeCategory(category.id.toString())}
                                        className="btn btn-xs"
                                    >
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-control mt-6 flex gap-1">
                            <button type="submit" className="btn btn-primary">
                                Zarejestruj się
                            </button>
                            <Link href="/login" className="btn btn-ghost">
                                Zaloguj się
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default SignupPage;
