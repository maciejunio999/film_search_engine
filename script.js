const apiKey = "<key>"; // ← Your key
const apiBaseUrl = "http://www.omdbapi.com/";

document.getElementById("search-btn").addEventListener("click", () => {
  const title = document.getElementById("movie-title").value.trim();
  if (!title) {
    alert(langPL ? "Wpisz tytuł filmu." : "Enter a movie title.");
    return;
  }
  fetchMovieByTitle(title);
});

document.getElementById("random-btn").addEventListener("click", () => {
  fetchRandomMovieByID();
});

async function fetchMovieByTitle(title) {
  const url = `${apiBaseUrl}?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "False") {
      displayMessage(langPL ? "Nie znaleziono filmu." : "Movie not found.");
    } else {
      displayMovie(data);
    }
  } catch (error) {
    console.error("Błąd:", error);
    displayMessage(langPL ? "Błąd podczas pobierania danych." : "Error fetching data.");
  }
}

async function fetchRandomMovieByID() {
  const maxAttempts = 10;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const randomNumber = Math.floor(Math.random() * 9999999) + 1;
    const imdbID = `tt${randomNumber.toString().padStart(7, "0")}`;
    const url = `${apiBaseUrl}?i=${imdbID}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True" && data.Type === "movie") {
        displayMovie(data);
        return;
      }
    } catch (e) {
      console.warn("Błąd przy próbie:", imdbID, e);
    }

    attempt++;
  }

  displayMessage(langPL ? "Nie udało się znaleźć losowego filmu." : "Couldn't find a random movie.");
}

function displayMovie(data) {
  const movieInfo = document.getElementById("movie-info");

  let posterHtml = "";
  if (data.Poster && data.Poster !== "N/A") {
    posterHtml = `<img src="${data.Poster}" alt="Plakat filmu" width="200" />`;
  }

  movieInfo.innerHTML = `
    <h2>${data.Title} (${data.Year})</h2>
    <p><strong>${langPL ? "Gatunek" : "Genre"}:</strong> ${data.Genre}</p>
    <p><strong>${langPL ? "Ocena IMDb" : "IMDb Rating"}:</strong> ${data.imdbRating}</p>
    <p><strong>${langPL ? "Opis" : "Plot"}:</strong> ${data.Plot}</p>
    ${posterHtml}
  `;
}

function displayMessage(message) {
  const movieInfo = document.getElementById("movie-info");
  movieInfo.innerHTML = `<p>${message}</p>`;
}

let langPL = true;

document.getElementById("toggle-lang").addEventListener("click", () => {
  langPL = !langPL;

  document.getElementById("main-title").textContent = langPL
    ? "Wyszukiwarka filmów (OMDb API)"
    : "Movie Finder (OMDb API)";

  document.getElementById("search-btn").textContent = langPL ? "Szukaj" : "Search";
  document.getElementById("random-btn").textContent = langPL ? "Losuj film" : "Random Movie";
  document.getElementById("movie-title").placeholder = langPL
    ? "Wpisz tytuł filmu"
    : "Enter movie title";

  const flagIcon = document.getElementById("flag-icon");
  flagIcon.src = langPL
    ? "https://flagcdn.com/gb.svg"
    : "https://flagcdn.com/pl.svg";
  flagIcon.alt = langPL ? "Flag of UK" : "Flaga Polski";

  const movieInfo = document.getElementById("movie-info");
  if (movieInfo.innerHTML.includes("Gatunek") || movieInfo.innerHTML.includes("Genre")) {
    const currentTitle = document.querySelector("#movie-info h2")?.textContent;
    if (currentTitle) {
      const title = currentTitle.split(" (")[0];
      fetchMovieByTitle(title);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("theme-switch");
  if (themeSwitch) {
    themeSwitch.addEventListener("change", (e) => {
      document.body.classList.toggle("contrast", e.target.checked);
    });
  }
});
