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

class ThreadEditService {
  updateThread(id: number, threadContent: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Threads SET threadContent = ? WHERE threadId = ?',
        [threadContent, id],
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

const threadEditService = new ThreadEditService();
export default threadEditService;
