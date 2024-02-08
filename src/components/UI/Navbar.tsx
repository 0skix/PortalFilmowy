import Image from "next/image";
import profile from "../../../public/profile.jpg";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import CreateMovieModal from "../CreateMovieModal";
import ProfileModal from "./ProfileModal";
import Link from "next/link";
import { useMovieStore } from "@/store/movieStore";
import { useSeriesStore } from "@/store/seriesStore";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const filterMovies = useMovieStore((state) => state.filterMovies);
  const filterSeries = useSeriesStore((state) => state.filterSeries);

  const pathname = usePathname();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    if (pathname === "/filmy") {
      filterMovies(searchTerm);
    } else if (pathname === "/seriale") {
      filterSeries(searchTerm);
    } else if (pathname === "/polecane-filmy") {
      filterMovies(searchTerm);
    } else if (pathname === "/polecane-seriale") {
      filterSeries(searchTerm);
    }
  };
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4.5a.5.5 0 01.5-.5h13a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h13a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h13a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
          >
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
        </div>

        <Link className="btn btn-ghost normal-case text-xl hidden lg:flex" href="/">FilmPortal</Link>

      </div>

      <div className="navbar-end">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered  md:w-auto mr-1"
          onChange={handleSearch}
        />
        <div className="navbar-center hidden lg:flex">
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
        </div>
        {session ? (
          <>
            {session?.user?.role === "admin" && (
              <button className="btn" onClick={openModal}>
                Dodaj
              </button>
            )}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image src={profile} alt="profile" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact z-50 dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a onClick={openProfileModal}>Profil</a>
                </li>
                <li>
                  <a>Ustawienia</a>
                </li>
                <li>
                  <a onClick={() => signOut()}>Wyloguj</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login">
            <button className="btn">Zaloguj się</button>
          </Link>
        )}
      </div>
      {isModalOpen && session?.user?.role === "admin" && (
        <CreateMovieModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          closeModal={closeProfileModal}
          email={session?.user?.email || ""}
          name={session?.user?.name || ""}
          id={session?.user?.id || ""}
        />
      )}
    </div>
  );
};

export default Navbar;
