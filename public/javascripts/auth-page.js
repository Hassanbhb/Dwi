const signUp_btn = document.querySelector(".signup-btn");
const signUp_form = document.querySelector(".signup-form");
const login_btn = document.querySelector(".login-btn");
const login_form = document.querySelector(".login-form");

signUp_btn.addEventListener("click", e => {
  signUp_form.classList.remove("hide");
  login_form.classList.add("hide");
});

login_btn.addEventListener("click", e => {
  signUp_form.classList.add("hide");
  login_form.classList.remove("hide");
});
