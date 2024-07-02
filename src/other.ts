import {setData} from "./dataStore"
import { data } from "./interface"

/**
 * Reset the state of the application back to the start.
 * @returns {{}} empty object 
 */
function clear() : {} {
  
  const dataStore : data =  {
    users: [],
    quizzes: [],
    usersCreated: 0,
    quizzesCreated: 0,
    totalLogins: 0,
  }

  setData(dataStore);

  return {}
}

export {clear}