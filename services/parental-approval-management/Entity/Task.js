import { EntitySchema } from "typeorm";

class Task {
    constructor(name, status, assignmentId, userId, course, timeModified) {
        this.name = name;
        this.status = status || 'PENDING'; 
        this.assignmentId = assignmentId;
        this.userId = userId;
        this.course = course;
        this.timeModified = timeModified || new Date();
    }
}

export const TaskSchema = new EntitySchema({
    name: "Task",
    tableName: "task",
    target: Task,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 255
        },
        status: {
            type: "varchar",
            default: 'PENDING'
        },
        assignmentId: {
            type: "int",
            nullable: true
        },
        userId: {
            type: "int",
            nullable: true
        },
        course: {
            type: "int",
            nullable: true
        },
        timeModified: {
            type: "datetime",
            nullable: true
        }
    }
});

export default Task;