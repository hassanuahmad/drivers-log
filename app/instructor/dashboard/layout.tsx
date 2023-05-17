import Stats from "./stats";
import RecentActivity from "./recentActivity";

export default function InstructorDashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <Stats />
            <RecentActivity />
        </section>
    );
}
