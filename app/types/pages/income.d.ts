import {IncomeRecordForUpdate, IncomeRecords} from "@/app/types/shared/records";

export interface IncomeEditValues {
    record: IncomeRecords;
    onEditSave: (id: number, updatedRecord: IncomeRecordForUpdate) => void;
    onCancel: () => void;
}