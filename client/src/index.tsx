import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Thread } from './task-service';
import axios from 'axios';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { createHashHistory } from 'history';

class TaskList extends Component {
  threads: Thread[] = [];

  render() {
    return (
      <Card title="Threads">
        {this.threads.map((thread) => (
          <Row key={thread.threadId}>
            <Column>
              <NavLink to={'/threads/' + thread.threadId}>{thread.title}</NavLink>
            </Column>
            <Column>
              <Button.Danger
                onClick={() => {
                  taskService.delete(thread.threadId).then(() => this.mounted());
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
    taskService.getAll().then((threads) => (this.threads = threads));
  }
}

class ThreadNew extends Component {
  title = '';
  content = '';

  render() {
    return (
      <Card title="New thread">
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
        <Row>
          <Column width={1}>
            <Form.Label>Content:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.content}
              onChange={(event) => (this.content = event.currentTarget.value)}
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
      <HashRouter>
        <TaskList />
        <ThreadNew />
      </HashRouter>
    </>,
  );
