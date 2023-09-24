import {Metadata} from "next";

export const metadata: Metadata = {
    title: "About Us - Driver's Log",
};

export default function AboutUsLayout({
                                          children, // will be a page or nested layout
                                      }: {
    children: React.ReactNode;
}) {
    return <section>{children}</section>;
}
