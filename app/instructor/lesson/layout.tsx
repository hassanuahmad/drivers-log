import View from "./view";
import { Metadata } from "next";
import { LessonProvider } from "../../context/lessonProvider";

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
            <LessonProvider>
                {children}
                <View />
            </LessonProvider>
        </section>
    );
}
