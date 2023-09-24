import {Dispatch, SetStateAction} from "react";

export interface RemarksModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    modalContent: string;
}

export interface DeleteModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onDeleteConfirm: () => void;
    id: number;
    endpoint: string;
}