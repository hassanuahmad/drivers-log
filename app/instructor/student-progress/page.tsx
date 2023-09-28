"use client";
import {useContext, useEffect, useState} from "react";
import {LessonRecordsContext} from "../../context/lessonRecordsContext";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {calculateTotalDuration, calculateTotalPayment, formatDuration, generateDoc,} from "./utils";
import {LessonRecords, LessonRecordsPreFormattedDuration, StudentRecords} from "@/app/types/shared/records";
import SectionHeading from "@/app/components/sectionHeading";
import {DataTable} from "@/app/instructor/student-progress/data-table";
import {columns} from "@/app/instructor/student-progress/columns";
import {Check, ChevronsUpDown} from "lucide-react"
import {Button} from "@/app/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/app/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/app/components/ui/popover"
import {cn} from "@/app/lib/utils";

export default function Page() {
    const contextValue = useContext(LessonRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {studentRecords} = contextValue;
    const [selectedStudent, setSelectedStudent] = useState<StudentRecords | null>(null);
    const {instructorId} = useContext(InstructorIdContext);
    const [records, setRecords] = useState<LessonRecords[]>([]);
    const [totalDuration, setTotalDuration] = useState("0hr 0min");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);
    const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);

    useEffect(() => {
        if (!instructorId || !selectedStudent) return;
        fetch(
            `/api/${instructorId}/student-progress/${selectedStudent.student.id}`
        )
            .then((res) => res.json())
            .then((data) => {
                const formattedRecords = data.records.map((record: LessonRecordsPreFormattedDuration) => ({
                    ...record,
                    formattedDuration: formatDuration(Number(record.duration)),
                }));
                setRecords(formattedRecords);
                const total = calculateTotalDuration(data.records);
                setTotalDuration(total);
                setTotalCash(calculateTotalPayment(data.records, "Cash"));
                setTotalInterac(calculateTotalPayment(data.records, "Interac"));
            })
            .catch((err) => console.log(err));
    }, [instructorId, selectedStudent]);

    return (
        <>
            <SectionHeading title={"Student Progress"} description={"View student progress and generate reports."}/>
            <div className={"pt-10"}>
                <div className={"pb-4"}>
                    <Popover open={isSelectStudentOpen} onOpenChange={setIsSelectStudentOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isSelectStudentOpen}
                                className="w-[200px] justify-between"
                            >
                                {selectedStudent
                                    ? `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`
                                    : "Select Student..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search student..."
                                              className="focus:border-none focus:ring-0"/>
                                <CommandEmpty>No student found.</CommandEmpty>
                                <CommandGroup>
                                    {studentRecords.map((record) => (
                                        <CommandItem
                                            key={record.student.id}
                                            onSelect={(currentValue) => {
                                                setSelectedStudent(record);
                                                setIsSelectStudentOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedStudent?.student.id === record.student.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {record.student.firstName} {record.student.lastName}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <DataTable columns={columns()} data={records}/>
            </div>

            {/* Lesson Stats */}
            <div className="flex justify-end py-6">
                <div className="flex flex-col">
                    <span className="text-right text-sm font-bold text-gray-500">
                        Total Hours:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500 py-4">
                        Total Interac:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500">
                        Total Cash:
                    </span>
                </div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm text-gray-500 text-right">
                        {totalDuration}
                    </span>
                    <span className="text-sm text-gray-500 py-4 text-right">
                        ${totalInterac}
                    </span>
                    <span className="text-sm text-gray-500 text-right">
                        ${totalCash}
                    </span>
                </div>
            </div>
            {/* !!! THIS IS ONLY FOR MY FATHER CURRENTLY !!! */}
            {instructorId === 14 ? (
                <div className="flex justify-end pb-6">
                    <Button
                        variant={"outline"}
                        onClick={async () => {
                            try {
                                await generateDoc(records, instructorId);
                            } catch (error) {
                                console.error(
                                    "Failed to generate document:",
                                    error
                                );
                            }
                        }}
                    >
                        Download BDE Report
                    </Button>
                </div>
            ) : (
                ""
            )}
        </>
    );
}
