import RecentActivity from "./recentActivity";

export default function InstructorDashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <RecentActivity />
        </section>
    );
}
