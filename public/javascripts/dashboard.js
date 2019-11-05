//droptdown button javascript
const dropdownBtns = document.querySelectorAll(".dropdown-menu");
dropdownBtns.forEach(dropdownBtn => {
  dropdownBtn.addEventListener("click", e => {
    e.target.children[0].classList.toggle("show-dropdown");
  });
});

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

// Like button javascript
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
