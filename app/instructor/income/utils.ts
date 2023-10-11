import {IncomeRecords} from "@/app/types/shared/records";

export function calculateTotals(records: IncomeRecords[]) {
    let totalIncome = 0;

    for (let record of records) {
        totalIncome += record.income;
    }

    return totalIncome;
}