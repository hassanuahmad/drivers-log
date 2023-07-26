import HomepageNavbar from "../components/homepageNavbar";
import Footer from "../components/footer";

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <HomepageNavbar />
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
            <Footer />
        </section>
    );
}
