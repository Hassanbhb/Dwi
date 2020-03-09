//posts droptdown button javascript
const dropdownBtns = document.querySelectorAll(".dotsMenu");
dropdownBtns.forEach(dropdownBtn => {
  dropdownBtn.addEventListener("click", e => {
    dropdownBtn.nextSibling.classList.add("show-dropdown");
  });
});
// colse dropdown/mobile menu when user clicks on anything else
const main_header = document.querySelector(".main-header");
const nav_btn = document.querySelector(".nav-toggle");
window.onclick = e => {
  // for posts drop down
  if (!e.target.matches(".dotsMenu")) {
    const dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach(dropdown => {
      if (dropdown.classList.contains("show-dropdown")) {
        dropdown.classList.remove("show-dropdown");
      }
    });
  }
  // for mobile menu
  if (!e.target.matches(".main-header") && !e.target.matches(".nav-toggle")) {
    main_header.classList.remove("active");
  }
};

// keep postion after reload
document.addEventListener("DOMContentLoaded", function(event) {
  var scrollpos = sessionStorage.getItem("scrollpos");
  if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function(e) {
  sessionStorage.setItem("scrollpos", window.scrollY);
};

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

// Create a post
const postForm = document.querySelector(".createPost");
postForm.addEventListener("submit", e => {
  e.preventDefault();
  const postText = document.querySelector(".postTextArea").value;
  const data = `newPost=${postText}`;
  const url = window.location.href + "/new/post";
  ajaxFunction("POST", url, data, true);
});

// post size counter
const postTextArea = document.querySelector(".postTextArea");
const sizeDisplay = document.querySelector("span.size");
postTextArea.addEventListener("input", e => {
  const count = e.target.value;
  sizeDisplay.innerHTML = count.length;
  sizeDisplay.style.color = "green";
  if (count.length > 3000) {
    sizeDisplay.style.color = "red";
  }
});

// deleteBtn functionality
const deleteBtns = document.querySelectorAll(".deleteBtn");
deleteBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    let Id;
    let url;
    let method;
    if (e.target.getAttribute("data-post-Id")) {
      url = window.location.href + "/delete/post";
      Id = e.target.getAttribute("data-post-Id");
      method = "DELETE";
    } else {
      url = window.location.href + "/delete/comment";
      Id = e.target.getAttribute("data-Id");
      method = "PUT";
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        location.href = "/dashboard";
      }
    };

    xhttp.send(`postId=${Id}`);
  });
});

// Like button ajax call
const likeBtn = document.querySelectorAll(".likeBtn");
likeBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    const url = window.location.href + "/new/like";
    const postId =
      e.target.getAttribute("data-postID") ||
      e.target.parentNode.getAttribute("data-postID");
    console.log(postId);
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        location.reload();
      }
    };

    xhttp.send(`postId=${postId}`);
  });
});

//Comments toggle button
const commentsBtn = document.querySelectorAll(".comments-btn");
commentsBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    e.target.parentElement.parentElement.nextSibling.nextSibling.lastElementChild.classList.toggle(
      "comments-hide"
    );
  });
});

// Edit modal
const modal = document.querySelector(".editModal");
const editModelBtn = document.querySelectorAll(".editModelBtn");
const closeBtn = document.querySelector(".close-modal");
const hiddenInput = document.querySelector(".modelHiddenInput");
const textArea = document.querySelector(".editArea");

editModelBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const postId = e.target.getAttribute("data-postID");
    const postBody = e.target.getAttribute("data-postBody");
    hiddenInput.value = postId;
    textArea.value = postBody;

    modal.style.display = "block";
  });
});

closeBtn.addEventListener("click", e => {
  modal.style.display = "none";
});

// mobile menu display
nav_btn.addEventListener("click", e => {
  main_header.classList.toggle("active");
});

const message = document.querySelector(".message");
const message_body = document.querySelector(".message-body");
function messageDisplay(isError, msgObj, changeLocation) {
  if (isError) {
    message.classList.add("message-error");
    message.classList.remove("hide-message");
    setTimeout(function() {
      message.classList.add("hide-message");
    }, 5000);
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
      message_body.innerHTML = msgObj.success.body;
    }
  }
}
