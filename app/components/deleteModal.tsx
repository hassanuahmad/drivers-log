import {useRef} from "react";
import {DeleteModalProps} from "@/app/types/components/modal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"


export default function DeleteModal({
                                        isOpen,
                                        showDeleteErrorMessage,
                                        onCancel,
                                        onDeleteConfirm,
                                        id,
                                        endpoint,
                                    }: DeleteModalProps) {
    const handleDeleteConfirm = async () => {
        try {
            const params = new URLSearchParams({id: id.toString()});
            const response = await fetch(`${endpoint}?${params.toString()}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                if (response.status === 300) {
                    onCancel();
                    if (showDeleteErrorMessage) {
                        showDeleteErrorMessage();
                    }
                } else {
                    onCancel();
                }
            } else {
                onDeleteConfirm();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const cancelButtonRef = useRef(null);

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this item? Once removed, it cannot be recovered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel ref={cancelButtonRef}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}
                                           className={"bg-red-600 hover:bg-red-500"}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
