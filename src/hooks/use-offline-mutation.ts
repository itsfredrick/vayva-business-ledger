import { useLiveQuery } from "dexie-react-hooks";
import { db, OfflineMutationType } from "@/lib/db";
import { useState } from "react";

export function useOfflineMutation(type: OfflineMutationType) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This hook just adds to the queue.
    // The SyncProvider handles the actual processing.

    const submit = async (payload: any) => {
        setIsSubmitting(true);
        try {
            const id = await db.offlineQueue.add({
                type,
                payload,
                createdAt: Date.now(),
                status: "PENDING",
                retryCount: 0
            });
            return id;
        } catch (error) {
            console.error("Failed to queue offline mutation", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submit, isSubmitting };
}
