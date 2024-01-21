import Image from "next/image";
import profile from "../../../public/profile.jpg";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import CreateMovieModal from "../CreateMovieModal";
import { useMovieStore } from "@/store/movieStore";


const Navbar = () => {
  const [email, setEmail] = useState("oskyzera@gmail.com");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const filterMovies = useMovieStore((state) => state.filterMovies);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    filterMovies(event.target.value);
  };
  const { data: session } = useSession()
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">Portal Filmowy</a>
      </div>
      <div className="flex-none gap-2">
        <button className="btn" onClick={openModal}>Dodaj</button>
        <ul className="menu menu-horizontal p-0">
          <li><a href="/filmy">Filmy</a></li>
          <li><a href="/seriale">Seriale</a></li>
          <li><a href="/polecane-filmy">Polecane Filmy</a></li>
          <li><a href="/polecane-seriale">Polecane Seriale</a></li>
        </ul>
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            onChange={handleSearch}
          />
        </div>
        {session ? (<div className="dropdown dropdown-end">
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
        </div>) : (<button className="btn btn-ghost"><a href="/login">Zaloguj się</a></button>)}
      </div>
      {isModalOpen && (
        <CreateMovieModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Navbar;
