import HomepageNavbar from "@/app/components/homepageNavbar";
import Footer from "@/app/components/footer";

export default function HomepageLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <HomepageNavbar/>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
            <Footer/>
        </section>
    );
}
