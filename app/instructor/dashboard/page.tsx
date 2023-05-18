"use client";
import { PlusSmallIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@clerk/nextjs";

const secondaryNavigation = [
    { name: "Last 7 days", href: "#", current: true },
    { name: "Last 30 days", href: "#", current: false },
    { name: "All-time", href: "#", current: false },
];

export default function Dashboard() {
    const { userId } = useAuth();
    // console.log(userId);

    return (
        <main>
            <div className="relative isolate overflow-hidden">
                {/* Secondary navigation */}
                <header className="pb-4 pt-6 sm:pb-6">
                    <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
                        <h1 className="text-base font-semibold leading-7 text-gray-900">
                            Cashflow
                        </h1>
                        <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
                            {secondaryNavigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={
                                        item.current
                                            ? "text-indigo-600"
                                            : "text-gray-700"
                                    }
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        {/* Start */}

                        <a
                            href="#"
                            className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <PlusSmallIcon
                                className="-ml-1.5 h-5 w-5"
                                aria-hidden="true"
                            />
                            New invoice
                        </a>
                        {/* End */}
                    </div>
                </header>
            </div>
        </main>
    );
}
