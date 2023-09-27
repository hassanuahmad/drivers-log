import {LessonRecords, LessonRecordsForUpdate} from "../../types/shared/records";

export interface LessonEditValues {
    record: LessonRecords;
    onEditSave: (id: number, updatedRecord: LessonRecordsForUpdate) => void;
    onCancel: () => void;
}