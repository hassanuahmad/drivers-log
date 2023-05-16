import HomepageNavbar from "../components/homepageNavbar";

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <HomepageNavbar />
            <div className="px-8"> {children}</div>
        </section>
    );
}
