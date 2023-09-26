"use client";
import {useContext, useState} from "react";
import Notification from "../../components/notification";
import {StudentRecordsContext} from "../../context/studentRecordsContext";
import ErrorNotification from '../../components/errorNotification';
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import SectionHeading from "@/app/components/sectionHeading";
import {StudentFormValues} from "@/app/types/shared/forms";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {StudentRecords} from "@/app/types/shared/records";

const validationSchema = z.object({
    firstName: z.string().nonempty("Required"),
    lastName: z.string().nonempty("Required"),
    phoneNumber: z.string()
        .length(10, "Must be exactly 10 digits")
        .refine(value => /^[0-9]{10}$/.test(value), "Must be exactly 10 digits"),
    email: z.string().email().optional().or(z.literal("")),
    drivingClass: z.string().nonempty("Required"),
    bde: z.string().nonempty("Required"),
    streetAddress: z.string().nonempty("Required"),
    postalCode: z.string().nonempty("Required"),
    city: z.string().nonempty("Required"),
    province: z.string().nonempty("Required"),
    country: z.string().nonempty("Required"),
    remarks: z.string().optional(),
});

export default function Page() {
    const contextValue = useContext(StudentRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {setRecords} = contextValue;
    const {instructorId} =
        useContext(InstructorIdContext);

    const [showNotification, setShowNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const initialValues: StudentFormValues = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        drivingClass: "G2",
        bde: "No",
        streetAddress: "",
        postalCode: "",
        city: "Windsor",
        province: "ON",
        country: "Canada",
        remarks: "",
    }

    const form = useForm<z.infer<typeof validationSchema>>({
        resolver: zodResolver(validationSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof validationSchema>) {
        try {
            const response = await fetch(`/api/${instructorId}/student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            // Unique constraint error
            if (response.status === 409) {
                setShowErrorNotification(true);
                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 3000);
                form.reset(initialValues);
            } else if (response.ok) {
                const newRecord = await response.json();
                setRecords((prevRecords: StudentRecords[]) => [
                    ...prevRecords,
                    {student: newRecord.record},
                ]);
                setShowNotification(true);
                form.reset(initialValues);
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            } else {
                // Handle other potential errors
                console.error('Unknown error occurred');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ErrorNotification
                show={showErrorNotification}
                text={"Cannot add student. Student already exists."}
                onClose={() => setShowErrorNotification(false)}
            />
            <Notification
                show={showNotification}
                text={"Student"}
                onClose={() => setShowNotification(false)}
            />
            <SectionHeading title="Student Information" description="Add student information so that they can be assigned to a lesson and also they can be
                    viewed below in the table."/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="drivingClass"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Driving Class</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="G2">G2</SelectItem>
                                            <SelectItem value="G">G</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bde"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>BDE</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="No">No</SelectItem>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="streetAddress"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="province"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Province</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="United States">United States</SelectItem>
                                            <SelectItem value="Mexico">Mexico</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                        <Button type="submit">Save Student</Button>
                    </div>
                    <div className="border-b border-gray-200"/>
                </form>
            </Form>
        </>
    );
}
