"use client";
import {useContext, useState} from "react";
import Notification from "@/app/components/notification";
import {calculateTotalDuration, calculateTotalPayment, formatDuration,} from "./utils";
import {LessonRecordsContext} from "../../context/lessonRecordsContext";
import {LessonFormValues} from "@/app/types/shared/forms";
import {LessonRecords} from "@/app/types/shared/records";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import SectionHeading from "@/app/components/sectionHeading";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/app/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/app/components/ui/form"
import {CalendarIcon, Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/app/lib/utils";
import {Popover, PopoverContent, PopoverTrigger,} from "@/app/components/ui/popover"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/app/components/ui/command"
import {Input} from "@/app/components/ui/input";
import {adjustForTimezone, isDateValid} from "@/app/instructor/vehicle-maintenance/utils";
import {format} from "date-fns";
import {Calendar} from "@/app/components/ui/calendar";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select";
import {log} from "next/dist/server/typescript/utils";

const validationSchema = z.object({
    selectStudent: z.string().nonempty("Required"),
    date: z.string().nonempty("Required").refine(date => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }, {
        message: "Date format should be 'YYYY-MM-DD'"
    }),
    startTime: z.string().nonempty("Required"),
    endTime: z.string().nonempty("Required"),
    paymentType: z.string().nonempty("Required"),
    paymentAmount: z.coerce.number(),
    roadTest: z.string().nonempty("Required"),
    remarks: z.string().optional(),
});

export default function Page() {
    const contextValue = useContext(LessonRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {
        studentRecords,
        records,
        setRecords,
        setTotalDuration,
        setTotalCash,
        setTotalInterac,
    } = contextValue;
    const {instructorId} = useContext(InstructorIdContext);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [showNotification, setShowNotification] = useState(false);
    const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);

    const initialValues: LessonFormValues = {
        selectStudent: "",
        date: formattedToday,
        startTime: "",
        endTime: "",
        paymentType: "Interac",
        paymentAmount: 0,
        roadTest: "No",
        remarks: "",
    };

    const form = useForm<z.infer<typeof validationSchema>>({
        resolver: zodResolver(validationSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof validationSchema>) {
        try {
            const response = await fetch(`/api/${instructorId}/lesson`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                let newRecord = await response.json();

                // Find the student object that matches the studentId from the values
                let student = studentRecords.find(
                    (student) =>
                        student.studentId === newRecord.record.studentId
                );

                if (student) {
                    newRecord.record = {
                        ...newRecord.record,
                        student: student.student,
                        formattedDuration: formatDuration(
                            Number(newRecord.record.duration)
                        ),
                    };
                }

                setRecords((prevRecords: LessonRecords[]) => {
                    const newRecords = [...prevRecords, newRecord.record];

                    newRecords.sort((a, b) => {
                        // Compare dates
                        const dateComparison = a.date.localeCompare(b.date);
                        if (dateComparison !== 0) {
                            // If dates are different, return the comparison result
                            return dateComparison;
                        } else {
                            // If dates are the same, compare times
                            return a.startTime.localeCompare(b.startTime);
                        }
                    });

                    return newRecords;
                });

                const total = calculateTotalDuration([
                    ...records,
                    newRecord.record,
                ]);
                setTotalDuration(total);
                setTotalCash(
                    calculateTotalPayment(
                        [...records, newRecord.record],
                        "Cash"
                    )
                );
                setTotalInterac(
                    calculateTotalPayment(
                        [...records, newRecord.record],
                        "Interac"
                    )
                );

                setShowNotification(true);
                form.reset(initialValues);

                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Notification
                show={showNotification}
                text={"Lesson"}
                onClose={() => setShowNotification(false)}
            />
            <SectionHeading title={"Lesson Information"}
                            description={"Select student and add a lesson. If you have no students, please first add a student in the Students tab."}/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className={"my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"}>
                        <FormField
                            control={form.control}
                            name="selectStudent"
                            render={({field}) => (
                                <FormItem className="flex flex-col justify-end">
                                    <FormLabel>Select Student</FormLabel>
                                    <Popover open={isSelectStudentOpen} onOpenChange={setIsSelectStudentOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? `${studentRecords.find(
                                                            (studentRecord) => studentRecord.studentId === Number(field.value)
                                                        )?.student.firstName} ${studentRecords.find(
                                                            (studentRecord) => studentRecord.studentId === Number(field.value)
                                                        )?.student.lastName}`
                                                        : "Select Student"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput className="focus:border-none focus:ring-0"
                                                              placeholder="Search student..."/>
                                                <CommandEmpty>No student found.</CommandEmpty>
                                                <CommandGroup>
                                                    {studentRecords.map((studentRecord) => (
                                                        <CommandItem
                                                            value={studentRecord.student.firstName}
                                                            key={studentRecord.studentId}
                                                            onSelect={() => {
                                                                form.setValue("selectStudent", String(studentRecord.studentId));
                                                                setIsSelectStudentOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    studentRecord.studentId === Number(field.value)
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {studentRecord.student.firstName} {studentRecord.student.lastName}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({field}) => (
                                <FormItem className="flex flex-col justify-end sm:h-[72px]">
                                    <FormLabel>Date</FormLabel>
                                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
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
                                                        setIsDateOpen(false);
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
                            name="startTime"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type={"time"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <Input type={"time"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Interac">Interac</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentAmount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Payment Amount</FormLabel>
                                    <FormControl>
                                        <Input type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roadTest"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Road Test</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="No">No</SelectItem>
                                            <SelectItem value="Pass">Pass</SelectItem>
                                            <SelectItem value="Fail">Fail</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className={"sm:col-span-2 lg:col-span-5"}>
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
                        <Button type="submit">Submit</Button>
                    </div>
                    <div className="border-b border-gray-200"/>
                </form>
            </Form>
        </>
    );
}
