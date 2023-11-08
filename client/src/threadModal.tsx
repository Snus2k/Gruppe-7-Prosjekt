import React from 'react';
import axios from 'axios';
import { Card } from './widgets';
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
}

export class Modal extends React.Component<ModalProps, ModalState> {
  state: ModalState = {
    subthreads: null,
    error: null,
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

  render() {
    if (!this.props.show) {
      return null;
    }
    console.log(this.props);

    const content = this.props.thread ? (
      <div>
        <h1>{this.props.thread.title}</h1>
        {this.state.subthreads ? (
          <Card title="Comments">
            {this.state.subthreads.map((subthread) => (
              <div key={subthread.subthreadId}>
                <h3>{subthread.likes}</h3>
                <p>{subthread.subthreadContent}</p>
              </div>
            ))}
          </Card>
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
          <button onClick={this.props.onClose}>Close</button>
        </div>
      </div>
    );
  }
}