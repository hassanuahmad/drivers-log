import InstructorNavbar from "../components/instructor-navbar";

export default function VehicleMaintenanceLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <InstructorNavbar />
            {children}
        </section>
    );
}
