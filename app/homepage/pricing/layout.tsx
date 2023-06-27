import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing - Driver's Log",
};

export default function PricingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return <section>{children}</section>;
}
