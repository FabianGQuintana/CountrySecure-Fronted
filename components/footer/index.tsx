"use client";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-900 text-white text-center">
      <div className="container mx-auto px-4">
        <p className="text-gray-300">
          &copy; {new Date().getFullYear()} CountryClub.
        </p>
      </div>
    </footer>
  );
}
