import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AxiosService {
  async get(path: string) {
    const result = await axios.get(`${process.env.TATUM_API_URL}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': String(process.env.TATUM_API_KEY),
      },
    });

    return result.data;
  }

  async post(path: string, payload: any, options?: any) {
    const headers = options
      ? { ...options }
      : { 'Content-Type': 'application/json' };
    headers['x-api-key'] = process.env.TATUM_API_KEY;
    const result = await axios.post(
      `${process.env.TATUM_API_URL}/${path}`,
      payload,
      {
        headers: headers,
      }
    );

    return result.data;
  }
}
