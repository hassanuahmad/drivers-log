"use client";
import { useContext, useState } from "react";
import Notification from "@/app/components/notification";
import { LessonRecordsContext } from "../../context/lessonRecordsContext";
import SectionHeading from "@/app/components/sectionHeading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  adjustForTimezone,
  isDateValid,
} from "@/app/instructor/vehicle-maintenance/utils";
import { validationSchema } from "./formSchema";
import * as z from "zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function RoadTest() {
  const contextValue = useContext(LessonRecordsContext);
  if (!contextValue) {
    // Handle the null context appropriately, maybe return null or some fallback UI
    return null;
  }
  const { studentRecords } = contextValue;
  const [showNotification, setShowNotification] = useState(false);
  const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const initialValues = {
    selectStudent: "",
    date: formattedToday,
    location: "Windsor",
    testTime: "",
    remarks: "",
  };

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof validationSchema>) {
    try {
      const response = await fetch(`/api/instructor/road-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        let newRecord = await response.json();

        console.log("road test: ", newRecord);

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
        text={"Road Test"}
        onClose={() => setShowNotification(false)}
      />
      <SectionHeading
        title={"Road Test"}
        description={
          "Add student road test records to keep track of your road tests."
        }
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div
            className={
              "my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
            }
          >
            <FormField
              control={form.control}
              name="selectStudent"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Select Student</FormLabel>
                  <Popover
                    open={isSelectStudentOpen}
                    onOpenChange={setIsSelectStudentOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? `${studentRecords.find(
                                (studentRecord) =>
                                  studentRecord.studentId ===
                                  Number(field.value),
                              )?.student.firstName} ${studentRecords.find(
                                (studentRecord) =>
                                  studentRecord.studentId ===
                                  Number(field.value),
                              )?.student.lastName}`
                            : "Select Student"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          className="focus:border-none focus:ring-0"
                          placeholder="Search student..."
                        />
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                          {studentRecords.map((studentRecord) => (
                            <CommandItem
                              value={studentRecord.student.firstName}
                              key={studentRecord.studentId}
                              onSelect={() => {
                                form.setValue(
                                  "selectStudent",
                                  String(studentRecord.studentId),
                                );
                                setIsSelectStudentOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  studentRecord.studentId ===
                                    Number(field.value)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {studentRecord.student.firstName}{" "}
                              {studentRecord.student.lastName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {isDateValid(field.value) ? (
                            format(adjustForTimezone(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          isDateValid(field.value)
                            ? adjustForTimezone(field.value)
                            : undefined
                        }
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            const formattedDate = format(
                              selectedDate,
                              "yyyy-MM-dd",
                            );
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Windsor">Windsor</SelectItem>
                      <SelectItem value="Chatham">Chatham</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Time</FormLabel>
                  <FormControl>
                    <Input type={"time"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"sm:col-span-2"}>
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save Road Test</Button>
          </div>
          <div className="border-b border-gray-200" />
        </form>
      </Form>
    </>
  );
}
