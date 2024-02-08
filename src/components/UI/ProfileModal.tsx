import useUserStore from "@/store/userStore";
import { Category } from "@/types/types";
import supabase from "@/utils/supabaseClient";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProfileModalProps {
    isOpen: boolean;
    closeModal: () => void;
    email: string;
    name: string;
    id: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isOpen,
    closeModal,
    email,
    name,
    id,
}) => {
    const [newEmail, setNewEmail] = useState(email);
    const [newName, setNewName] = useState(name);
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [downloadedCategories, setDownloadedCategories] = useState<Category[]>([]);
    const { categories } = useUserStore.getState();
    const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = parseInt(e.target.value);

        if (selectedCategories.find((cat) => cat.id === categoryId)) {
            toast.info("Ta kategoria została już dodana.");
            return;
        }
        try {
            const response = await fetch('/api/user/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: email,
                    category_id: categoryId,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Kategoria została dodana.');

                // Dodaj nową kategorię do stanu
                const newCategory = downloadedCategories.find(cat => cat.id === categoryId);
                if (newCategory) {
                    setSelectedCategories(prevSelected => [...prevSelected, newCategory]);
                    useUserStore.setState(state => ({
                        categories: [...state.categories, newCategory],
                    }));
                }
            } else {
                console.error(data);
                toast.error(data.error || "Nie udało się dodać kategorii.");
            }
        } catch (error) {
            toast.error('Wystąpił błąd podczas dodawania kategorii.');
            console.error('Error adding category:', error);
        }

        // Resetuj wybraną wartość selecta
        setCurrentCategory("");
    };
    const updateName = async (newName: string) => {
        try {
            const response = await fetch('/api/user/update/name', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    name: newName,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle success
                console.log(data);
                toast.success('Nazwa została zaktualizowana.');
                await signIn('credentials', { redirect: false, ...data });
            } else {
                // Handle errors
                console.error(data);
                toast.error(data.error || "Błąd aktualizacji nazwy..");
            }
            return data;
        } catch (error) {
            toast.error('Nie udało się zaktualizować nazwy..');
            console.error('Error updating name:', error);
            throw error;
        }
    };
    const updateEmail = async (newEmail: string) => {
        try {
            const response = await fetch('/api/user/update/email', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    email: newEmail,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Email został zaktualizowany.');
                await signIn('credentials', { redirect: false, ...data });
            } else {
                console.error(data);
                toast.error(data.error || "Błąd aktualizacji maila..");
            }
            return data;
        } catch (error) {
            toast.error('Nie udało się zaktualizować maila..');
            console.error('Error updating name:', error);
            throw error;
        }
    };
    const removeCategory = async (categoryId: number) => {
        try {
            const response = await fetch('/api/user/category/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category_id: categoryId,
                    user_email: email,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Kategoria została usunięta.');
                // Update global store
                useUserStore.setState((state) => ({
                    categories: state.categories.filter((cat) => cat.id !== categoryId),
                }));
                // Update local component state
                setSelectedCategories((prevSelected) => prevSelected.filter((cat) => cat.id !== categoryId));
            } else {
                console.error(data);
                toast.error(data.error || "Błąd usuwania kategorii..");
            }
            return data;
        } catch (error) {
            toast.error('Nie udało się usunąć kategorii..');
            console.error('Error deleting category:', error);
            throw error;
        }
    };

    const fetchCategories = async () => {
        let { data, error } = await supabase.from("categories").select("id, name");
        if (error) {
            console.error("Error fetching categories:", error);
        } else {
            setDownloadedCategories(data || []);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen && "modal-open"}`} tabIndex={-1}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Profil Użytkownika</h3>
                <div className="py-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nowy email</span>
                        </label>
                        <div className="flex align-middle justify-between">
                            <input
                                type="email"
                                placeholder="Email"
                                className="input input-bordered  w-3/4"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button type="submit" disabled={email === newEmail} onClick={() => { updateEmail(newEmail) }} className="btn btn-primary">
                                Zaktualizuj
                            </button>
                        </div>
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Nowa nazwa</span>
                        </label>
                        <div className="flex align-middle justify-between">
                            <input
                                type="text"
                                placeholder="Nazwa"
                                className="input input-bordered w-3/4"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button type="submit" disabled={name === newName} onClick={() => { updateName(newName) }} className="btn btn-primary">
                                Zaktualizuj
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap gap-2 mt-2">
                        <label className="label">
                            <span className="label-text">
                                Dodaj swoje ulubione kategorie (wybierz minimum 1)
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
                            {downloadedCategories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                    disabled={categories.some((selectedCategory) => selectedCategory.id === category.id)}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <label className="label">
                            <span className="label-text">
                                Twoje kategorie (kliknij, aby usunąć)
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-1">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="btn btn-md"
                                    onClick={() => removeCategory(category.id)}
                                >
                                    {category.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-action">
                        <a className="btn" onClick={closeModal}>
                            Anuluj
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;

