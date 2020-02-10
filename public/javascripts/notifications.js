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

function ajaxFunction(method, url, data, changeLocation) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open(method, url, true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status === 200) {
      location.href = "/notifications";
    }
  };

  xmlHttp.send(data);
}

// delete notification
const deleteNotif_btns = document.querySelectorAll(".deleteNotif > img");
deleteNotif_btns.forEach(btn => {
  btn.addEventListener("click", e => {
    const url = window.location.href;
    const data = `notifID=${e.target.getAttribute("data-id")}`;
    ajaxFunction("DELETE", url, data);
  });
});
