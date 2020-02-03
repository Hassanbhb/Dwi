const main_header = document.querySelector(".main-header");
const nav_btn = document.querySelector(".nav-toggle");
window.onclick = e => {
  if (!e.target.matches(".main-header") && !e.target.matches(".nav-toggle")) {
    main_header.classList.remove("active");
  }
};
// mobile menu display
nav_btn.addEventListener("click", e => {
  main_header.classList.toggle("active");
});

const myposts_btn = document.querySelector(".myPostsBtn");
const update_btn = document.querySelector(".updateBtn");
const mypostsDiv = document.querySelector(".myposts");
const profile_form = document.querySelector(".profile-form");
myposts_btn.addEventListener("click", e => {
  profile_form.classList.add("hide");
  mypostsDiv.classList.remove("hide");
});
update_btn.addEventListener("click", e => {
  profile_form.classList.remove("hide");
  mypostsDiv.classList.add("hide");
});

const message = document.querySelector(".message");
const message_title = document.querySelector(".message-title");
const message_body = document.querySelector(".message-body");
const msg_close_btn = document.querySelector(".close");
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
        message.classList.remove("message-success");
      }, 5000);
      message_title.innerHTML = msgObj.success.title;
      message_body.innerHTML = msgObj.success.body;
    }
  }
}
msg_close_btn.addEventListener("click", e => {
  message.classList.add("hide-message");
});

//Send the Updated data to server
const updateForm = document.querySelector(".profile-form");
updateForm.addEventListener("submit", e => {
  e.preventDefault();
  const url = window.location;
  const newUsername = document.querySelector("input[name='username']").value;
  const newEmail = document.querySelector("input[name='email']").value;
  const newPassword = document.querySelector("input[name='newPassword']").value;
  const ConfirmPassword = document.querySelector(
    "input[name='confirmPassword']"
  ).value;
  const data = `username=${newUsername}&email=${newEmail}&newPassword=${newPassword}&confirmPassword=${ConfirmPassword}`;
  const method = "PUT";
  const xhttp = new XMLHttpRequest();
  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status === 200) {
      const msgObj = JSON.parse(xhttp.response);
      console.log(msgObj);
      const isError = msgObj.hasOwnProperty("error");
      messageDisplay(isError, msgObj, false);
    }
  };
  xhttp.send(data);
});

// Post content toggle

const showBtns = document.querySelectorAll(".actions > div > img");
showBtns.forEach(showBtn => {
  showBtn.addEventListener("click", e => {
    e.target.parentElement.parentElement.parentElement.nextSibling.classList.toggle(
      "hide"
    );
  });
});

// Delete post in the profile
const delete_btns = document.querySelectorAll(".delete-post");
delete_btns.forEach(delete_btn => {
  delete_btn.addEventListener("click", e => {
    e.preventDefault();
    let url = window.location.origin + "/dashboard/delete/post";
    let Id = e.target.parentNode.getAttribute("data-postId");
    let method = "DELETE";

    const xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        location.href = "/profile";
      }
    };

    xhttp.send(`postId=${Id}`);
  });
});
