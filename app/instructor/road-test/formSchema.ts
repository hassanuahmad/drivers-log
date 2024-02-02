import * as z from "zod";

export const validationSchema = z.object({
    selectStudent: z.string({ required_error: "Name is required" }),
    date: z.string().refine(
        (date) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(date);
        },
        {
            message: "Date format should be 'YYYY-MM-DD'",
        },
    ),
    location: z.string({ required_error: "Location is required" }),
    testTime: z.string({ required_error: "Test Time is required" }),
    remarks: z.string().optional(),
});
