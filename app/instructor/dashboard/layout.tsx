import RecentActivity from "./recentActivity";
import Calender from "./tempCaledner";

export default function InstructorDashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <RecentActivity />
            <Calender />
        </section>
    );
}
