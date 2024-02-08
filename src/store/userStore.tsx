import { Category } from '@/types/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
    email: string;
    name: string;
    categories: Category[];
    setEmail: (email: string) => void;
    setName: (name: string) => void;
    setCategories: (categories: Category[]) => void; // Change this line
};

const useUserStore = create<State>()(
    persist(
        (set) => ({
            email: '',
            name: '',
            categories: [],
            setEmail: (email) => set({ email }),
            setName: (name) => set({ name }),
            setCategories: (categories) => set({ categories }),
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useUserStore;