import { Response } from 'express';

export const transferResponse = (res: Response, response: any)=>{
  console.log(response)
  res.status(response.statusCode).json(response);
}
