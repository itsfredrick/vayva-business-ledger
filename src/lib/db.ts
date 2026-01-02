import Dexie, { type EntityTable } from 'dexie';

export type OfflineMutationType =
    | "ADD_TRIP"
    | "ADD_SALE"
    | "ADD_EXPENSE"
    | "ADD_DELIVERY";

export interface SerializedMutation {
    id: number;
    type: OfflineMutationType;
    payload: any;
    createdAt: number;
    status: "PENDING" | "SYNCING" | "FAILED" | "SUCCESS";
    error?: string;
    retryCount: number;
}

const db = new Dexie('PureWaterDB') as Dexie & {
    offlineQueue: EntityTable<SerializedMutation, 'id'>;
    drafts: EntityTable<{ id: string; type: string; data: any; updatedAt: number }, 'id'>;
};

// Define Schema
db.version(2).stores({
    offlineQueue: '++id, type, status, createdAt',
    drafts: 'id, type, updatedAt'
}).upgrade(tx => {
    // Basic upgrade if needed, for now just version bump
});

export { db };
