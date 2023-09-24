import RecentActivity from "./recentActivity";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Instructor Dashboard",
};

export default function InstructorDashboardLayout({
                                                      children, // will be a page or nested layout
                                                  }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <RecentActivity/>
        </section>
    );
}
