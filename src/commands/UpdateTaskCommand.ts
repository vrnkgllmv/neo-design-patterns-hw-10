import { AbstractCommand } from './AbstractCommand';
import { TaskList } from '../models/TaskList';
import { Task } from '../models/Task';

export class UpdateTaskCommand extends AbstractCommand {
  private previousState: Partial<Task> | undefined;

  constructor(
    private taskList: TaskList,
    private taskId: string,
    private updates: Partial<Task>
  ) {
    super();
  }

  execute(): void {
    const task = this.taskList.getAllTasks().find(t => t.id === this.taskId);
    if (task) {
      const oldState: Partial<Task> = {};
      for (const key of Object.keys(this.updates) as Array<keyof Task>) {
        oldState[key] = task[key] as any;
      }
      this.previousState = oldState;
      this.taskList.updateTask(this.taskId, this.updates);
    }
  }

  undo(): void {
    if (this.previousState) {
      this.taskList.updateTask(this.taskId, this.previousState);
    }
  }
}
