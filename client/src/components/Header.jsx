import React from "react";
import Logo from "../assets/logo_bg.png";

function Header() {
	return (
		<header className="flex justify-between items-center py-2 px-4 bg-gray-900 h-16 text-gray-100">
			{/* Logo */}
			<div className="logo">
				<img
					src={Logo}
					alt="Stack Overflow logo"
                    className="h-12 w-40 p-2"
				/>
			</div>

			{/* Search bar */}
			<div className="flex-1 mx-4">
				<div className="relative">
					<input
						className="block w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 placeholder-gray-500 text-gray-100 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
						type="text"
						placeholder="Search..."
					/>
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg
							className="h-5 w-5 text-gray-500"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M22 22l-6-6" />
							<circle cx="10" cy="10" r="8" />
						</svg>
					</div>
				</div>
			</div>

			{/* Navigation links */}
			<nav className="flex-1">
				<ul className="flex justify-end">
					<li className="mr-4">
						<a className="hover:text-blue-500" href="#">
							Questions
						</a>
					</li>
					<li className="mr-4">
						<a className="hover:text-blue-500" href="#">
							Tags
						</a>
					</li>
					<li>
						<a className="hover:text-blue-500" href="#">
							Users
						</a>
					</li>
				</ul>
			</nav>

			{/* User profile information */}
			<div className="user-profile flex items-center mx-2">
				<img
					className="rounded-full h-8 w-8 mr-2"
					src="https://via.placeholder.com/50x50"
					alt="User profile"
				/>
				<span className="text-gray-300 text-sm font-medium">
					Username
				</span>
			</div>
		</header>
	);
}

export default Header;