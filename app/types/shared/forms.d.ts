export interface LessonFormValues {
    id?: number;
    selectStudent: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentType: string;
    paymentAmount: number;
    roadTest: string;
    remarks: string;
}

export interface StudentFormValues {
    id?: number;
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

export interface VehicleMaintenanceFormValues {
    id?: number;
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
}

export interface IncomeFormValues {
    id?: number;
    date: string;
    income: number;
    incomeMethod: string;
    remarks: string;
}