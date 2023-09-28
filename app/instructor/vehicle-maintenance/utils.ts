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

// checks if date is in YYYY-MM-DD format
export const isDateValid = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

// take a date string and adjust it for the user's timezone
export const adjustForTimezone = (dateStr: string) => {
    const date = new Date(dateStr);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + timezoneOffset);
};