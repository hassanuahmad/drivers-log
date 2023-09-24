import {StudentRecords, StudentRecordsForUpdate} from "@/app/types/shared/records";

export interface StudentEditValues {
    record: StudentRecords;
    index: number;
    onEditSave: (id: number, updatedRecord: StudentRecordsForUpdate) => void;
    onCancel: () => void;
}