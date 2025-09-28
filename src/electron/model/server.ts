import mongoose, { Document, Schema, Types } from "mongoose";

export interface IServer extends Document<Types.ObjectId> {
    title: string
    user: string
    host: string
    port: string
    password: string
    createdAt?: Date
    updatedAt?: Date
}

const serverSchema = new Schema<IServer>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    user: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    host: {
        type: String,
        required: true,
        trim: true
    },
    port: {
        type: String,
        required: true,
        trim: true,
        default: '22'
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

serverSchema.index({ host: 1, port: 1 }, { unique: true });

const Server = mongoose.model<IServer>('Server', serverSchema);

export default Server;
