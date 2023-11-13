import React from 'react';
import axios from 'axios';
import { Card, Row, Column, Form, Button } from './widgets';
import { Thread } from './task-service';

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
      .post(`/Subthreads/${threadId}`)
      .then((response) => {
        this.setState({ subthreads: response.data, error: null });
      })
      .catch((error) => {
        this.setState({ error: error.message, subthreads: null });
      });
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    //console.log(this.props);

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
              <Button.Light onClick={() => {}}> 👍</Button.Light>
              <Button.Light onClick={() => {}}> 👎</Button.Light>
            </Column>
            <Column>
              <Button.Light onClick={() => {}}> ⭐️ </Button.Light>
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
          <Button.Danger onClick={this.props.onClose}>Close</Button.Danger>
        </div>
      </div>
    );
  }
}
