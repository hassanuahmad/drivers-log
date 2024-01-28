import { Metadata } from "next";
import { LessonProvider } from "../../context/lessonProvider";

export const metadata: Metadata = {
    title: "Road Test",
};

export default function RoadTestLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <LessonProvider>{children}</LessonProvider>
        </section>
    );
}
