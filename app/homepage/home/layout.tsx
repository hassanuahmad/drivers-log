import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home - Driver's Log",
};

export default function HomeLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return <section>{children}</section>;
}
