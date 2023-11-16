import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Thread = {
  threadId: number;
  title: string;
  threadContent: string;
  likes: number;
  tag: string;
};

export type Subthread = {
  threadId: number;
  subthreadId: number;
  likes: number;
  subthreadContent: string;
};

class TaskService {
  get(id: number) {
    return new Promise<Thread | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Threads WHERE id = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Thread);
      });
    });
  }
  getSubthreads(id: number): Promise<Subthread[]> {
    return new Promise<Subthread[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Subthreads WHERE threadId = ?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) {
            return reject(error);
          }

          resolve(results as Subthread[]);
        },
      );
    });
  }

  /**
   * Get all subthreads.
   */
  getAll() {
    return new Promise<Thread[]>((resolve, reject) => {
      pool.query('SELECT * FROM Threads', [], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Thread[]);
      });
    });
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string, content: string, likes: number, tag: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Threads SET title=?, threadContent=?, likes=?, tag=?',
        [title, content, likes, tag],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        },
      );
    });
  }
  createComment(content: string, likes: number, threadId: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Subthreads (subthreadContent, likes, threadId) VALUES (?, ?, ?)',
        [content, likes, threadId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        },
      );
    });
  }

  /**
   * Delete thread with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Threads WHERE threadId = ?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No row deleted'));
          resolve();
        },
      );
    });
  }
  deleteComment(subthreadId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Subthreads WHERE subthreadId = ?',
        [subthreadId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error('No row deleted'));
          resolve();
        },
      );
    });
  }

  patch(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('UPDATE Threads SET done = NOT done WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);
        else resolve();
      });
    });
  }

  updateLikes(id: number, likes: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Threads SET likes = ? WHERE threadId = ?',
        [likes, id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve();
        },
      );
    });
  }

  updateCommentLikes(id: number, likes: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Subthreads SET likes = ? WHERE subthreadId = ?',
        [likes, id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve();
        },
      );
    });
  }
}

const taskService = new TaskService();
export default taskService;
