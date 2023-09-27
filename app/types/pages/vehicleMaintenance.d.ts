import {VehicleMaintenanceRecordForUpdate, VehicleMaintenanceRecords} from "@/app/types/shared/records";

export interface VehicleMaintenanceEditValues {
    record: VehicleMaintenanceRecords;
    index: number;
    onEditSave: (id: number, updatedRecord: VehicleMaintenanceRecordForUpdate) => void;
    onCancel: () => void;
}