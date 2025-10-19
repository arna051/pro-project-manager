import { Document, model, Schema, Types } from "mongoose";
import type { GridFSFile } from "mongodb";
import { IContractor } from "./contractor";

export interface IEvidence extends Document<Types.ObjectId> {
    projectId?: Types.ObjectId
    contractorsIds: Types.ObjectId[]
    title: string
    content: string
    attachmentsIds: Types.ObjectId[]

    attachments: GridFSFile[]
    contractors: IContractor[]
}

const EvidenceSchema = new Schema<IEvidence>(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        contractorsIds: { type: [Schema.Types.ObjectId], ref: "Contractor", required: true },
        title: { type: String, required: true, trim: true },
        content: { type: String, },
        attachmentsIds: [{ type: Schema.Types.ObjectId }] // you can also switch this to ObjectId[] if they reference files
    },
    {
        timestamps: true // adds createdAt and updatedAt
    }
);

export const Evidence = model<IEvidence>("Evidence", EvidenceSchema);