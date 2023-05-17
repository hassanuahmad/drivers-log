import InstructorNavbar from "../components/instructorNavbar";

export default function VehicleMaintenanceLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <InstructorNavbar />
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}
