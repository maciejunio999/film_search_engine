document.getElementById("search-btn").addEventListener("click", async () => {
  const title = document.getElementById("movie-title").value.trim();
  const apiKey = "<klucz>";  // ← tutaj Twój klucz

  if (!title) {
    alert("Wpisz tytuł filmu.");
    return;
  }

  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const movieInfo = document.getElementById("movie-info");
    movieInfo.innerHTML = "";  // Czyścimy

    if (data.Response === "False") {
      movieInfo.textContent = "Nie znaleziono filmu.";
      return;
    }

    movieInfo.innerHTML = `
      <h2>${data.Title} (${data.Year})</h2>
      <p><strong>Gatunek:</strong> ${data.Genre}</p>
      <p><strong>Ocena IMDb:</strong> ${data.imdbRating}</p>
      <p><strong>Opis:</strong> ${data.Plot}</p>
      <img src="${data.Poster !== "N/A" ? data.Poster : ""}" alt="Plakat filmu" width="200" />
    `;

  } catch (error) {
    console.error("Błąd:", error);
    alert("Wystąpił problem przy pobieraniu danych.");
  }
});
