//posts droptdown button javascript
const dropdownBtns = document.querySelectorAll(".dropdown-menu");
dropdownBtns.forEach(dropdownBtn => {
  dropdownBtn.addEventListener("click", e => {
    if (e.target.children[0] !== undefined) {
      e.target.children[0].classList.toggle("show-dropdown");
    }
  });
});
// colse drop down when user clicks on anything else
window.onclick = e => {
  if (!e.target.matches(".dropdown-menu")) {
    const dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach(dropdown => {
      if (dropdown.classList.contains("show-dropdown")) {
        dropdown.classList.remove("show-dropdown");
      }
    });
  }
};

// deleteBtn functionality
const deleteBtns = document.querySelectorAll(".deleteBtn");
deleteBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();

    const url = window.location.href + "/delete/post";
    const postId = e.target.getAttribute("data-postID");

    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        location.href = "/dashboard";
      }
    };

    xhttp.send(`postId=${postId}`);
  });
});

// Like button ajax call
const likeBtn = document.querySelectorAll(".likeBtn");
const likesDisplay = document.querySelector(".heart");
likeBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    const url = window.location.href + "/new/like";
    const postId = e.target.getAttribute("data-postID");

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        //update ui
        let likeNum = parseFloat(likesDisplay.innerHTML);
        if (xhttp.response === "add") {
          likeNum++;
        } else {
          likeNum--;
        }
        likesDisplay.innerHTML = likeNum;
      }
    };

    xhttp.send(`postId=${postId}`);
  });
});

// Edit modal
const modal = document.querySelector(".editModal");
const editModelBtn = document.querySelectorAll(".editModelBtn");
const closeBtn = document.querySelector(".close");
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
