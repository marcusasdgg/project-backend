// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import {quiz, user, data} from "./interface"

let data: data = {users: [], quizzes: [], usersCreated: 0, quizzesCreated: 0, totalLogins: 0, trash: []};

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
function getData(): data {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData : data) {
  data = newData;
}



export { getData, setData};

