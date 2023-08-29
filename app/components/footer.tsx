"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <>
            <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
                <footer
                    aria-labelledby="footer-heading"
                    className="relative border-t border-gray-900/10 py-24 sm:mt-56 sm:py-32 flex flex-col text-base justify-center gap-y-8 text-gray-600"
                >
                    <div className="flex justify-center gap-8">
                        <Link href="/homepage/home">Home</Link>
                        <Link href="/homepage/pricing">Pricing</Link>
                        <Link href="/homepage/about-us">About Us</Link>
                    </div>
                    <div className="flex justify-center text-sm">
                        © 2023 Drivers Log, All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
