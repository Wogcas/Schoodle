import { EntitySchema } from "typeorm";

class Task {
    constructor(name, status) {
        this.name = name;
        this.status = status;
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
            type: "varchar"
        }
    }
});

export default Task;
