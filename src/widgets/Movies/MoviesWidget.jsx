
import { useEffect, useState, useRef } from 'react';
import { useRemoveWidget } from '../../RemoveWidgetContext';
import './MoviesWidget.css';
import CloseIcon from '@mui/icons-material/Close';


const SEARCH_TERMS = [
  'man', 
  'star', 
  'life', 
  'day', 
  'night', 
  'war', 
  'girl', 
  'boy', 
  'world', 
  'king', 
  'dark', 
  'dream', 
  'city', 
  'road', 
  'family', 
  'future', 
  'game', 
  'power', 
  'secret', 
  'fire', 
  'water', 
  'sky', 
  'moon', 
  'sun', 
  'ring', 
  'code', 
  'robot', 
  'space', 
  'alien', 
  'hero', 
  'legend', 
  'ghost', 
  'dragon', 
  'magic', 
  'music', 
  'story',
  'superman', 
  'spiderman',
  'flash',
  'thor', 
  'mystery', 
  'crime', 
  'comedy', 
  'action',   
  'fantasy', 
  'horror', 
  'thriller', 
  'romance', 
  'animation', 
  'history', 
  'biography', 
  'documentary'
];

export default function MovieWidget({ movie: movieProp, setMovie: setMovieProp }) {
  const [movie, setMovie] = useState(movieProp || null);
  const removeWidget = useRemoveWidget();

  // Only fetch a new movie when the close button is clicked (widget removed and re-added)
  const fetchRandomMovie = async () => {
    try {
      const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
      const searchRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&type=movie&apikey=${'698d295e'}`);
      const searchData = await searchRes.json();
      if (searchData.Response === 'True' && Array.isArray(searchData.Search) && searchData.Search.length > 0) {
        const randomMovie = searchData.Search[Math.floor(Math.random() * searchData.Search.length)];
        const detailRes = await fetch(`https://www.omdbapi.com/?i=${randomMovie.imdbID}&apikey=${'698d295e'}`);
        const detailData = await detailRes.json();
        setMovie(detailData);
        if (setMovieProp) setMovieProp(detailData);
      } else {
        setMovie(null);
        if (setMovieProp) setMovieProp(null);
      }
    } catch {
      // Show mock movie data if API fails
      const mockMovie = {
        Title: 'October Sky',
        Year: '1999',
        Plot: 'The true story of Homer Hickam, a coal miner\'s son who was inspired by the launch of Sputnik 1 to take up rocketry against his father\'s wishes.',
        Director: 'Joe Johnston',
        imdbRating: '7.8',
        Poster: '/src/assets/blue-sky.jpg',
        Response: 'True',
      };
      setMovie(mockMovie);
      if (setMovieProp) setMovieProp(mockMovie);
    }
  };

  // On mount, use movieProp if present, otherwise fetch a random movie
  useEffect(() => {
    if (movieProp) {
      setMovie(movieProp);
    } else if (!movie) {
      fetchRandomMovie();
    }
    // Debug log
    if (movieProp) {
      console.log('Movie object from prop:', movieProp);
    }
    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="widget movies-widget" style={{ position: 'relative' }}>
      <button
        className="remove-widget circular-remove"
        onClick={async () => {
          await fetchRandomMovie();
          removeWidget();
        }}
        title="Remove"
      >
        <CloseIcon fontSize="small" style={{ color: '#fff' }} />
      </button>
      <h3>Movie</h3>
      <button
        className="next-movie-btn"
        onClick={fetchRandomMovie}
        title="Next Movie"
      >
        Next
      </button>
      {movie && movie.Response !== 'False' ? (
        <div className="movies-row">
          <img
            src={movie.Poster && movie.Poster !== 'N/A' && movie.Poster !== '' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image'}
            alt={movie.Title}
            style={{ marginTop: '0', width: '200px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150x220?text=No+Image'; }}
          />
          <div className="movies-info">
            <div className="movies-title">{movie.Title} ({movie.Year})</div>
            <div className="movies-plot">{movie.Plot}</div>
            <div className="movies-meta">Director: {movie.Director}</div>
            <div className="movies-meta">IMDB Rating: {movie.imdbRating}</div>
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}
