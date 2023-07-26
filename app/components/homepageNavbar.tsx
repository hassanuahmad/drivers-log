"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navigation = [
    { name: "Home", href: "/homepage/home" },
    { name: "Pricing", href: "/homepage/pricing" },
    { name: "About Us", href: "/homepage/about-us" },
];

export default function Example() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10 absolute">
                <div className="mx-auto flex w-full max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-x-6">
                        <button
                            type="button"
                            className="-m-3 p-3 md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                className="h-5 w-5 text-gray-900"
                                aria-hidden="true"
                            />
                        </button>
                        <Link href="/homepage/home">Driver's Log</Link>
                    </div>
                    <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
                        {navigation.map((item, itemIdx) => (
                            <Link key={itemIdx} href={item.href}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-x-8">
                        <SignedIn>
                            <Link
                                className="btn md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700"
                                href="/instructor/dashboard"
                            >
                                Dashboard
                            </Link>
                            {/* Mount the UserButton component */}
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            {/* Signed out users get sign in button */}
                            <SignInButton mode="modal">
                                <button className="btn">Sign in</button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
                <Dialog
                    as="div"
                    className="lg:hidden"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                >
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
                        <div className="-ml-0.5 flex h-16 items-center gap-x-6">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="-ml-0.5">
                                <a href="#" className="-m-1.5 block p-1.5">
                                    <span className="sr-only">
                                        Driver's Log
                                    </span>
                                    <h1>Driver's Log</h1>
                                </a>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>
        </>
    );
}
