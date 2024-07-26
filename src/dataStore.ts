// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import { data as myData } from './interface';

let data: myData = {
  users: [],
  quizzes: [],
  usersCreated: 0,
  questionsCreated: 0,
  quizzesCreated: 0,
  totalLogins: 0,
  trash: [],
  sessionsCreated: 0,
};

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData(): myData {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: myData) {
  data = newData;
}

export { getData, setData };
