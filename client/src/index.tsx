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
  tempThreads: Thread[] = [];

  searchHitThreads: Thread[] = [];
  searchText: string = 'Search title';

  render() {
    return (
      <Card title="Threads">
        <div className="float-end">
          <Row>
            <Column>
              <Form.Input
                type="text"
                value={this.searchText}
                onChange={(event) => (this.searchText = event.currentTarget.value)}
              />
            </Column>
            <Column>
              <Button.Light
                onClick={() => {
                  this.searchHitThreads.length = 0;

                  this.tempThreads.forEach((thread) => {
                    if (thread.title.toLowerCase().includes(this.searchText.toLowerCase())) {
                      this.searchHitThreads.push(thread);
                    }
                  });

                  TaskList.instance()?.mounted();
                }}
              >
                🔍
              </Button.Light>
            </Column>
          </Row>
        </div>

        <Row>
          <Column>
            <Form.Label>
              <b>Title</b>
            </Form.Label>
          </Column>
          <Column>
            <Form.Label>
              <b>Likes</b>
            </Form.Label>
          </Column>
          <Column>
            <Form.Label>
              <b>Category</b>
            </Form.Label>
          </Column>
          {/* <Column>
            <Form.Label></Form.Label>
          </Column> */}
        </Row>

        {this.threads.map((thread) => (
          <Row key={thread.threadId}>
            <Column>
              <NavLink to={'/threads/' + thread.threadId}>{thread.title}</NavLink>
            </Column>
            <Column>{thread.likes} 👍</Column>
            <Column>{thread.tag}</Column>
            {/* <Column>
              <Button.Danger
                onClick={() => {
                  taskService.delete(thread.threadId).then(() => this.mounted());
                }}
              >
                X
              </Button.Danger>
            </Column> */}
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    taskService.getAll().then((threads) => {
      if (this.searchText != '' && this.searchText != 'Search title') {
        this.threads = this.searchHitThreads;
      } else {
        this.threads = threads;
        this.tempThreads = threads;
      }
    });
  }
}

class ThreadNew extends Component {
  title = '';
  content = '';
  tag = '';
  likes = 0;

  render() {
    return (
      <div className="fixed-bottom">
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
            <Column width={5}>
              <Form.Textarea
                value={this.content}
                onChange={(event) => (this.content = event.currentTarget.value)}
              />
            </Column>
          </Row>

          <Row>
            <Column width={1}>
              <Form.Label>Tag:</Form.Label>
            </Column>
            <Column>
              <Form.Select
                value={this.tag}
                onChange={(event) => (this.tag = event.currentTarget.value)}
              >
                <option value="Career">Career</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Reading">Reading</option>
                <option value="Technology">Technology</option>
              </Form.Select>
            </Column>
          </Row>

          <Button.Success
            onClick={() => {
              console.log(this.title, this.likes, this.content, this.tag);
              taskService.create(this.title, this.content, this.likes, this.tag).then(() => {
                // Reloads the tasks in the Tasks component
                TaskList.instance()?.mounted(); // .? meaning: call TaskList.instance().mounted() if TaskList.instance() does not return null
                this.title = '';
                this.content = '';
                this.tag = '';
              });
            }}
          >
            Create
          </Button.Success>
        </Card>
      </div>
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
