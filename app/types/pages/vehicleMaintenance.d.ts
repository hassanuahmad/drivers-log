import {VehicleMaintenanceRecordForUpdate, VehicleMaintenanceRecords} from "@/app/types/shared/records";

export interface VehicleMaintenanceEditValues {
    record: VehicleMaintenanceRecords;
    onEditSave: (id: number, updatedRecord: VehicleMaintenanceRecordForUpdate) => void;
    onCancel: () => void;
}