"use client";
import {useState} from "react";
import {Disclosure, RadioGroup} from "@headlessui/react";
import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/20/solid";
import {Tier} from "@/app/types/pages/pricing";

const pricing: {
    frequencies: { value: string; label: string; priceSuffix: string } [];
    tiers: Tier[]
} = {
    frequencies: [
        {value: "monthly", label: "Monthly", priceSuffix: "/month"},
        {value: "annually", label: "Annually", priceSuffix: "/year"},
    ],
    tiers: [
        {
            name: "Free",
            id: "tier-free",
            href: "#",
            price: {monthly: "$0", annually: "$0"},
            description: "Ideal for personal use",
            features: [
                "100 data entries",
                "Basic analytics features",
                "Downloadable reports",
            ],
            mostPopular: false,
        },
        {
            name: "Individual",
            id: "tier-individual",
            href: "#",
            price: {monthly: "$10", annually: "$110"},
            description:
                "Ideal for individuals in the early stages of their driving instructor schools.",
            features: [
                "Everything in Free, plus:",
                "Unlimited data entries",
                "Full reporting capabilities",
                "24-hour support response time",
            ],
            mostPopular: true,
        },
        {
            name: "Enterprise",
            id: "tier-enterprise",
            href: "#",
            price: {monthly: "Get in touch", annually: "Get in touch"},
            description:
                "Dedicated support and infrastructure for your company.",
            features: [
                "Everything in Individual, plus:",
                "1-on-1 training sessions",
                "Priority support",
                "Custom reporting tools",
            ],
            mostPopular: false,
        },
    ],
};
const faqs = [
    {
        question: "What does Drivers Log do?",
        answer: "The Driver's Log feature serves as a centralized hub for recording lesson details, tracking student progress, scheduling follow-ups, and generating insights. It streamlines your teaching process, helping you manage lessons more efficiently and tailor your instruction to each student's needs.",
    },
    {
        question: "How long does it take to learn Drivers Log?",
        answer: "Mastering Driver's Log is a breeze. Spend around 10 minutes familiarizing yourself with its features, and you'll be confidently navigating and utilizing it for efficient lesson management.",
    },
    {
        question: "Who typically uses Drivers Log?",
        answer: "Driver's Log is a valuable tool for driving instructors, schools, and educators who want to streamline lesson management, track student progress, and optimize their teaching process.",
    },
    {
        question: "Is Drivers Log free?",
        answer: "Absolutely, you can enjoy the benefits of Driver's Log with up to 100 entries at no charge. If you find it indispensable and wish to continue beyond that limit, a subscription plan is available for uninterrupted usage.",
    },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
    const [frequency, setFrequency] = useState(pricing.frequencies[0]);

    return (
        <main>
            {/* Pricing section */}
            <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-base font-semibold leading-7 text-indigo-600">
                        Pricing
                    </h1>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Get started for free and let Drivers Log scale with you.
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    All plans come with 100 entries free trial. No credit card
                </p>
                <div className="mt-16 flex justify-center">
                    <RadioGroup
                        value={frequency}
                        onChange={setFrequency}
                        className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
                    >
                        <RadioGroup.Label className="sr-only">
                            Payment frequency
                        </RadioGroup.Label>
                        {pricing.frequencies.map((option) => (
                            <RadioGroup.Option
                                key={option.value}
                                value={option}
                                className={({checked}) =>
                                    classNames(
                                        checked
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-500",
                                        "cursor-pointer rounded-full px-2.5 py-1"
                                    )
                                }
                            >
                                <span>{option.label}</span>
                            </RadioGroup.Option>
                        ))}
                    </RadioGroup>
                </div>
                <div
                    className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 sm:grid-cols-1 md:max-w-4xl md:grid-cols-3 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
                    {pricing.tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.mostPopular
                                    ? "ring-2 ring-indigo-600"
                                    : "ring-1 ring-gray-200",
                                "rounded-3xl p-8"
                            )}
                        >
                            <h2
                                id={tier.id}
                                className={classNames(
                                    tier.mostPopular
                                        ? "text-indigo-600"
                                        : "text-gray-900",
                                    "text-lg font-semibold leading-8"
                                )}
                            >
                                {tier.name}
                            </h2>
                            <p className="mt-4 text-sm leading-6 text-gray-600">
                                {tier.description}
                            </p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">
                                    {tier.price[frequency.value as keyof typeof tier.price]}
                                </span>
                                {tier.id === "tier-individual" ? (
                                    <span className="text-sm font-semibold leading-6 text-gray-600">
                                        {frequency.priceSuffix}
                                    </span>
                                ) : null}
                            </p>
                            <a
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={classNames(
                                    tier.mostPopular
                                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                                        : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                                    "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                )}
                            >
                                {tier.id === "tier-individual"
                                    ? "Try for free"
                                    : tier.id === "tier-enterprise"
                                        ? "Book a demo"
                                        : "Get started"}
                            </a>
                            <ul
                                role="list"
                                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon
                                            className="h-6 w-5 flex-none text-indigo-600"
                                            aria-hidden="true"
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ section */}
            <div className="mx-auto my-24 max-w-7xl px-6 sm:my-56 lg:px-8">
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                        Frequently asked questions
                    </h2>
                    <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                        {faqs.map((faq) => (
                            <Disclosure
                                as="div"
                                key={faq.question}
                                className="pt-6"
                            >
                                {({open}) => (
                                    <>
                                        <dt>
                                            <Disclosure.Button
                                                className="flex w-full items-start justify-between text-left text-gray-900">
                                                <span className="text-base font-semibold leading-7">
                                                    {faq.question}
                                                </span>
                                                <span className="ml-6 flex h-7 items-center">
                                                    {open ? (
                                                        <MinusSmallIcon
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <PlusSmallIcon
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel
                                            as="dd"
                                            className="mt-2 pr-12"
                                        >
                                            <p className="text-base leading-7 text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            </div>
        </main>
    );
}
