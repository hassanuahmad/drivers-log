import HomepageNavbar from "../components/homepage-navbar";

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
