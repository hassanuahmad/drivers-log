import {
    RoadTestRecords,
    RoadTestRecordsForUpdate,
} from "@/app/types/shared/records";

export interface RoadTestEditValues {
    record: RoadTestRecords;
    onEditSave: (id: number, updatedRecord: RoadTestRecordsForUpdate) => void;
    onCancel: () => void;
}
