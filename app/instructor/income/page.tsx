"use client";
import {useContext, useState} from "react";
import Notification from "@/app/components/notification";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select";
import {IncomeFormValues} from "@/app/types/shared/forms";
import {IncomeRecordsContext} from "@/app/context/incomeRecordsContext";
import {IncomeRecords} from "@/app/types/shared/records";

const validationSchema = z.object({
    date: z.string().refine(date => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }, {
        message: "Date format should be 'YYYY-MM-DD'"
    }),
    income: z.coerce.number(),
    incomeMethod: z.string({
        required_error: "Payment method is required",
        invalid_type_error: "Payment method must be a string"
    }),
    remarks: z.string().optional(),
});

export default function Page() {
    const contextValue = useContext(IncomeRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {setRecords, setTotalIncome} = contextValue;
    const [showNotification, setShowNotification] = useState(false);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const initialValues: IncomeFormValues = {
        date: formattedToday,
        income: 0,
        incomeMethod: "Interac",
        remarks: "",
    };

    const form = useForm<z.infer<typeof validationSchema>>({
        resolver: zodResolver(validationSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof validationSchema>) {
        try {
            const response = await fetch(
                `/api/instructor/income`,
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
                setRecords((prevRecords: IncomeRecords[]) => {
                    const updatedRecords = [...prevRecords, newRecord.record];
                    updatedRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    return updatedRecords;
                });
                setTotalIncome((prevTotalIncome: number) => prevTotalIncome + newRecord.record.income);
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
                text={"Income"}
                onClose={() => setShowNotification(false)}
            />
            <SectionHeading title={"Income Tracker"}
                            description="Log your earnings from lessons and school to monitor your monthly income."/>
            <div>
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
                                name="income"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Income</FormLabel>
                                        <FormControl>
                                            <Input type={"number"} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="incomeMethod"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Income Method</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Interac">Interac</SelectItem>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Cheque">Cheque</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={"sm:col-span-3"}>
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
                            </div>
                            <Button type="submit">Save Earning</Button>
                        </div>
                        <div className="border-b border-gray-200"/>
                    </form>
                </Form>
            </div>
        </>
    );
}
