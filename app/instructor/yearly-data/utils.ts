import {VehicleMaintenanceRecords} from "@/app/types/shared/records";

export function calculateTotalGasAndMaintenance(yearlyData: VehicleMaintenanceRecords[]) {
    const totalGas = yearlyData.reduce(
        (total, maintenance) => total + maintenance.gas,
        0
    );
    const totalMaintenance = yearlyData.reduce(
        (total, maintenance) => total + maintenance.maintenance,
        0
    );
    return {totalGas, totalMaintenance};
}
