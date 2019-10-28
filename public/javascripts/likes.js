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
        let likeNum = parseFloat(likesDisplay.innerHTML);
        likeNum++;
        likesDisplay.innerHTML = likeNum;
      }
    };

    xhttp.send(`postId=${postId}`);
  });
});
