import Navbar from "../components/navbar";

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Navbar />
            <div className="px-8"> {children}</div>
        </section>
    );
}
