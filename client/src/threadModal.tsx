import React from 'react';
import axios from 'axios';
import { Card, Row, Column, Form, Button } from './widgets';
import { Thread } from './task-service';
import { TaskList } from './index';
import './threadModal.css';

interface Subthread {
  threadId: number;
  subthreadId: number;
  likes: number;
  subthreadContent: string;
}

interface ModalProps {
  thread?: Thread | null;
  show: boolean;
  onClose: () => void;
}

interface ModalState {
  subthreads: Subthread[] | null;
  error: string | null;
  subthreadContent: string;
}

export class Modal extends React.Component<ModalProps, ModalState> {
  state: ModalState = {
    subthreads: null,
    error: null,
    subthreadContent: '',
  };

  componentDidMount() {
    this.fetchSubthreads(this.props.thread.threadId);
  }

  fetchSubthreads(threadId: number) {
    axios
      .get(`/subthreads/${threadId}`)
      .then((response) => {
        this.setState({ subthreads: response.data, error: null });
      })
      .catch((error) => {
        this.setState({ error: error.message, subthreads: null });
      });
  }
  postToSubthread(subthreadContent: String, likes: number, threadId: number) {
    //Create comment
    axios
      .post(`/Subthreads/${threadId}`, {
        subthreadContent: subthreadContent,
        likes: likes,
        threadId: threadId,
      })
      .then((response) => {
        this.setState({ subthreads: this.fetchSubthreads(threadId), error: null });
      })
      .catch((error) => {
        this.setState({ error: error.message, subthreads: null });
      });
  }

  updateLikesOnServer(threadId: number, likes: number) {
    axios
      .patch(`/threads/${threadId}`, { likes })
      .then(() => {
        /*rerender her?*/
      })

      .catch((error) => {
        console.error(error);
      });
  }

  handleLikeDislike(isLike: boolean) {
    const { thread } = this.props;
    if (thread) {
      const updatedLikes = isLike ? thread.likes + 1 : thread.likes - 1;

      this.updateLikesOnServer(thread.threadId, updatedLikes);
    }
  }
  handleCommentLike(subthread: Subthread, isLike: boolean) {
    const updatedLikes = isLike ? subthread.likes + 1 : subthread.likes - 1;
    this.updateCommentLikesOnServer(subthread.subthreadId, updatedLikes, subthread.threadId);
  }
  updateCommentLikesOnServer(subthreadId: number, likes: number, threadId: number) {
    axios
      .patch(`/subthreads/${subthreadId}`, { likes })
      .then(() => {
        this.setState({ subthreads: this.fetchSubthreads(threadId), error: null });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    const content = this.props.thread ? (
      <div>
        <Card title={this.props.thread.title}>
          <Row>
            <p>{this.props.thread.threadContent}</p>
          </Row>
          <Row>
            <Column>
              <b>Likes: {this.props.thread.likes}</b>
            </Column>
            <Column>
              <Button.Light onClick={() => this.handleLikeDislike(true)}> 👍 </Button.Light>
              <Button.Light onClick={() => this.handleLikeDislike(false)}> 👎 </Button.Light>
            </Column>

            <Column>
              {' '}
              <Button.Danger
                onClick={() => {
                  axios.delete(`/threads/${this.props.thread.threadId}`).then(() => {
                    TaskList.instance()?.mounted();
                  });
                }}
              >
                Delete Post
              </Button.Danger>
            </Column>
          </Row>
        </Card>
        <Card title="New comment">
          <Row>
            <Column width={5}>
              <Form.Textarea
                value={this.state.subthreadContent}
                onChange={(event) => this.setState({ subthreadContent: event.currentTarget.value })}
              />
            </Column>
          </Row>

          <Button.Success
            onClick={() => {
              this.postToSubthread(this.state.subthreadContent, 0, this.props.thread.threadId);
              this.setState({ subthreadContent: '' });
            }}
          >
            Post
          </Button.Success>
        </Card>
        {this.state.subthreads ? (
          <div>
            <Card title="Comments:">
              {this.state.subthreads.map((subthread) => (
                <Row key={subthread.subthreadId}>
                  <Column>
                    <Card title="">
                      <p>{subthread.subthreadContent}</p>
                      <Column right={true}>
                        <b>Likes: {subthread.likes}</b>
                      </Column>
                      <Column>
                        <Button.Light onClick={() => this.handleCommentLike(subthread, true)}>
                          👍
                        </Button.Light>
                        <Button.Light onClick={() => this.handleCommentLike(subthread, false)}>
                          👎
                        </Button.Light>
                        <Button.Danger
                          small={true}
                          onClick={() =>
                            axios.delete(`/subthreads/${subthread.subthreadId}`).then(() => {
                              this.setState({
                                subthreads: this.fetchSubthreads(subthread.threadId),
                                error: null,
                              });
                            })
                          }
                        >
                          Delete Comment
                        </Button.Danger>
                      </Column>
                    </Card>
                  </Column>
                </Row>
              ))}
            </Card>
          </div>
        ) : this.state.error ? (
          <div>Error: {this.state.error}</div>
        ) : (
          <div>Loading comments...</div>
        )}
      </div>
    ) : (
      <div>No thread selected</div>
    );

    return (
      <div className="modal-overlay" onClick={this.props.onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {content}
          <Button.Danger onClick={this.props.onClose}>Close Thread</Button.Danger>
        </div>
      </div>
    );
  }
}
