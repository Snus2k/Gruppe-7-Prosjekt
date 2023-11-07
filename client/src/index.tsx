import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Thread } from './task-service';
import axios from 'axios';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Modal } from './threadModal';

class TaskList extends Component {
  threads: Thread[] = [];

  state = {
    isModalOpen: false,
    selectedThread: null,
  };

  openModalWithThread = (thread: Thread) => {
    this.setState({
      selectedThread: thread,
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <>
        <Card title="Threads">
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
            <Column>
              <Form.Label></Form.Label>
            </Column>
          </Row>

          {this.threads.map((thread) => (
            <Row key={thread.threadId}>
              <Column>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.openModalWithThread(thread);
                  }}
                >
                  {thread.title}
                </a>
              </Column>
              <Column>{thread.likes} 👍</Column>
              <Column>{thread.tag}</Column>
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

        {this.state.isModalOpen && (
          <Modal
            show={this.state.isModalOpen}
            onClose={this.closeModal}
            thread={this.state.selectedThread}
          />
        )}
      </>
    );
  }

  mounted() {
    taskService.getAll().then((threads) => (this.threads = threads));
  }
}

class ThreadNew extends Component {
  title = '';
  content = '';
  tag = '';
  likes = 0;

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
              <option value="Career">Entertainment</option>
              <option value="Food">Food</option>
              <option value="Career">Health</option>
              <option value="Career">Lifestyle</option>
              <option value="Career">Reading</option>
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
