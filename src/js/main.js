"use strict"

import "../css/main.scss";

// Justering mellan mörkt och ljust läge
let savedTheme = localStorage.getItem("theme");
let themeSwitch = document.getElementById("theme-toggle");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    themeSwitch.checked = true;
}

if (savedTheme === "light") {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    themeSwitch.checked = false;
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light")
    }
});

// Meny för mindre enheter
let menuButton = document.getElementById('menu-nav');
let navBar = document.getElementById('nav-header');

menuButton.addEventListener('click', () => {
    navBar.classList.toggle("show");
});

// Knapp för konfetti
let konfButton = document.querySelector(".button");
let confetti = document.querySelectorAll(".confetti");

konfButton.addEventListener("click", () => {
    confetti.forEach(el => {
        el.classList.add("show");
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = null;
    });
});

// Knapp åker iväg och kommer tillbaka
let swipeButton = document.querySelector(".button-2");

swipeButton.addEventListener("click", () => {
  swipeButton.classList.remove("move");
  void swipeButton.offsetWidth;
  swipeButton.classList.add("move");
});