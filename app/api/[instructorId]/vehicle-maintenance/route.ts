import { NextResponse } from "next/server";

interface vehicleMaintenanceRequest {
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
}

export async function POST(request: any) {
    const { date, odometer, fueling, gas, maintenance, remarks } =
        await request.json();

    console.log(date, odometer, fueling, gas, maintenance, remarks);

    // Add code to save the vehicle maintenance record to the database.

    return NextResponse.json({ message: "Vehicle maintenance added." });
}
