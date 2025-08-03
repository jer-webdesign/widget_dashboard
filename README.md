# Widget Dashboard
A modern, interactive dashboard built with React and Vite featuring drag-and-drop widgets with real-time data from various APIs. The dashboard provides a customizable interface for weather information, programming trivia, movie recommendations, and word definitions.
##  Features
### Available Widgets
####  Weather Widget
- **Functionality**: Displays current weather conditions including temperature, description, humidity, and wind speed
- **API Used**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Features**: 
  - Automatic geolocation detection
  - Fallback to manual city input
  - Real-time weather updates
  - Responsive design with weather icons

#### Programming Trivia Widget
- **Functionality**: Interactive programming questions with show/hide answers
- **API Used**: [Open Trivia Database (OpenTDB)](https://opentdb.com/api_config.php) - Computer Science category
- **Features**:
  - Multiple choice programming questions
  - Toggle answer visibility
  - Fallback questions for offline use
  - Question refresh functionality

#### Movies Widget
- **Functionality**: Random movie recommendations with detailed information
- **API Used**: [OMDb API (Open Movie Database)](http://www.omdbapi.com/)
- **Features**:
  - Random movie selection from curated list
  - Movie posters, plot summaries, ratings
  - Director and cast information
  - Fallback placeholder for missing images

#### Word Dictionary Widget
- **Functionality**: Word definitions, pronunciations, and usage examples
- **API Used**: [Free Dictionary API](https://dictionaryapi.dev/)
- **Features**:
  - Word search functionality
  - Multiple definitions and parts of speech
  - Pronunciation guides
  - Usage examples and synonyms

### Core Features
- **Drag & Drop Interface**: Intuitive widget placement and reordering
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Live API integration with fallback mechanisms
- **Customizable Layout**: 2x2 grid system with flexible widget positioning
- **Error Handling**: Graceful degradation when APIs are unavailable
- **Offline Support**: Fallback content for network issues

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Core functionality and API integration
- **React 19.1.0**: Component-based UI framework
- **Vite 7.0.4**: Fast build tool and development server
- **React DnD**: Drag and drop functionality
- **Material-UI Icons**: Icon components

## File Structure
```
widget_dashboard/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── widgets/
│   │   ├── Weather/
│   │   │   ├── WeatherWidget.jsx
│   │   │   └── WeatherWidget.css
│   │   ├── Trivia/
│   │   │   ├── TriviaWidget.jsx
│   │   │   └── TriviaWidget.css
│   │   ├── Movies/
│   │   │   ├── MoviesWidget.jsx
│   │   │   └── MoviesWidget.css
│   │   └── WordDict/
│   │       ├── WordDictWidget.jsx
│   │       └── WordDictWidget.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── RemoveWidgetContext.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Setup and Installation
### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jer-webdesign/widget_dashboard.git
   cd widget_dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   Create a `.env` file in the root directory for API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_OMDB_API_KEY=your_omdb_api_key
   ```
   *Note: The app includes fallback mechanisms and will work without API keys*

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Deployment and Hosting

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Automatic Deployment Setup

1. **Fork or clone the repository**
   ```bash
   git clone https://github.com/jer-webdesign/widget_dashboard.git
   ```

2. **Push to your GitHub repository**
   ```bash
   git remote set-url origin https://github.com/yourusername/widget_dashboard.git
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the source
   - The workflow will automatically trigger on pushes to main

4. **Access your deployed app**
   Your dashboard will be available at:
   ```
   https://yourusername.github.io/widget_dashboard/
   ```

#### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npm run deploy
```

### Configuration Files

The project includes pre-configured deployment files:

- **`.github/workflows/deploy.yml`**: GitHub Actions workflow
- **vite.config.js**: Vite configuration with proper base path
- **package.json**: Homepage URL and deploy scripts

## Development Process

### 1. Environment Setup
- Initialized Vite + React project
- Configured development environment with hot reload
- Set up ESLint for code quality

### 2. UI Component Design
- Designed responsive grid layout system
- Created reusable widget components
- Implemented drag-and-drop interface using React DnD

### 3. Component Development
- Built modular widget components
- Ensured responsive design across devices
- Implemented intuitive user interactions

### 4. Functionality Implementation
- Integrated multiple APIs with error handling
- Added drag-and-drop functionality
- Implemented state management for widget positioning

### 5. UI Styling
- Applied modern CSS with animations
- Implemented hover effects and transitions
- Created responsive breakpoints for all device sizes

### 6. Testing & Debugging
- Cross-browser compatibility testing
- Mobile responsiveness verification
- API error handling and fallback testing

### 7. Code Refinement
- Optimized component performance with React.memo
- Improved code organization and readability
- Added comprehensive error boundaries

## API Integration Details

### Weather Widget APIs
- **Primary**: OpenWeatherMap Current Weather API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Fallback**: Geolocation API for automatic location detection

### Trivia Widget APIs
- **Primary**: Open Trivia Database
- **Endpoint**: `https://opentdb.com/api.php?amount=1&category=18&type=multiple`
- **Fallback**: Built-in question bank for offline use

### Movies Widget APIs
- **Primary**: OMDb API
- **Endpoint**: `https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`
- **Fallback**: Curated movie ID list with error handling

### Dictionary Widget APIs
- **Primary**: Free Dictionary API
- **Endpoint**: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
- **Fallback**: User-friendly error messages

## Responsive Design

The dashboard supports three main breakpoints:

- **Desktop (>1024px)**: Full sidebar with 2x2 grid layout
- **Tablet (768px-1024px)**: Horizontal sidebar with 2x2 grid
- **Mobile (≤767px)**: Compact horizontal sidebar with 1x4 grid
