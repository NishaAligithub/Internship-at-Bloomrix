function Movie(title, director, year) {
    this.id = Date.now() + Math.random().toString(36).substr(2, 9); // Unique identifier
    this.title = title;
    this.director = director;
    this.year = parseInt(year);
}

// Adding a method to the prototype chain to keep memory footprint low
Movie.prototype.getFormattedDetails = function() {
    return `${this.title} directed by ${this.director} (${this.year})`;
};

const MovieApp = {
    movies: [], // Array containing our Movie objects

    addMovie: function(title, director, year) {
        const newMovie = new Movie(title, director, year);
        this.movies.push(newMovie);
        this.updateUI();
    },

    removeMovie: function(id) {
        // Utilizing advanced array filtering method to remove the movie
        this.movies = this.movies.filter(movie => movie.id !== id);
        this.updateUI();
    },

    // Demonstrates use of map() and reduce() for measurement criteria
    calculateStats: function() {
        if (this.movies.length === 0) return "No movies in collection.";

        // Use map() to extract just the years into a new array
        const years = this.movies.map(movie => movie.year);
        
        // Use reduce() to find the oldest movie year
        const oldestYear = years.reduce((oldest, current) => current < oldest ? current : oldest, years[0]);

        return `Total Movies: ${this.movies.length} | Oldest Movie from: ${oldestYear}`;
    },

    updateUI: function() {
        const listContainer = document.getElementById('movie-list');
        const statsContainer = document.getElementById('movie-stats');
        
        // Clear old list items
        listContainer.innerHTML = '';

        // Utilizing forEach array method to generate HTML elements dynamically
        this.movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            card.innerHTML = `
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>Directed by ${movie.director} &bull; ${movie.year}</p>
                </div>
                <button class="delete-btn" data-id="${movie.id}">Remove</button>
            `;

            listContainer.appendChild(card);
        });

        // Update statistics display
        statsContainer.textContent = this.calculateStats();
    }
};

document.getElementById('movie-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop form from resetting the page

    // Grab input elements
    const titleInput = document.getElementById('title');
    const directorInput = document.getElementById('director');
    const yearInput = document.getElementById('year');

    // Call app method to add a new movie object to the state array
    MovieApp.addMovie(titleInput.value.trim(), directorInput.value.trim(), yearInput.value);

    // Reset UI form inputs cleanly
    this.reset();
    titleInput.focus();
});

// Event Delegation for Delete Buttons
document.getElementById('movie-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const movieId = e.target.getAttribute('data-id');
        MovieApp.removeMovie(movieId);
    }
});