import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Thread = {
  threadId: number;
  title: string;
  threadContent: string;
  likes: number;
  tag: string;
};

class TaskService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return axios.get<Thread>('/threads/' + id).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Thread[]>('/threads').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string) {
    return axios
      .post<{ threadId: number }>('/threads', { title: title })
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
