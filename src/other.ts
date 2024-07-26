import { setData } from './dataStore';
import { data } from './interface';
import { unlinkSync } from 'fs';

/**
 * Reset the state of the application back to the start.
 * @returns {{}} empty object
 */
function clear(): object {
  const dataStore: data = {
    users: [],
    quizzes: [],
    usersCreated: 0,
    quizzesCreated: 0,
    questionsCreated: 0,
    totalLogins: 0,
    trash: [],
    sessionsCreated: 0,
  };
  try {
    unlinkSync('backUp.txt');
  } catch (error) {}

  setData(dataStore);

  return {};
}

export { clear };
