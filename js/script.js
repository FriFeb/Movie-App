const global = {
    currentPage: window.location.pathname,
};

//  Displays 20 popular movies
async function addPopularMoviesToDOM() {
    const { results } = await fetchAPIData('movie/popular');

    const popularMovies = document.querySelector('#popular-movies');

    results.forEach(movie => {
        const div = document.createElement('div');

        div.classList.add('card');

        div.innerHTML = ` 
            <a href="movie-details.html?id=${movie.id}">
                <img src="${movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "../images/no-image.jpg"}"
                class="card-img-top"
                alt="${movie.title}">
            </a >
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
        `;

        popularMovies.appendChild(div);
    });
}

//  Displays 20 popular tv shows
async function addPopularTVShowsToDOM() {
    const { results } = await fetchAPIData('tv/popular');

    const popularShows = document.querySelector('#popular-shows');

    results.forEach(show => {
        const div = document.createElement('div');

        div.classList.add('card');
        console.log(show);

        div.innerHTML = ` 
            <a href="tv-details.html?id${show.id}">
                <img src="${show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : "../images/no-image.jpg"}"
                class="card-img-top"
                alt="${show.name}">
            </a >

            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Aired: ${show.first_air_date}</small>
                </p>
            </div>
        `;

        popularShows.appendChild(div);
    });
}

//   Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '59dd12cf642c9029deecd00d950fd3a6';
    const API_URL = 'https://api.themoviedb.org/3/';

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    showSpinner();

    const responce = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY} `, options);
    const data = await responce.json();

    hideSpinner();

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

//  Highlight actice category
function highlightActiveCategory() {
    const categories = document.querySelectorAll('.nav-link');

    categories.forEach((category) => {
        category.getAttribute('href') === global.currentPage
            ? category.classList.add('active')
            : category.classList.remove('active');
    });
}

//  Init app
function init() {
    switch (global.currentPage) {
        case '/index.html':
            addPopularMoviesToDOM();
            break;

        case '/movie-details.html':
            break;

        case '/search.html':
            break;

        case '/shows.html':
            addPopularTVShowsToDOM();
            break;

        case '/tv-details.html':
            break;
    }

    highlightActiveCategory();
}

document.addEventListener('DOMContentLoaded', init);