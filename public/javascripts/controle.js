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

const delete_btns = document.querySelectorAll(".delete-post");
delete_btns.forEach(btn => {
  btn.addEventListener("click", e => {
    let url = window.location.origin + "/controle/delete";

    let Id = e.target.parentNode.getAttribute("data-postId");
    let method = "DELETE";

    const xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status === 200) {
        location.href = "/controle";
      }
    };

    xhttp.send(`postId=${Id}`);
  });
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
