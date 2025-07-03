const apiKey = "klucz"; // ← Wklej tutaj swój klucz
const apiBaseUrl = "http://www.omdbapi.com/";

document.getElementById("search-btn").addEventListener("click", () => {
  const title = document.getElementById("movie-title").value.trim();
  if (!title) {
    alert("Wpisz tytuł filmu.");
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
      displayMessage("Nie znaleziono filmu.");
    } else {
      displayMovie(data);
    }
  } catch (error) {
    console.error("Błąd:", error);
    displayMessage("Wystąpił błąd przy pobieraniu danych.");
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

  displayMessage("Nie udało się znaleźć losowego filmu. Spróbuj ponownie.");
}

function displayMovie(data) {
  const movieInfo = document.getElementById("movie-info");

  let posterHtml = "";
  if (data.Poster && data.Poster !== "N/A") {
    posterHtml = `<img src="${data.Poster}" alt="Plakat filmu" width="200" />`;
  }

  movieInfo.innerHTML = `
    <h2>${data.Title} (${data.Year})</h2>
    <p><strong>Gatunek:</strong> ${data.Genre}</p>
    <p><strong>Ocena IMDb:</strong> ${data.imdbRating}</p>
    <p><strong>Opis:</strong> ${data.Plot}</p>
    ${posterHtml}
  `;
}


function displayMessage(message) {
  const movieInfo = document.getElementById("movie-info");
  movieInfo.innerHTML = `<p>${message}</p>`;
}
