import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITodo {
    task: string;
    date: Date;
    priority: number;
}

export interface IProject extends Document {
    title: string;
    image: string;
    todos: ITodo[];
    contractorIds: Types.ObjectId[];
    lastCheck: Date;
    serversIds: Types.ObjectId[];
    description?: string;
    categoryIds: Types.ObjectId[];
    repositoryIds: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const todoSchema = new Schema<ITodo>({
    task: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 5
    }
});

const projectSchema = new Schema<IProject>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    todos: [todoSchema],
    contractorIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Contractor'
    }],
    lastCheck: {
        type: Date,
        default: Date.now
    },
    serversIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Server'
    }],
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    categoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    repositoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }]
}, {
    timestamps: true
});

// Text search index
projectSchema.index({ title: 'text', description: 'text' });

// Performance indexes
projectSchema.index({ contractorIds: 1 });
projectSchema.index({ categoryIds: 1 });
projectSchema.index({ lastCheck: 1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;