import { Category } from '@/types/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
    categories: Category[];
    setCategories: (categories: Category[]) => void; // Change this line
};

const useUserStore = create<State>()(
    persist(
        (set) => ({
            categories: [],
            setCategories: (categories) => set({ categories }),
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useUserStore;