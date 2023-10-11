import View from "./view";
import {Metadata} from "next";
import {IncomeProvider} from "@/app/context/incomeProvider";

export const metadata: Metadata = {
    title: "Income Tracker",
};

export default function IncomeLayout({
                                         children, // will be a page or nested layout
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <IncomeProvider>
            {children}
            <View/>
        </IncomeProvider>
    );
}
