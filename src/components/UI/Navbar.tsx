import Image from "next/image";
import profile from "../../../public/profile.jpg";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import CreateMovieModal from "../CreateMovieModal";
import { useMovieStore } from "@/store/movieStore";
import { useSeriesStore } from "@/store/seriesStore";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const filterMovies = useMovieStore((state) => state.filterMovies);
  const filterSeries = useSeriesStore((state) => state.filterSeries);

  const pathname = usePathname()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    if (pathname === '/filmy') {
      filterMovies(searchTerm);
    } else if (pathname === '/seriale') {
      filterSeries(searchTerm);
    }
  };
  const { data: session } = useSession();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">
          Portal Filmowy
        </a>
      </div>
      {session === undefined ? (
        <div className="flex-none gap-2">
          <div className="skeleton w-60 h-12"></div>
          <div className="skeleton w-60 h-12"></div>
          <div className="skeleton w-60 h-12"></div>
        </div>
      ) : (
        <div className="flex-none gap-2">
          {session?.user?.role === "admin" && (
            <button className="btn" onClick={openModal}>
              Dodaj
            </button>
          )}
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href="/filmy">Filmy</Link>
            </li>
            <li>
              <Link href="/seriale">Seriale</Link>
            </li>
            {session && (
              <>
                <li>
                  <Link href="/polecane-filmy">Polecane Filmy</Link>
                </li>
                <li>
                  <Link href="/polecane-seriale">Polecane Seriale</Link>
                </li>
              </>
            )}
          </ul>
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              onChange={handleSearch}
            />
          </div>
          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image src={profile} alt="profile" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={() => signOut()}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <button className="btn btn-ghost">
              <Link href="/login">Zaloguj się</Link>
            </button>
          )}
        </div>)}
      {isModalOpen && (
        <CreateMovieModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Navbar;
