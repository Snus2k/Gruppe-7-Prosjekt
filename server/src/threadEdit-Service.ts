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

class ThreadEditService {}

const threadEditService = new ThreadEditService();
export default threadEditService;
