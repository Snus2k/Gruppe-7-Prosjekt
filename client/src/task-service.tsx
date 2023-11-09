import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Thread = {
  threadId: number;
  title: string;
  threadContent: string;
  likes: number;
  tag: string;
};
export type subThread = {
  threadId: number;
  subthreadId: number;
  subthreadContent: string;
  likes: number;
};

class TaskService {
  /**
   * Get thread with given id.
   */
  get(threadId: number) {
    return axios.get<Thread>('/threads/' + threadId).then((response) => response.data);
  }

  /**
   * Get all threads.
   */
  getAll() {
    return axios.get<Thread[]>('/threads').then((response) => response.data);
  }

  getAllCommentsWhereId() {
    return axios.get<subThread[]>('/subthreads').then((response) => response.data);
  }

  /**
   * Create new thread having the given values.
   *
   * Resolves the newly created thread id.
   */
  create(title: string, content: string, likes: number, tag: string) {
    return axios
      .post<{ threadId: number }>('/threads', {
        title: title,
        likes: likes,
        content: content,
        tag: tag,
      })
      .then((response) => response.data.threadId);
  }

  createComment(content: string, likes: number, threadId: number) {
    return axios
      .post<{ threadId: number }>('/subthreads', {
        subthreadContent: content,
        likes: likes,
        threadId: threadId,
      })
      .then((response) => response.data.threadId);
  }

  /////////OPPGAVER////////////////
  delete(id: number) {
    return axios.delete(`/threads/${id}`);
  }

  patch(id: number) {
    return axios.patch(`/threads/${id}`).then((response) => response.data);
  }
}

const taskService = new TaskService();
export default taskService;
