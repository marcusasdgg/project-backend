import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { adminAuthLogin, adminAuthRegister, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate } from './auth';
import {error} from './interface'
import { adminQuizCreate, adminQuizDescriptionUpdate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizRemove } from './quiz';
import {clear} from './other'

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const result = echo(req.query.echo as string);
  if ('error' in result) {
    res.status(400);
  }

  return res.json(result);
});

//Iteration 1 dependent routes.

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {

  const request = JSON.parse(req.body);
  const result = adminAuthRegister(request.email, request.password, request.nameFirst, request.nameLast)

  if ('error' in result){
    res.status(400);
  } else {
    res.status(200);
  }
  
  return res.json(result);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const request = JSON.parse(req.body);
  const result = adminAuthLogin(request.email, request.password);
  
  if ('error' in result){
    res.status(400);
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const sessionId = parseInt(JSON.parse(req.params.token).sessionId);
  const result = adminUserDetails(sessionId);
  if ('error' in result){
    res.status(401);
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const request = JSON.parse(req.body);
  const result = adminUserDetailsUpdate(request.token, request.email, request.nameFirst, request.nameLast);
  
  if ('error' in result){
    if (result.error === "invalid Token"){
      res.status(401);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const request = JSON.parse(req.body);
  const result = adminUserPasswordUpdate(parseInt(request.token), request.oldPassword, request.newPassword);

  if ('error' in result){
    if (result.error === "invalid Token"){
      res.status(401);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }

  return res.json(result);

});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const result = adminQuizList(token);

  if ('error' in result){
    res.status(401);
  } else {
    res.status(200);
  }

  return res.json(result);

});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const request = JSON.parse(req.body);
  const result = adminQuizCreate(parseInt(request.token), request.name, request.description);

  if ('error' in result){
    if (result.error === "invalid Token"){
      res.status(401);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const token = parseInt(req.query.token as string);

  const result = adminQuizRemove(token, quizId);
  
  if ('error' in result){
    if (result.error === 'invalid Token'){
      res.status(401);
    } else if (result.error === 'User does not own quiz'){
      res.status(403);
    }
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId as string);
    const token = parseInt(req.query.token as string);

    const result = adminQuizInfo(token, quizId);

    if ('error' in result){
      if (result.error === 'invalid Token'){
        res.status(401);
      } else if (result.error === 'User does not own quiz'){
        res.status(403);
      }
    } else {
      res.status(200);
    }

    return res.json(result);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const request = JSON.parse(req.body);

  const result = adminQuizNameUpdate(parseInt(request.token), quizId, request.name);

  if ('error' in result){
    if (result.error === 'invalid Token'){
      res.status(401);
    } else if (result.error === 'User does not own quiz'){
      res.status(403);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const request = JSON.parse(req.body);

  const result = adminQuizDescriptionUpdate(parseInt(request.token), quizId, request.description);

  if ('error' in result){
    if (result.error === 'invalid Token'){
      res.status(401);
    } else if (result.error === 'User does not own quiz'){
      res.status(403);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  clear();
  return res.status(200).json({});
});


//iteration 2 new routes
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.post('/v1/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.post('/v1/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.put('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.delete('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.put('/v1/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  return res.status(501).json({});
});

app.post('/v1/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  return res.status(501).json({});
});
// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
