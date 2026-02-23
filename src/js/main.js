"use strict"

import "../css/main.scss";
import Chart from "chart.js/auto";

// Justering mellan mörkt och ljust läge
let savedTheme = localStorage.getItem("theme");
let themeSwitch = document.getElementById("theme-toggle");

if (themeSwitch) {
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        themeSwitch.checked = true;
    } else if (savedTheme === "light") {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        themeSwitch.checked = false;
    }
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

if (menuButton && navBar) {
    menuButton.addEventListener("click", () => {
        navBar.classList.toggle("show");
    });
}

// Knapp för konfetti
let konfButton = document.querySelector(".button");
let confetti = document.querySelectorAll(".confetti");

if (konfButton && confetti.length) {
    konfButton.addEventListener("click", () => {
        confetti.forEach(el => {
            el.classList.add("show");
            el.style.animation = "none";
            el.offsetHeight;
            el.style.animation = null;
        });
    });
}


// Knapp åker iväg och kommer tillbaka
let swipeButton = document.querySelector(".button-2");

if (swipeButton) {
    swipeButton.addEventListener("click", () => {
        swipeButton.classList.remove("move");
        void swipeButton.offsetWidth;
        swipeButton.classList.add("move");
    });
}

// Skapande av stapeldiagram
let ansokningar = [];

async function getAnsokningar() {
    try {
        const response = await fetch("/ansokningar.json")

        if (!response.ok) {
            throw new Error("Det uppstod ett fel")
        }

        return await response.json();

    } catch(error) {
        console.error("Det uppstod ett fel", error.message);
        return [];
    }
}

// Fuktion som skapar stapeldiagram
function createStapelchart(data) {
    const canvas = document.getElementById("stapelChart")
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const topKurser = data
    .filter(item => item.type === "Kurs")
    .map(item => ({
        name: item.name,
        total: parseInt(item.applicantsTotal, 10) || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

    const stapelLabels = data.slice(0, 6).map(item => item.name);
    const stapelValues = data.slice(0, 6).map(item => item.total);

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: stapelLabels,
            datasets: [{
                label: "Antal sökande",
                data: stapelValues
            },],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

async function init() {
    console.log("init körs ✅");
    ansokningar = await getAnsokningar();
    createStapelchart(ansokningar);
}

init();