import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button, NavBar } from './widgets';
import taskService, { Thread } from './task-service';
import axios from 'axios';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Modal } from './threadModal';
import './style.css';

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Threads">
        <NavBar.Link to="/categories">Tag list</NavBar.Link>
        <NavBar.Link to="/favorites">Favorites</NavBar.Link>
      </NavBar>
    );
  }
}

export class TaskList extends Component {
  threads: Thread[] = [];
  tempThreads: Thread[] = [];
  sortToggle = 'Sort by: None';

  searchHitThreads: Thread[] = [];
  searchText: string = 'Search title';

  favoriteArray: string | null = localStorage.getItem('globalFavoriteArray');
  globalFavoriteArray: string[] = [];

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
      <div>
        <Card title="Threads">
          <Row>
            <Column>
              <Form.Select
                value={this.sortToggle}
                onChange={(event) => {
                  this.sortToggle = event.currentTarget.value;
                  TaskList.instance()?.mounted();
                }}
              >
                <option value="Sort by: None">Sort by: None</option>
                <option value="Sort by: Most Likes">Sort by: Most Likes</option>
                <option value="Sort by: Least Likes">Sort by: Least Likes</option>
                <option value="Sort by: Ascending Alphabetical order">
                  Sort by: Ascending Alphabetical order
                </option>
                <option value="Sort by: Descending Alphabetical order">
                  Sort by: Descending Alphabetical order
                </option>
              </Form.Select>
            </Column>
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
                {
                  <Button.Light
                    onClick={() => {
                      this.globalFavoriteArray.push(thread.title);

                      localStorage.setItem(
                        'globalFavoriteArray',
                        JSON.stringify(this.globalFavoriteArray),
                      );
                    }}
                  >
                    ⭐️
                  </Button.Light>
                }
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
        <ThreadNew />
      </div>
    );
  }

  mounted() {
    if (this.favoriteArray) {
      this.globalFavoriteArray = JSON.parse(this.favoriteArray);
    }

    taskService.getAll().then((threads) => {
      if (this.searchText != '' && this.searchText != 'Search title') {
        this.threads = this.searchHitThreads;

        switch (this.sortToggle) {
          case 'Sort by: Most Likes':
            this.searchHitThreads.sort((a, b) => b.likes - a.likes);
            break;
          case 'Sort by: Least Likes':
            this.searchHitThreads.sort((a, b) => a.likes - b.likes);
            break;
          case 'Sort by: Ascending Alphabetical order':
            this.searchHitThreads.sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
            );
            break;
          case 'Sort by: Descending Alphabetical order':
            this.searchHitThreads.sort((a, b) =>
              a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1,
            );
            break;
          default:
            break;
        }
      } else {
        this.threads = threads;
        this.tempThreads = threads;

        switch (this.sortToggle) {
          case 'Sort by: Most Likes':
            this.threads.sort((a, b) => b.likes - a.likes);
            this.tempThreads.sort((a, b) => b.likes - a.likes);

            break;
          case 'Sort by: Least Likes':
            this.threads.sort((a, b) => a.likes - b.likes);
            this.tempThreads.sort((a, b) => a.likes - b.likes);
            break;
          case 'Sort by: Ascending Alphabetical order':
            this.threads.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
            this.tempThreads.sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
            );
            break;
          case 'Sort by: Descending Alphabetical order':
            this.threads.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1));
            this.tempThreads.sort((a, b) =>
              a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1,
            );
            break;
          default:
            break;
        }
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
      <div style={{ position: 'fixed', width: '100%', bottom: 0, left: 0, zIndex: 1 }}>
        <Card title="New thread">
          <Row>
            <Column width={5}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column width={5}>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={5}>
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
            <Column width={7}>
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

class Tags extends Component {
  threads: Thread[] = [];
  tags = [
    { tagTitle: 'Career', tagCount: 0 },
    { tagTitle: 'Entertainment', tagCount: 0 },
    { tagTitle: 'Food', tagCount: 0 },
    { tagTitle: 'Health', tagCount: 0 },
    { tagTitle: 'Lifestyle', tagCount: 0 },
    { tagTitle: 'Reading', tagCount: 0 },
    { tagTitle: 'Technology', tagCount: 0 },
  ];

  render() {
    return (
      <div>
        <Card title="Tags">
          <Row>
            <Column> Career: {this.tags[0].tagCount} </Column>
          </Row>
          <Row>
            <Column> Entertainment: {this.tags[1].tagCount}</Column>
          </Row>
          <Row>
            <Column> Food: {this.tags[2].tagCount}</Column>
          </Row>
          <Row>
            <Column> Health: {this.tags[3].tagCount}</Column>
          </Row>
          <Row>
            <Column> Lifestyle:{this.tags[4].tagCount} </Column>
          </Row>

          <Row>
            <Column> Reading: {this.tags[5].tagCount}</Column>
          </Row>
          <Row>
            <Column> Technology:{this.tags[6].tagCount} </Column>
          </Row>
        </Card>
      </div>
    );
  }
  mounted() {
    taskService.getAll().then((threads) => {
      this.threads = threads;

      for (let index = 0; index <= this.tags.length; index++) {
        this.threads.forEach((thread) => {
          if (thread.tag == this.tags[index].tagTitle) {
            this.tags[index].tagCount++;
          }
        });
      }
    });
  }
}

class Favorites extends Component {
  favoriteArray: string | null = localStorage.getItem('globalFavoriteArray');
  storedGlobalFavoriteArray: string[] = [];

  render() {
    return (
      <div>
        <Card title="Favorites">
          {this.favoriteArray
            ? this.storedGlobalFavoriteArray.map((thread) => (
                <Row>
                  <Column>{thread}</Column>

                  <Column>
                    {
                      <Button.Danger
                        onClick={() => {
                          let updatedArray = this.storedGlobalFavoriteArray.filter(
                            (element) => element !== thread,
                          );
                          localStorage.setItem('globalFavoriteArray', JSON.stringify(updatedArray));
                          window.location.reload();
                        }}
                      >
                        X
                      </Button.Danger>
                    }
                  </Column>
                </Row>
              ))
            : 'No favorite threads'}
        </Card>
      </div>
    );
  }

  mounted() {
    if (this.favoriteArray) {
      this.storedGlobalFavoriteArray = JSON.parse(this.favoriteArray);
      console.log(this.favoriteArray);
    }
  }
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <Menu />
      <Route exact path="/" component={TaskList} />
      <Route exact path="/categories" component={Tags} />
      <Route exact path="/favorites" component={Favorites} />
    </HashRouter>,
  );
