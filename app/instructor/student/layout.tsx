import View from "./view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Students",
};

export default function StudentLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <View />
        </section>
    );
}
