const allDivMovies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const inputSearch = document.querySelector('input');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');

let url = '/discover/movie?language=pt-BR&include_adult=false';
let currentPage = 0;

function fillMovies(movies) {
    allDivMovies.innerHTML = '';
    let startPage = currentPage * 6;
    let endPage = startPage + 1 * 6;
    const paginateMovies = movies.slice(startPage, endPage);

    for (const movie of paginateMovies) {
        const divCardMovie = document.createElement('div');
        divCardMovie.classList.add('movie');

        divCardMovie.style.backgroundImage = `url('${movie.poster_path}')`;
        allDivMovies.appendChild(divCardMovie);

        const infoMovie = document.createElement('div');
        infoMovie.classList.add('movie__info');
        divCardMovie.appendChild(infoMovie);

        const titleMovie = document.createElement('span');
        titleMovie.classList.add('movie__title');

        const voteAverageMovie = document.createElement('span');
        voteAverageMovie.classList.add('movie__rating');

        const starVoteAverageMovie = document.createElement('img');
        starVoteAverageMovie.src = './assets/estrela.svg';

        titleMovie.textContent = movie.title;
        voteAverageMovie.textContent = movie.vote_average;

        infoMovie.appendChild(titleMovie);
        infoMovie.appendChild(voteAverageMovie);
        voteAverageMovie.appendChild(starVoteAverageMovie);

        divCardMovie.addEventListener('click', () => {
            fillModal(movie.id);
        });
    }
}

async function loadMovies(url) {
    const response = await api.get(url);
    fillMovies((response.data.results));
}

loadMovies(url);

function paginateMovies() {
    btnNext.addEventListener('click', () => {
        if (currentPage === 2) {
            currentPage = 0;
        } else {
            currentPage++;
        }
        loadMovies(url);
    });

    btnPrev.addEventListener('click', () => {
        if (currentPage === 0) {
            currentPage = 2;
        } else {
            currentPage--;
        }
        loadMovies(url);
    });
}

paginateMovies();

function inputSearchMovie() {
    currentPage = 0;

    if (inputSearch.value) {
        loadMovies(url);
    }

    inputSearch.value = '';
}

inputSearch.addEventListener('keyup', (event) => {
    if (event.key !== 'Enter') {
        return;
    }
    url = `/search/movie?language=pt-BR&include_adult=false&query=${inputSearch.value}`;
    inputSearchMovie();
});

async function movieDay() {
    const response = await api.get('/movie/436969?language=pt-BR');
    const movie = response.data;

    const videoMovieDay = document.querySelector('.highlight__video');
    const titleMovieDay = document.querySelector('.highlight__title');
    const ratingMovieDay = document.querySelector('.highlight__rating');
    const genresMovieDay = document.querySelector('.highlight__genres');
    const launchMovieDay = document.querySelector('.highlight__launch');
    const overviewMovieDay = document.querySelector('.highlight__description');

    const date = new Date(movie.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    videoMovieDay.style.backgroundImage = `url('${movie.backdrop_path}')`;
    titleMovieDay.textContent = movie.title;
    ratingMovieDay.textContent = (movie.vote_average).toFixed(1);
    genresMovieDay.textContent = `${movie.genres[0].name}, ${movie.genres[1].name}, ${movie.genres[2].name}`;
    launchMovieDay.textContent = date;
    overviewMovieDay.textContent = movie.overview;
}

movieDay();

async function movieLink() {
    const response = await api.get('/movie/436969/videos?language=pt-BR');
    const movie = response.data;

    const linkVideo = document.querySelector('.highlight__video-link');
    const key = movie.results[1].key;

    linkVideo.href = `${'https://www.youtube.com/watch?v=' + key}`
}

movieLink();

async function fillModal(id) {
    modal.classList.remove('hidden');

    const response = await api.get(`/movie/${id}?language=pt-BR`);
    const movie = response.data;

    const titleModal = document.querySelector('.modal__title');
    const imgModal = document.querySelector('.modal__img');
    const overviewModal = document.querySelector('.modal__description');
    const voteAverageModal = document.querySelector('.modal__average');
    const genresModal = document.querySelector('.modal__genres');

    titleModal.textContent = movie.title;
    imgModal.src = movie.backdrop_path;
    overviewModal.textContent = movie.overview;
    voteAverageModal.textContent = (movie.vote_average).toFixed(1);
    genresModal.innerHTML = '';

    for (const genre of movie.genres) {
        const genreSpan = document.createElement('span');
        genreSpan.classList.add('modal__genre');
        genreSpan.textContent = genre.name;
        genresModal.appendChild(genreSpan);
    }

    modal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

function changeTheme() {
    const root = document.querySelector(':root');
    const btnTheme = document.querySelector('.btn-theme');

    btnTheme.addEventListener('click', () => {
        const logo = document.querySelector('.header__container-logo img');
        const currentBgColor = root.style.getPropertyValue('--background');
        const currentDivBgColor = root.style.getPropertyValue('--bg-secondary');
        const textColor = root.style.getPropertyValue('--text-color');

        if (currentBgColor === '#fff' || currentDivBgColor === '#ededed' || textColor === '#1b2028') {
            logo.src = '../assets/logo.svg';
            btnTheme.src = '../assets/dark-mode.svg';
            inputSearch.style.backgroundColor = '#3e434d';
            inputSearch.style.border = '1px solid #665f5f';

            root.style.setProperty('--background', '#1b2028');
            root.style.setProperty('--bg-secondary', '#2d3440');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--input-color', '#fff');
            btnNext.src = '../assets/arrow-right-light.svg';
            btnPrev.src = '../assets/arrow-left-light.svg';
            closeModal.src = '../assets/close.svg';
            return;
        }

        logo.src = '../assets/logo-dark.png';
        btnTheme.src = '../assets/light-mode.svg';
        inputSearch.style.backgroundColor = '#fff';
        inputSearch.style.border = '1px solid #979797';
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--bg-secondary', '#ededed');
        root.style.setProperty('--text-color', '#1b2028');
        root.style.setProperty('--input-color', '#979797');
        btnNext.src = '../assets/arrow-right-dark.svg';
        btnPrev.src = '../assets/arrow-left-dark.svg';
        closeModal.src = '../assets/close-dark.svg';
    });
}

changeTheme();