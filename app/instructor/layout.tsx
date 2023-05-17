import InstructorNavbar from "../components/instructorNavbar";

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
