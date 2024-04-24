// AWS Cognito configuration setup
const poolData = {
  UserPoolId: 'eu-west-3_OZP8ZMn8I', // e.g., us-east-1_example
  ClientId: 'jdegg88ohtqbcbt1p1a33vjot' // e.g., 2pm1l5exampleid23tp4v
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function showRegister() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'block';
  document.getElementById('verify-container').style.display = 'none';
}

function showLogin() {
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('verify-container').style.display = 'none';
}

function showVerification() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('verify-container').style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  authenticateUser(username, password);
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  registerUser(username, email, password);
});

document.getElementById('verificationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const code = document.getElementById('verifyCode').value;
  verifyUser(code);
});

function authenticateUser(username, password) {
  var authenticationData = {
      Username: username,
      Password: password
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userData = {
      Username: username,
      Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
          const accessToken = result.getAccessToken().getJwtToken();
          console.log('Access Token:', accessToken);
          localStorage.setItem('senderId', username); // Store senderId in Local Storage
          //alert('Login successful for ' + username);
          // Redirect to chat page or enable chat functionality
          window.location.href = '/index.html'; // Assuming chat page is index.html
      },
      onFailure: function(err) {
          alert(err.message || JSON.stringify(err));
      }
  });
}

function registerUser(username, email, password) {
  var attributeList = [];
  var dataEmail = {
      Name: 'email',
      Value: email
  };
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, function(err, result) {
      if (err) {
          alert(err.message || JSON.stringify(err));
          return;
      }
      cognitoUser = result.user;
      console.log('User name is ' + cognitoUser.getUsername());
      localStorage.setItem('username', cognitoUser.getUsername());
      showVerification(); // Show verification form
      alert('Registration successful. Please verify your account.');
  });
}

function verifyUser(code) {
  var userData = {
      Username: localStorage.getItem('username'), // Retrieve senderId for verification
      Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
          alert(err.message || JSON.stringify(err));
          return;
      }
      alert('Verification successful. You can now login.');
      showLogin(); // Redirect back to login
  });
}
