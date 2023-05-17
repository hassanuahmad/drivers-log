type Record = {
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
};

export function calculateTotals(records: Record[]) {
    let totalGas = 0;
    let totalMaintenance = 0;

    for (let record of records) {
        totalGas += record.gas;
        totalMaintenance += record.maintenance;
    }

    return { totalGas, totalMaintenance };
}
