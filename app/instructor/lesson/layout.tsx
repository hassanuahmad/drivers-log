import View from "./view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lessons",
};

export default function LessonLayout({
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
