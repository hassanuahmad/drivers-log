import {VehicleMaintenanceRecords} from "@/app/types/shared/records";

export function calculateTotals(records: VehicleMaintenanceRecords[]) {
    let totalGas = 0;
    let totalMaintenance = 0;

    for (let record of records) {
        totalGas += record.gas;
        totalMaintenance += record.maintenance;
    }

    return {totalGas, totalMaintenance};
}
