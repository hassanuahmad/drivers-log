import View from "./view";

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
