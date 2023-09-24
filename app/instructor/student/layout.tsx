import View from "./view";
import {Metadata} from "next";
import {StudentProvider} from "../../context/studentProvider";

export const metadata: Metadata = {
    title: "Students",
};

export default function StudentLayout({
                                          children, // will be a page or nested layout
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <StudentProvider>
                {children}
                <View/>
            </StudentProvider>
        </section>
    );
}
