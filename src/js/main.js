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
}

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


/**
 * Definierar datattyp och properties för funktionen
 * @typedef {Object} Ansokan
 * @property {string} name - Namn på kurs eller program
 * @property {string} type - Typ av utbildning ("Kurs" eller "Program")
 * @property {string} applicantsTotal - Totalt antal sökande
 */

/**
 * Hämta data från JSON-filen med async/await
 * 
 * @async
 * @returns {Promise<Ansokan[]>} - Promise som returnerar en array med ansökningar
 */
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


/**
 * Funktion som skapar ett stapeldiagram med de 6 mest ansökta kurserna på Mittuniversitetet
 * 
 * @param {Ansokan[]} data - En array med ansökningar
 * @returns {void} - Inget värde returneras
 */
function createStapelchart(data) {
    const canvas = document.getElementById("stapelChart")
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const topKurser = data
    .filter(item => item.type === "Kurs")
    .map(item => ({
        name: item.name,
        total: parseInt(String(item.applicantsTotal).trim(), 10) || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

    const stapelLabels = topKurser.map(item => item.name);
    const stapelValues = topKurser.map(item => item.total);

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


/**
 * Funktion som tar fram cirkeldiagram för de 6 mest ansökta programmen på Mittuniversitetet
 * 
 * @param {Ansokan[]} data - En array med ansökningar
 * @returns {void} - Returnerar inget värde
 */
function createCircleChart(data) {
    const canvasCircle = document.getElementById("circleChart")
    if (!canvasCircle) return;

    const existingChart = Chart.getChart(canvasCircle);
    if (existingChart) existingChart.destroy();

    const topProgram = data
    .filter(item => item.type === "Program")
    .map(item => ({
        name: item.name,
        total: parseInt(String(item.applicantsTotal).trim(), 10) || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
    
    const circleLabels = topProgram.map(item => item.name);
    const circleValues = topProgram.map(item => item.total);

    new Chart(canvasCircle, {
        type: "pie",
        data: {
            labels: circleLabels,
            datasets: [{
                label: "Antal sökande",
                data: circleValues
            },],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}


/**
 * Initerar funktionerna för att visa tabellerna
 * 
 * @async
 * @returns {Promise<void>} - Returnerar en promise utan värde
 */
async function init() {
    ansokningar = await getAnsokningar();
    createStapelchart(ansokningar);
    createCircleChart(ansokningar);
}

init();


// ===== KARTA (Nominatim + OSM iframe) =====
const mapForm = document.querySelector("main form");
const mapButton = document.getElementById("mapKnapp");
const userInput = document.getElementById("user-input");
const mapDiv = document.getElementById("map");
const errorP = document.getElementById("felmeddelande");

// Kör bara kartlogik om elementen finns på sidan
if (mapForm && userInput && mapDiv && errorP) {
  mapForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorP.textContent = "";

    const query = userInput.value.trim();
    if (!query) {
      errorP.textContent = "Skriv in en plats att söka på.";
      return;
    }

    try {
      const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(query);

      const response = await fetch(url, {
        headers: {
          "Accept-Language": "sv",
        },
      });

      if (!response.ok) {
        throw new Error("Kunde inte hämta platsdata.");
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Ingen plats hittades. Testa en annan sökning.");
      }

      const lat = Number(data[0].lat);
      const lon = Number(data[0].lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error("Fick ogiltiga koordinater från API:t.");
      }
      
      const zoom = 13;
      const iframeSrc =
        "https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=" +
        lat +
        "%2C" +
        lon +
        "&zoom=" +
        zoom;

      mapDiv.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="${iframeSrc}">
        </iframe>
      `;
    } catch (err) {
      errorP.textContent = err.message;
      console.error(err);
    }
  });
}