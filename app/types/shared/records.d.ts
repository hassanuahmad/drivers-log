import {StudentFormValues} from "@/app/types/shared/forms";

export interface StudentRecordsForUpdate {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    drivingClass: string;
    bde: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    remarks: string;
}

export interface StudentRecords {
    id: number;
    instructorId: number;
    studentId: number;
    student: StudentFormValues;
}

export interface LessonRecordsPreFormattedDuration {
    date: string;
    duration: number;
    endTime: string;
    id: number;
    instructorId: number;
    paymentAmount: number;
    paymentType: string;
    remarks: string;
    roadTest: string;
    startTime: string;
    student: StudentFormValues;
    studentId: number;
}

export interface LessonRecordsDbRow {
    id: number;
    date: string;
    duration: number;
    endTime: string;
    instructorId: number;
    paymentAmount: number;
    paymentType: string;
    remarks: string;
    roadTest: string;
    startTime: string;
    studentId: number;
}

export interface LessonRecordsForUpdate {
    date: string;
    duration: number;
    endTime: string;
    paymentAmount: number;
    paymentType: string;
    remarks: string;
    roadTest: string;
    startTime: string;
}

export interface LessonRecords {
    date: string;
    duration: number;
    endTime: string;
    formattedDuration: string;
    id: number;
    instructorId: number;
    paymentAmount: number;
    paymentType: string;
    remarks: string;
    roadTest: string;
    startTime: string;
    student: StudentFormValues;
    studentId: number;
}

export interface VehicleMaintenanceRecordForUpdate {
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
}

export interface VehicleMaintenanceRecords {
    date: string;
    fueling: number;
    gas: number;
    id: number;
    instructorId: number;
    maintenance: number;
    odometer: number;
    remarks: string;
}

export interface LessonContextType {
    studentRecords: StudentRecords[];
    setStudentRecords: Dispatch<SetStateAction<StudentRecords[]>>;
    records: LessonRecords[];
    setRecords: Dispatch<SetStateAction<LessonRecords[]>>;
    selectedYear: number;
    setSelectedYear: Dispatch<SetStateAction<number>>;
    selectedMonth: string;
    setSelectedMonth: Dispatch<SetStateAction<string>>;
    totalDuration: string;
    setTotalDuration: Dispatch<SetStateAction<string>>;
    totalCash: number;
    setTotalCash: Dispatch<SetStateAction<number>>;
    totalInterac: number;
    setTotalInterac: Dispatch<SetStateAction<number>>;
}

export interface StudentContextType {
    records: StudentRecords[];
    setRecords: Dispatch<SetStateAction<StudentRecords[]>>;
}

export interface VehicleMaintenanceContextType {
    records: VehicleMaintenanceRecords[];
    setRecords: Dispatch<SetStateAction<VehicleMaintenanceRecords[]>>;
    selectedMonth: string;
    setSelectedMonth: Dispatch<SetStateAction<string>>;
    selectedYear: number;
    setSelectedYear: Dispatch<SetStateAction<number>>;
    totalGas: number;
    setTotalGas: Dispatch<SetStateAction<number>>;
    totalMaintenance: number;
    setTotalMaintenance: Dispatch<SetStateAction<number>>;
}

