import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home - Driver's Log",
};

export default function YearlyDataLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return <section>{children}</section>;
}
