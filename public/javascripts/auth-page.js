const signup_display_btn = document.querySelector(".signup-btn");
const signUp_form = document.querySelector(".signup-form");
const login_display_btn = document.querySelector(".login-btn");
const login_form = document.querySelector(".login-form");
const message = document.querySelector(".message");
const message_title = document.querySelector(".message-title");
const message_body = document.querySelector(".message-body");
const msg_close_btn = document.querySelector(".close");

signup_display_btn.addEventListener("click", e => {
  e.target.classList.add("active");
  login_display_btn.classList.remove("active");
  signUp_form.classList.remove("hide");
  login_form.classList.add("hide");
});

login_display_btn.addEventListener("click", e => {
  // btn background
  e.target.classList.add("active");
  signup_display_btn.classList.remove("active");
  // form display
  signUp_form.classList.add("hide");
  login_form.classList.remove("hide");
});

msg_close_btn.addEventListener("click", e => {
  message.classList.add("hide-message");
});

// form validation
function emailValidation(email) {
  // RFC 5322 Official Standard
  const EmailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return EmailPattern.test(email);
}

function passwordValidation(password) {
  const passwordRegex = /(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z]*([0-9#$-/:-?{-~!"^_`\[\]]))(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]*[a-zA-Z])[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]{4,}/;
  return passwordRegex.test(password);
}

function comparePasswords(password_1, password_2) {
  return password_1 === password_2;
}

function usernameValidation(username) {
  // 4 to 21 characters, can have - and _
  const usernamePattern = /[a-zA-Z][a-zA-Z0-9-_]{3,20}/;
  return usernamePattern.test(username);
}

function messageDisplay(isError, msgObj, changeLocation) {
  if (isError) {
    message.classList.add("message-error");
    message.classList.remove("hide-message");
    setTimeout(function() {
      message.classList.add("hide-message");
    }, 5000);
    message_title.innerHTML = msgObj.error.title;
    message_body.innerHTML = msgObj.error.body;
  } else {
    if (changeLocation) {
      location.href = "/dashboard";
    } else {
      message.classList.add("message-success");
      message.classList.remove("hide-message");
      setTimeout(() => {
        message.classList.add("hide-message");
      }, 5000);
      message_title.innerHTML = msgObj.success.title;
      message_body.innerHTML = msgObj.success.body;
    }
  }
}

function ajaxFunction(method, url, data, changeLocation) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open(method, url, true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status === 200) {
      const msgObj = JSON.parse(xmlHttp.response);
      const isError = msgObj.hasOwnProperty("error");
      messageDisplay(isError, msgObj, changeLocation);
    }
  };

  xmlHttp.send(data);
}

// login form
login_form.addEventListener("submit", e => {
  e.preventDefault();
  const login_email = document.querySelector(".login_email").value;
  const login_pwd = document.querySelector(".login_password").value;

  if (emailValidation(login_email) && passwordValidation(login_pwd)) {
    const url = window.location.href + "/login";
    const data = `email=${login_email}&password=${login_pwd}`;
    ajaxFunction("POST", url, data, true);
  } else {
    if (!passwordValidation(login_pwd)) {
      messageDisplay(true, {
        error: {
          title: "Password Must have:",
          body: `4+ characters | 1+ digit or special char!`
        }
      });
    }
  }
});

// signup form
signUp_form.addEventListener("submit", e => {
  e.preventDefault();
  const signup_username = document.querySelector(".signup_username").value;
  const signup_email = document.querySelector(".signup_email").value;
  const signup_password = document.querySelector(".signup_password").value;
  const signup_confirm_pswd = document.querySelector(".signup_confirm_pswd")
    .value;
  if (
    emailValidation(signup_email) &&
    passwordValidation(signup_password) &&
    comparePasswords(signup_password, signup_confirm_pswd) &&
    usernameValidation(signup_username)
  ) {
    const url = window.location.href + "/register";
    const data = `username=${signup_username}&email=${signup_email}&password=${signup_password}&confirmPassword=${signup_confirm_pswd}`;
    ajaxFunction("POST", url, data);
    // TODO: change errors in server
  } else {
    if (!passwordValidation(signup_password)) {
      messageDisplay(true, {
        error: {
          title: "Password Must have:",
          body: `4+ characters | 1+ digit or special char!`
        }
      });
    } else if (!comparePasswords(signup_password, signup_confirm_pswd)) {
      messageDisplay(true, {
        error: {
          title: "Passwords do not match!",
          body: "Please confirm your password."
        }
      });
    } else if (!usernameValidation(signup_username)) {
      messageDisplay(true, {
        error: {
          title: "Username Must have:",
          body:
            "Must be 4 to 21 chars | first char is alpahbetic | can have - and _"
        }
      });
    }
  }
});
