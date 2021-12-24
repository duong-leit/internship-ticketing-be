import { Response } from 'express';

export const transferResponse = (res: Response, response: any) => {
  res.status(response.statusCode).json(response);
};
