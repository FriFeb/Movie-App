const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
    },
    api: {
        apiKey: '59dd12cf642c9029deecd00d950fd3a6',
        apiUrl: 'https://api.themoviedb.org/3/',
    }
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

        div.innerHTML = ` 
            <a href="tv-details.html?id=${show.id}">
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

//  Returns pretty number (1000000 => 1.000.000)
function addDotsToNumber(string) {
    if (string.length > 3) {
        // Grab 3 last digits
        const right = '.' + string.slice(string.length - 3);

        // Grab the rest
        const left = string.slice(0, string.length - 3)

        return [addDotsToNumber(left) + right];
    }
    return string;
}

//  Displays movie details
async function showMovieDetails() {
    var movieID = document.location.search.split('=')[1];
    console.log(movieID);

    const movie = await fetchAPIData(`movie/${movieID}`);

    //  Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);


    const div = document.createElement('div');

    div.innerHTML = `
        <div class="details-top">
            <div>
                <img src="${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "../images/no-image.jpg"}"
                    class="card-img-top"
                    alt="${movie.title}">
            </div>

            <div>
                <h2>${movie.title}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(2)} / 10
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>${movie.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>

        <div class="details-bottom">
            <h2> Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> ${addDotsToNumber(movie.budget + '')}</li>
                <li><span class="text-secondary">Revenue:</span> ${addDotsToNumber(movie.revenue + '')}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies.map(company => company.name).join(', ')}</div>
        </div>
        `;

    document.querySelector('#movie-details').appendChild(div);
}

//  Displays tv show details
async function showTvShowDetails() {
    var showID = document.location.search.split('=')[1];

    const tvShow = await fetchAPIData(`tv/${showID}`);

    //  Overlay for background image
    displayBackgroundImage('tv', tvShow.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
        <div class="details-top">
            <div>
                <img src="${tvShow.poster_path
            ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
            : "../images/no-image.jpg"}"
                class="card-img-top"
                alt="${tvShow.title}">
            </div>
            <div>
            <h2>${tvShow.name}</h2>
            <p>
                <i class="fas fa-star text-primary"></i>
                ${tvShow.vote_average.toFixed(2)} / 10
            </p>
            <p class="text-muted">Release Date: ${tvShow.last_air_date}</p>
            <p>${tvShow.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${tvShow.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${tvShow.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${tvShow.number_of_episodes}</li>
            <li>
                <span class="text-secondary">Last Episode To Air:</span> ${tvShow.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${tvShow.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${tvShow.production_companies.map(company => company.name).join('')}</div>
        </div>
        `;

    document.querySelector('#show-details').appendChild(div);
}

//  Display backdrop on details page 
function displayBackgroundImage(type, path) {

    const overlayDiv = document.createElement('div');

    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`

    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.15';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

//  Search movie/tv show
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');

    if (global.search.term !== '' && global.search.term !== null) {
        const { results, total_pages, page } = await searchAPIData();

        if (!results.length) {
            showAlert('No results found');
            return;
        }

        showAlert('Results are found', 'success');
        displaySearchResults(results);

        document.querySelector('#search-item').value = '';
    } else {
        showAlert('Please enter a search item');
    }
}

function displaySearchResults(results) {
    results.forEach(result => {
        const div = document.createElement('div');

        div.classList.add('card');

        div.innerHTML = ` 
            <a href="${global.search.type}-details.html?id=${result.id}">
                <img src="${result.poster_path
                ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                : "../images/no-image.jpg"}"
                class="card-img-top"
                alt="${global.search.type === 'movie'
                ? result.title
                : result.name}">
            </a >
            <div class="card-body">
                <h5 class="card-title">${global.search.type === 'movie'
                ? result.title
                : result.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${global.search.type === 'movie'
                    ? result.release_date
                    : result.first_air_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#search-results').appendChild(div);
    });
}

//  Show error alert 
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));

    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000);
}

//  Display slider
async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing');

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');

        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            <img src="${movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "../images/no-image.jpg"}"
            class="card-img-top"
            alt="${movie.title}">
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(2)} / 10
        </h4>
        `;

        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnIteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}

//   Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

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

//   Make search request
async function searchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    showSpinner();

    const responce = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&query=${global.search.term}`, options);
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
            displaySlider();
            break;

        case '/movie-details.html':
            showMovieDetails()
            break;

        case '/search.html':
            search();
            break;

        case '/shows.html':
            addPopularTVShowsToDOM();
            break;

        case '/tv-details.html':
            showTvShowDetails()
            break;
    }

    highlightActiveCategory();
}

document.addEventListener('DOMContentLoaded', init);