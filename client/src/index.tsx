import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Task } from './task-service';
import axios from 'axios';

class TaskList extends Component {
  tasks: Task[] = [];

  render() {
    return (
      <Card title="Tasks">
        <Row>
          <Column>Title</Column>
          <Column>Done</Column>
          <Column></Column>
        </Row>
        {this.tasks.map((task) => (
          <Row key={task.id}>
            <Column>{task.title}</Column>
            <Column>
              <Form.Checkbox
                checked={task.done}
                xx={() => {
                  taskService.patch(task.id).then(() => this.mounted());
                }}
              />
            </Column>
            <Column>
              <Button.Danger
                xx={() => {
                  taskService.delete(task.id).then(() => this.mounted());
                }}
              >
                X
              </Button.Danger>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    taskService.getAll().then((tasks) => (this.tasks = tasks));
  }
}

class TaskNew extends Component {
  title = '';

  render() {
    return (
      <Card title="New task">
        <Row>
          <Column width={1}>
            <Form.Label>Title:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.title}
              onChange={(event) => (this.title = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Button.Success
          onClick={() => {
            taskService.create(this.title).then(() => {
              // Reloads the tasks in the Tasks component
              TaskList.instance()?.mounted(); // .? meaning: call TaskList.instance().mounted() if TaskList.instance() does not return null
              this.title = '';
            });
          }}
        >
          Create
        </Button.Success>
      </Card>
    );
  }
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <TaskList />
      <TaskNew />
    </>,
  );
