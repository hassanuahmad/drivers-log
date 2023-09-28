"use client";
import {useContext, useState} from "react";
import Notification from "@/app/components/notification";
import {VehicleMaintenanceRecordsContext} from "../../context/vehicleMaintenanceRecordsContext";
import {VehicleMaintenanceFormValues} from "../../types/shared/forms";
import {VehicleMaintenanceRecords} from "../../types/shared/records";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import SectionHeading from "@/app/components/sectionHeading";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/app/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/app/components/ui/form"
import {Input} from "@/app/components/ui/input"
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/app/lib/utils";
import {Calendar} from "@/app/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/app/components/ui/popover"
import {adjustForTimezone, isDateValid} from "@/app/instructor/vehicle-maintenance/utils";

const validationSchema = z.object({
    date: z.string().refine(date => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }, {
        message: "Date format should be 'YYYY-MM-DD'"
    }),
    odometer: z.coerce.number(),
    fueling: z.coerce.number(),
    gas: z.coerce.number(),
    maintenance: z.coerce.number(),
    remarks: z.string().optional(),
});

export default function Page() {
    const contextValue = useContext(VehicleMaintenanceRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {setRecords, setTotalGas, setTotalMaintenance} = contextValue;
    const {instructorId} = useContext(InstructorIdContext);
    const [showNotification, setShowNotification] = useState(false);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const initialValues: VehicleMaintenanceFormValues = {
        date: formattedToday,
        odometer: 0,
        fueling: 0,
        gas: 0,
        maintenance: 0,
        remarks: "",
    };

    const form = useForm<z.infer<typeof validationSchema>>({
        resolver: zodResolver(validationSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof validationSchema>) {
        try {
            const response = await fetch(
                `/api/${instructorId}/vehicle-maintenance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );
            if (response.ok) {
                const newRecord = await response.json();
                setRecords((prevRecords: VehicleMaintenanceRecords[]) => {
                    const updatedRecords = [...prevRecords, newRecord.record];
                    updatedRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    return updatedRecords;
                });
                setTotalGas(
                    (prevTotalGas: number) => prevTotalGas + newRecord.record.gas
                );
                setTotalMaintenance(
                    (prevTotalMaintenance: number) =>
                        prevTotalMaintenance + newRecord.record.maintenance
                );
                setShowNotification(true);
                form.reset(initialValues);

                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        } catch
            (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Notification
                show={showNotification}
                text={"Vehicle Maintenance"}
                onClose={() => setShowNotification(false)}
            />
            <SectionHeading title={"Vehicle Maintenance"}
                            description={"Add vehicle maintenance record to keep track of your vehicle."}/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className={"my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"}>
                        <FormField
                            control={form.control}
                            name="date"
                            render={({field}) => (
                                <FormItem className="flex flex-col justify-end">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {isDateValid(field.value) ? (
                                                        format(adjustForTimezone(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={isDateValid(field.value) ? adjustForTimezone(field.value) : undefined}
                                                onSelect={(selectedDate) => {
                                                    if (selectedDate) {
                                                        const formattedDate = format(selectedDate, "yyyy-MM-dd");
                                                        field.onChange(formattedDate);
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="odometer"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Odometer</FormLabel>
                                    <FormControl>
                                        <Input type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fueling"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Fueling</FormLabel>
                                    <FormControl>
                                        <Input type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gas"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Gas</FormLabel>
                                    <FormControl>
                                        <Input type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maintenance"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Maintenance</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </div>
                    <div className="border-b border-gray-200"/>
                </form>
            </Form>
        </>
    );
}
