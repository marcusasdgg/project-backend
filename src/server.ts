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
import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './auth';

import {
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizInfo,
  adminQuizList,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizAddQuestion,
  adminQuizDuplicateQuestion,
  adminQuizQuestionDelete,
  adminQuizQuestionUpdate,
  adminQuizTransfer,
  adminQuizRestore,
  adminQuizQuestionMove,
  adminQuizTrashEmpty,
  adminQuizTrashList,
  adminQuizSessionStart,
  adminQuizSessionUpdate,
  adminQuizUpdateThumbnail,
  adminQuizFinalResults,
  adminQuizFinalResultsCSV,
  adminPlayerGuestJoin,
  adminQuizSessionStatus,
  adminPlayerStatus
} from './quiz';
import { clear } from './other';
import { setData, getData } from './dataStore';

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
app.get('/', (_req: Request, res: Response) => res.redirect('/docs'));
app.use(
  '/docs',
  sui.serve,
  sui.setup(YAML.parse(file), {
    swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' },
  })
);

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================
app.use((_req, _res, next) => {
  dataBaseBackUp();
  next();
});
// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const result = echo(req.query.echo as string);
  if ('error' in result) {
    res.status(400);
  }

  return res.json(result);
});

// Iteration 1 dependent routes.

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminAuthRegister(
      request.email,
      request.password,
      request.nameFirst,
      request.nameLast
    );
    res.status(200);
    return res.json({ token: result.sessionId.toString() });
  } catch (error) {
    return res.status(400).send(JSON.stringify({ error: error.message }));
  }
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminAuthLogin(request.email, request.password);
    res.status(200);
    return res.json({ token: result.sessionId.toString() });
  } catch (error) {
    return res.status(400).send(JSON.stringify({ error: error.message }));
  }
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const sessionId = parseInt(req.query.token as string);
  try {
    const result = adminUserDetails(sessionId);
    res.status(200);
    return res.json(result);
  } catch (error) {
    return res.status(401).send(JSON.stringify({ error: error.message }));
  }
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const sessionId = parseInt(req.header('token') as string);
  try {
    const result = adminUserDetails(sessionId);
    res.status(200);
    return res.json(result);
  } catch (error) {
    return res.status(401).send(JSON.stringify({ error: error.message }));
  }
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminUserDetailsUpdate(
      request.token,
      request.email,
      request.nameFirst,
      request.nameLast
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminUserDetailsUpdate(
      parseInt(req.header('token')),
      request.email,
      request.nameFirst,
      request.nameLast
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminUserPasswordUpdate(
      parseInt(request.token),
      request.oldPassword,
      request.newPassword
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminUserPasswordUpdate(
      parseInt(req.header('token')),
      request.oldPassword,
      request.newPassword
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const result = adminQuizList(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify(result));
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.header('token') as string);
  const result = adminQuizList(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify(result));
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const request = req.body;
  const result = adminQuizCreate(
    parseInt(request.token),
    request.name,
    request.description
  );

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify(result));
    } else {
      return res.status(400).send(JSON.stringify(result));
    }
  } else {
    res.status(200);
  }

  return res.json(result);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const request = req.body;
  const token = parseInt(req.headers.token as string); // Ensure correct header parsing
  const result = adminQuizCreate(
    token,
    request.name,
    request.description
  );

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify(result));
    } else {
      return res.status(400).send(JSON.stringify(result));
    }
  } else {
    return res.status(200).json(result); // Ensure the result is sent back
  }
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const result = adminQuizTrashList(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify({ error: result.error }));
  }

  return res.status(200).json(result.quizzes);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.header('token')as string);
  const result = adminQuizTrashList(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify({ error: result.error }));
  }

  return res.status(200).json(result.quizzes);
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const token = parseInt(req.query.token as string);
  const result = adminQuizRemove(token, quizId);

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'quizId is not owned by authUserId.') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.delete('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const token = parseInt(req.header('token') as string);
  const result = adminQuizRemove(token, quizId);

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'quizId is not owned by authUserId.') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    } else {
      return res.status(400).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const token = parseInt(req.query.token as string);
  const result = adminQuizInfo(token, quizId);

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'quizId is not owned by authUserId.') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.get('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId as string);
  const token = parseInt(req.header('token') as string);
  const result = adminQuizInfo(token, quizId);

  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'quizId is not owned by authUserId.') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.put('/v1/admin/quiz/:quizId/thumbnail', (req: Request, res: Response) => {
  const token = parseInt(req.header('token'));
  const quizId = parseInt(req.params.quizId as string);
  const ubrl = req.body.imgUrl;
  console.log('given ', token, req.body.token, quizId, ubrl);
  try {
    const result = adminQuizUpdateThumbnail(quizId, token, ubrl);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Token is empty or invalid (does not refer to valid logged in user session)') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else if (error.message === 'Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist') {
      return res.status(403).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const token = parseInt(req.body.token);
  const quizId = parseInt(req.params.quizId as string);
  const name = req.body.name;
  try {
    const result = adminQuizNameUpdate(token, quizId, name);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const token = parseInt(req.header('token'));
  const quizId = parseInt(req.params.quizId as string);
  const name = req.body.name;

  try {
    const result = adminQuizNameUpdate(token, quizId, name);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const token = parseInt(req.body.token);
  const quizId = parseInt(req.params.quizId as string);
  const description = req.body.description;

  try {
    const result = adminQuizDescriptionUpdate(token, quizId, description);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.put('/v2/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const token = parseInt(req.header('token'));
  const quizId = parseInt(req.params.quizId as string);
  const description = req.body.description;

  try {
    const result = adminQuizDescriptionUpdate(token, quizId, description);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.delete('/v1/clear', (_req: Request, res: Response) => {
  clear();
  return res.status(200).json({});
});

// iteration 2 new routes
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = parseInt(req.body.token as string);
  const result = adminAuthLogout(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify({ error: result.error }));
  }

  return res.status(200).json(result);
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = parseInt(req.header('token') as string);
  const result = adminAuthLogout(token);

  if ('error' in result) {
    return res.status(401).send(JSON.stringify({ error: result.error }));
  }

  return res.status(200).json(result);
});

app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = parseInt(req.body.token);
  try {
    const result = adminQuizRestore(token, quizId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else if (error.message === 'Quiz does not exist' || error.message === 'Quiz is not owned by the current user') {
      return res.status(403).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.post('/v2/admin/quiz/restore', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminQuizRestore(parseInt(req.header('token')), parseInt(request.quizId));
    res.status(200);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else if (error.message === 'user does not own quiz') {
      return res.status(403).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizIds = JSON.parse(req.query.quizIds as string);
  const result = adminQuizTrashEmpty(token, quizIds);
  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'Quiz ID is not owned by the current user') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    } else {
      return res.status(400).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = parseInt(req.header('token') as string);
  const quizIds = JSON.parse(req.query.quizIds as string);
  const result = adminQuizTrashEmpty(token, quizIds);
  if ('error' in result) {
    if (result.error === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: result.error }));
    } else if (result.error === 'Quiz ID is not owned by the current user') {
      return res.status(403).send(JSON.stringify({ error: result.error }));
    } else {
      return res.status(400).send(JSON.stringify({ error: result.error }));
    }
  }

  return res.status(200).json(result);
});

app.post('/v1/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const email = req.body.userEmail as string;
  const token = parseInt(req.body.token);
  try {
    const result = adminQuizTransfer(token, quizId, email);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'inalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else if (error.message === 'quizID does not exist' || error.message === 'Quiz is not owned by current user') {
      return res.status(403).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

// NEW ERROR CONDITION: IF ANY SESSION FOR THIS QUIZ IS NTO IN END STATE THEN ERROR
app.post('/v2/admin/quiz/transfer', (req: Request, res: Response) => {
  const request = req.body;
  try {
    const result = adminQuizTransfer(
      parseInt(req.header('token')),
      parseInt(request.quizId),
      request.UserEmail
    );
    res.status(200);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).send(JSON.stringify({ error: error.message }));
    } else if (error.message === 'user does not own quiz') {
      return res.status(403).send(JSON.stringify({ error: error.message }));
    } else {
      return res.status(400).send(JSON.stringify({ error: error.message }));
    }
  }
});

app.post('/v1/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = parseInt(req.body.token);
  const questionBody = req.body.questionBody;

  try {
    const result = adminQuizAddQuestion(token, quizId, questionBody);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.post('/v2/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = parseInt(req.header('token'));
  const questionBody = req.body.questionBody;

  try {
    const result = adminQuizAddQuestion(token, quizId, questionBody);
    return res.json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.put(
  '/v1/admin/quiz/:quizId/question/:questionId',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);

    const request = req.body;
    const token = parseInt(request.token);
    const questionBody = request.questionBody;
    try {
      const result = adminQuizQuestionUpdate(quizId, questionId, token, questionBody);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: error.message }));
      } else if (error.message === 'Quiz is not owned by the current user' || error.message === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: error.message }));
      } else {
        return res.status(400).send(JSON.stringify({ error: error.message }));
      }
    }
  }
);

app.put(
  '/v2/admin/quiz/:quizId/question/:questionId',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);

    const request = req.body;
    const token = parseInt(req.header('token'));
    const questionBody = request.questionBody;
    const thumbnnail = request.questionBody.thumbnailUrl;
    try {
      const result = adminQuizQuestionUpdate(quizId, questionId, token, questionBody, thumbnnail);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: error.message }));
      } else if (error.message === 'Quiz is not owned by the current user' || error.message === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: error.message }));
      } else {
        return res.status(400).send(JSON.stringify({ error: error.message }));
      }
    }
  }
);

app.delete(
  '/v1/admin/quiz/:quizId/question/:questionId',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);
    const token = parseInt(req.query.token as string);

    const result = adminQuizQuestionDelete(quizId, questionId, token);
    if ('error' in result) {
      if (result.error === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: result.error }));
      } else if (result.error === 'Quiz is not owned by the current user' || result.error === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: result.error }));
      } else {
        return res.status(400).send(JSON.stringify({ error: result.error }));
      }
    }

    return res.status(200).json(result);
  }
);

app.delete(
  '/v2/admin/quiz/:quizId/question/:questionId',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);
    const token = parseInt(req.header('token')as string);

    const result = adminQuizQuestionDelete(quizId, questionId, token);
    if ('error' in result) {
      if (result.error === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: result.error }));
      } else if (result.error === 'Quiz is not owned by the current user' || result.error === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: result.error }));
      } else {
        return res.status(400).send(JSON.stringify({ error: result.error }));
      }
    }

    return res.status(200).json(result);
  }
);

app.put(
  '/v1/admin/quiz/:quizId/question/:questionId/move',
  (req: Request, res: Response) => {
    const quidId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);
    const newPosition = parseInt(req.body.newPosition as string);
    const token = parseInt(req.body.token as string);

    const result = adminQuizQuestionMove(token, quidId, questionId, newPosition);

    if ('error' in result) {
      if (result.error === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: result.error }));
      } else if (result.error === 'Quiz is not owned by the current user' || result.error === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: result.error }));
      } else {
        return res.status(400).send(JSON.stringify({ error: result.error }));
      }
    }

    return res.status(200).json(result);
  }
);

app.put(
  '/v2/admin/quiz/:quizId/question/:questionId/move',
  (req: Request, res: Response) => {
    const quidId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);
    const newPosition = parseInt(req.body.newPosition as string);
    const token = parseInt(req.header('token')as string);

    const result = adminQuizQuestionMove(token, quidId, questionId, newPosition);

    if ('error' in result) {
      if (result.error === 'invalid Token') {
        return res.status(401).send(JSON.stringify({ error: result.error }));
      } else if (result.error === 'Quiz is not owned by the current user' || result.error === 'Quiz ID does not refer to a valid quiz') {
        return res.status(403).send(JSON.stringify({ error: result.error }));
      } else {
        return res.status(400).send(JSON.stringify({ error: result.error }));
      }
    }

    return res.status(200).json(result);
  }
);

app.post(
  '/v1/admin/quiz/:quizId/question/:questionId/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const token = parseInt(req.query.token as string);
    const questionId = parseInt(req.params.questionId);

    try {
      const result = adminQuizDuplicateQuestion(token, quizId, questionId);
      return res.json(result);
    } catch (error) {
      if (error.message === 'invalid Token') {
        return res.status(401).json({ error: error.message });
      } else if (error.message === 'User does not own quiz') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.post(
  '/v2/admin/quiz/:quizId/question/:questionId/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const token = parseInt(req.header('token'));
    const questionId = parseInt(req.params.questionId);

    try {
      const result = adminQuizDuplicateQuestion(token, quizId, questionId);
      return res.json(result);
    } catch (error) {
      if (error.message === 'invalid Token') {
        return res.status(401).json({ error: error.message });
      } else if (error.message === 'User does not own quiz') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.post(
  '/v1/admin/quiz/:quizId/session/start',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId as string);
    const token = parseInt(req.header('token'));
    const autonum = parseInt(req.body.autoStartNum);
    // add call

    try {
      const result = adminQuizSessionStart(token, quizId, autonum);
      return res.status(200).json({ sessionId: result });
    } catch (error) {
      if (error.message === 'Token is empty or invalid (does not refer to valid logged in user session)') {
        return res.status(401).json({ error: error.message });
      } else if (error.message === 'Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.put(
  '/v1/admin/quiz/:quizId/session/:sessionId',
  (req: Request, res: Response) => {
    const sessionId = parseInt(req.params.sessionId);
    const quizId = parseInt(req.params.quizId as string);
    const token = parseInt(req.header('token'));
    const action = req.body.action as string;
    // add call

    try {
      adminQuizSessionUpdate(quizId, sessionId, token, action);
      return res.status(200).json({});
    } catch (error) {
      if (error.message === 'Token is empty or invalid (does not refer to valid logged in user session)') {
        return res.status(403).json({ error: error.message });
      } else if (error.message === 'Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist') {
        return res.status(401).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.get(
  '/v1/admin/quiz/:quizid/session/:sessionid/results',
  (req: Request, res: Response) => {
    const token = parseInt(req.header('token'));
    const sessionId = parseInt(req.body.sessionId);
    const quizId = parseInt(req.params.quizId);

    try {
      const result = adminQuizFinalResults(token, sessionId, quizId);
      return res.json(result);
    } catch (error) {
      console.log('BRUH', error.message);
      if (error.message === 'invalid Token') {
        return res.status(401).json({ error: error.message });
      } else if (error.message === 'User does not own quiz') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.get(
  '/v1/admin/quiz/:quizid/session/:sessionid/results/csv',
  (req: Request, res: Response) => {
    const token = parseInt(req.header('token'));
    const sessionId = parseInt(req.body.sessionId);
    const quizId = parseInt(req.params.quizId);

    try {
      const result = adminQuizFinalResultsCSV(token, sessionId, quizId);
      return res.json(result);
    } catch (error) {
      if (error.message === 'invalid Token') {
        return res.status(401).json({ error: error.message });
      } else if (error.message === 'User does not own quiz') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
);

app.post(
  '/v1/player/join',
  (req: Request, res: Response) => {
    const sessionId = req.body.sessionId;
    const name = req.body.name;

    try {
      const result = adminPlayerGuestJoin(sessionId, name);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// adminquizsessionstatus server route below
app.get('/v1/admin/quiz/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const sessionId = parseInt(req.params.sessionId);
  const token = parseInt(req.header('token'));

  try {
    const result = adminQuizSessionStatus(token, quizId, sessionId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'invalid Token') {
      return res.status(401).json({ error: error.message });
    } else if (error.message === 'User does not own quiz') {
      return res.status(403).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
});

app.get('/v1/player/:playerId', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const result = adminPlayerStatus(playerId);

  if ('error' in result) {
    if (result.error === 'Player ID does not exist') {
      return res.status(400).json({ error: result.error });
    }
  }

  return res.status(200).json(result);
});

function circularReplacer() {
  const seen = new WeakSet();
  return (key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

function dataBaseBackUp() {
  const data = JSON.stringify(getData(), circularReplacer());
  fs.writeFileSync('./backUp.txt', data);
}

// setInterval(dataBaseBackUp, 3000);

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
  if (fs.existsSync('./backUp.txt')) {
    console.log('backkup exists');
    const data = fs.readFileSync('./backUp.txt', 'utf-8');
    setData(JSON.parse(data));
  }
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
