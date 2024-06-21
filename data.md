```javascript
let data = {
    // TODO: insert your data structure that contains 
    // users + quizzes here
    users : [{firstName: "name1", 
        lastName: "name2",
        username: "name1.name2", 
        password: "psasword", 
        quizzesOwned: [{quizzId : 1}]
        userId: 1,
        email: "a@email.com", 
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 1,}],

    usersCreated: 1,
    
    quizzes: [{quizId: 1
        quizName: "hello Quiz"
        ownedByUser: 1
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',}],

    quizzesCreated: 1,
}
```
[Optional] short description: 
users is the field in the data object which is a list of
all user objects defined as having lastname, firstname, username etc. fields.
quizzes is the field in the data object which is a list of all quizz objects
which contain quizzname, quizzid, owned by which user etc.