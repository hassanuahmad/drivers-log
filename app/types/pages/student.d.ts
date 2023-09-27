import {StudentRecords, StudentRecordsForUpdate} from "@/app/types/shared/records";

export interface StudentEditValues {
    record: StudentRecords;
    onEditSave: (id: number, updatedRecord: StudentRecordsForUpdate) => void;
    onCancel: () => void;
}