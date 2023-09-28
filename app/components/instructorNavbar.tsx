"use client";
import {Fragment, useState} from "react";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {Bars3Icon, ChevronDownIcon} from "@heroicons/react/20/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import logo from "../static/logo/logo.png";
import {Button} from "@/app/components/ui/button";

const navigation = [
    {name: "Dashboard", href: "/instructor/dashboard"},
    {name: "Lessons", href: "/instructor/lesson"},
    {name: "Students", href: "/instructor/student"},
];

const dropdownNavigation = [
    {name: "Vehicle Maintenance", href: "/instructor/vehicle-maintenance"},
    {name: "Student Progress", href: "/instructor/student-progress"},
    {name: "Yearly Data", href: "/instructor/yearly-data"},
];

function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function InstructorNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
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
                        <Link href="/homepage/home" className="mr-8">
                            <Image src={logo} alt="logo" width={175}/>
                        </Link>
                    </div>
                    <nav
                        className="hidden md:flex items-center md:gap-x-2 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
                        {navigation.map((item, itemIdx) => (
                            <Link key={itemIdx} href={item.href}>
                                <Button variant="ghost">{item.name}</Button>
                            </Link>
                        ))}
                        {/* Dropdown Start */}
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button
                                    className="inline-flex w-full justify-center px-3 py-2 gap-x-1.5 bg-white text-sm rounded-md font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                                    More
                                    <ChevronDownIcon
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {dropdownNavigation.map(
                                            (item, index) => (
                                                <Menu.Item key={index}>
                                                    {({active}) => (
                                                        <Link
                                                            key={index}
                                                            href={item.href}
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700",
                                                                "block text-sm"
                                                            )}
                                                        >
                                                            <Button variant={"ghost"}>{item.name}</Button>
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            )
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        {/* Dropdown End */}
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-x-8">
                        <UserButton afterSignOutUrl="/"/>
                    </div>
                </div>
                <Dialog
                    as="div"
                    className="lg:hidden"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                >
                    <div className="fixed inset-0 z-50"/>
                    <Dialog.Panel
                        className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
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
                            <Link href="/homepage/home" className="-ml-0.5">
                                <Image src={logo} alt="logo" width={175}/>
                            </Link>
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
                            {dropdownNavigation.map((item) => (
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