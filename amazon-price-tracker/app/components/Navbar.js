import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex p-4 bg-black text-white justify-between">
      <div className="logo">Amazon Tracker</div>
      <ul className="flex gap-5 justify-between">
        {/* Correct usage of Link component */}
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
