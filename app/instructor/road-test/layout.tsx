import { Metadata } from "next";
import { RoadTestProvider } from "@/app/context/roadTestProvider";
import View from "./view";

export const metadata: Metadata = {
    title: "Road Test",
};

export default function RoadTestLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <RoadTestProvider>
                {children}
                <View />
            </RoadTestProvider>
        </section>
    );
}
