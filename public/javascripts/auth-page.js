const signUp_btn = document.querySelector(".signup-btn");
const signUp_form = document.querySelector(".signup-form");
const signup_email = document.querySelector(".signup_email");
const login_btn = document.querySelector(".login-btn");
const login_form = document.querySelector(".login-form");
const message = document.querySelector(".message");
const message_title = document.querySelector(".message-title");
const message_body = document.querySelector(".message-body");
const msg_close_btn = document.querySelector(".close");

signUp_btn.addEventListener("click", e => {
  e.target.classList.add("active");
  login_btn.classList.remove("active");
  signUp_form.classList.remove("hide");
  login_form.classList.add("hide");
});

login_btn.addEventListener("click", e => {
  // btn background
  e.target.classList.add("active");
  signUp_btn.classList.remove("active");
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
  const result = EmailPattern.test(email);
  return result;
}

function passwordValidation(password) {
  const passwordRegex = /(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z]*([0-9#$-/:-?{-~!"^_`\[\]]))(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]*[a-zA-Z])[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]{4,}/;
  const result = passwordRegex.test(password);
  return result;
}

function messageDisplay(isError, msgObj) {
  if (isError) {
    message.classList.add("message-error");
    message.classList.remove("hide-message");
    setTimeout(function() {
      console.log("inter");
      message.classList.add("hide-message");
    }, 5000);
    message_title.innerHTML = msgObj.error.title;
    message_body.innerHTML = msgObj.error.body;
  } else {
    message.classList.add("message-success");
    message.classList.remove("hide-message");
    setTimeout(() => {
      message.classList.add("hide-message");
    }, 5000);
    message_title.innerHTML = "Welcome back!";
    message_body.innerHTML = "Have a nice day ❤";
    location.href = "/dashboard";
  }
}

function ajaxFunction(method, url, data) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open(method, url, true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status === 200) {
      const msgObj = JSON.parse(xmlHttp.response);
      const isError = msgObj.hasOwnProperty("error");
      messageDisplay(isError, msgObj);
    }
  };

  xmlHttp.send(data);
}

login_form.addEventListener("submit", e => {
  e.preventDefault();
  const login_email = document.querySelector(".login_email").value;
  const login_pwd = document.querySelector(".login_password").value;

  if (emailValidation(login_email) && passwordValidation(login_pwd)) {
    const url = window.location.href + "/login";
    const data = `email=${login_email}&password=${login_pwd}`;
    ajaxFunction("POST", url, data);
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
