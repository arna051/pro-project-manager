import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReminder extends Document<Types.ObjectId> {
    title: string
    deadline: number
    content: string
    createdAt?: Date
    updatedAt?: Date
}

const reminderSchema = new Schema<IReminder>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    deadline: {
        type: Number,
        default: () => Date.now() + (1e3 * 60 * 60 * 24 * 2)
    },
    content: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});


const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);

export default Reminder;
