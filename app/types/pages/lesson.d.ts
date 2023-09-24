import {LessonRecords, LessonRecordsForUpdate} from "../../types/shared/records";

export interface LessonEditValues {
    record: LessonRecords;
    index: number;
    onEditSave: (id: number, updatedRecord: LessonRecordsForUpdate) => void;
    onCancel: () => void;
}