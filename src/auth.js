
// Function: adminAuthLogin
function adminAuthLogin(email, password) {

  return {
    authUserId: 1,
  };
}

//Function: adminAuthRegister
function adminAuthRegister(email, password, nameFirst, nameLast) {

  return {
    authUserId: 1
  }
}
  


// Function: adminUserDetails
function adminUserDetails(authUserId) {

  return {
    user: {
      userId: 1,
      name: 'Hayden Smith',
      email: 'hayden.smith@unsw.edu.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
    },
  };
}

// Function: adminUserDetailsUpdate
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
  return {

  }
}

function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  return {

  }
}