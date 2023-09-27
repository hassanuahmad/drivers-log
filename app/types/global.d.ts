import {Dispatch, SetStateAction} from "react";

export interface User {
    googleId: string | undefined;
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    emailAddress: string | undefined;
}

export interface InstructorIdContextType {
    instructorId: number | null;
    setInstructorId: Dispatch<SetStateAction<null>> | null;
}