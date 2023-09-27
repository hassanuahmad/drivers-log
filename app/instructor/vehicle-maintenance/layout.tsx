import View from "./view";
import {Metadata} from "next";
import {VehicleMaintenanceProvider} from "../../context/vehicleMaintenanceProvider";

export const metadata: Metadata = {
    title: "Vehicle Maintenance",
};

export default function VehicleMaintenanceLayout({
                                                     children, // will be a page or nested layout
                                                 }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <VehicleMaintenanceProvider>
                {children}
                <View/>
            </VehicleMaintenanceProvider>
        </section>
    );
}
