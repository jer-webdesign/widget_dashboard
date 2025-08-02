import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WeatherWidget from './widgets/Weather/WeatherWidget';
import { RemoveWidgetProvider } from './RemoveWidgetContext';
import TriviaWidget from './widgets/Trivia/TriviaWidget';
import WordDictWidget from './widgets/WordDict/WordDictWidget';
import MoviesWidget from './widgets/Movies/MoviesWidget';
import './App.css';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ArticleIcon from '@mui/icons-material/Article';
import React, { useRef } from 'react';

// Memoize all widgets to prevent unnecessary re-renders
const MemoizedWeatherWidget = React.memo(WeatherWidget);
const MemoizedTriviaWidget = React.memo(TriviaWidget);
const MemoizedWordDictWidget = React.memo(WordDictWidget);
const MemoizedMoviesWidget = React.memo(MoviesWidget);

function App() {
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  const [moviesBySlot, setMoviesBySlot] = useState([null, null, null, null]);
  const [weatherBySlot, setWeatherBySlot] = useState([null, null, null, null]);
  const [triviaBySlot, setTriviaBySlot] = useState([null, null, null, null]);
  const [triviaInitialized, setTriviaInitialized] = useState([false, false, false, false]);
  const [triviaShowAnswer, setTriviaShowAnswer] = useState([false, false, false, false]);
  const [wordDataBySlot, setWordDataBySlot] = useState([null, null, null, null]);
  
  window.dashboardWidgetsState = dashboardWidgets.filter(Boolean);
  
  const availableWidgets = [
    { id: 'weather', name: 'Weather', component: WeatherWidget },
    { id: 'trivia', name: 'Programming Trivia', component: TriviaWidget },
    { id: 'worddict', name: 'Word Dictionary', component: WordDictWidget },
    { id: 'movies', name: 'Movies', component: MoviesWidget },
  ];

  function handleDrop(widgetId) {
    if (!dashboardWidgets.includes(widgetId)) {
      setDashboardWidgets([...dashboardWidgets, widgetId]);
    }
  }

  function handleRemove(idx) {
    const newWidgets = [...dashboardWidgets];
    newWidgets[idx] = undefined;
    setDashboardWidgets(newWidgets);
    setMoviesBySlot(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    setWeatherBySlot(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    setTriviaBySlot(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    setTriviaInitialized(prev => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
    setTriviaShowAnswer(prev => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
    setWordDataBySlot(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
  }

  function moveWidget(dragIndex, hoverIndex) {
    const updated = [...dashboardWidgets];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setDashboardWidgets(updated);
    setMoviesBySlot(prev => {
      const arr = [...prev];
      const [movie] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, movie);
      return arr;
    });
    setWeatherBySlot(prev => {
      const arr = [...prev];
      const [weather] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, weather);
      return arr;
    });
    setTriviaBySlot(prev => {
      const arr = [...prev];
      const [trivia] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, trivia);
      return arr;
    });
    setTriviaInitialized(prev => {
      const arr = [...prev];
      const [initialized] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, initialized);
      return arr;
    });
    setTriviaShowAnswer(prev => {
      const arr = [...prev];
      const [showAnswer] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, showAnswer);
      return arr;
    });
    setWordDataBySlot(prev => {
      const arr = [...prev];
      const [wordData] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, wordData);
      return arr;
    });
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <RemoveWidgetProvider onRemove={handleRemove}>
        <div className="dashboard-container">
          <aside className="sidebar">
            <h2>Dashboard</h2>
            <ul>
              {availableWidgets.map(w => (
                <SidebarWidget key={w.id} widget={w} />
              ))}
            </ul>
          </aside>
          <main className="dashboard">
            <DashboardGrid
              dashboardWidgets={dashboardWidgets}
              setDashboardWidgets={setDashboardWidgets} 
              availableWidgets={availableWidgets}
              moveWidget={moveWidget}
              handleRemove={handleRemove}
              handleDrop={handleDrop}
              moviesBySlot={moviesBySlot}
              setMoviesBySlot={setMoviesBySlot}
              weatherBySlot={weatherBySlot}
              setWeatherBySlot={setWeatherBySlot}
              triviaBySlot={triviaBySlot}
              setTriviaBySlot={setTriviaBySlot}
              triviaInitialized={triviaInitialized}
              setTriviaInitialized={setTriviaInitialized}
              triviaShowAnswer={triviaShowAnswer}
              setTriviaShowAnswer={setTriviaShowAnswer}
              wordDataBySlot={wordDataBySlot}
              setWordDataBySlot={setWordDataBySlot}
            />
          </main>
        </div>
      </RemoveWidgetProvider>
    </DndProvider>
  );
}

// DashboardGrid: drop target for sidebar widgets
function DashboardGrid({
  dashboardWidgets,
  setDashboardWidgets,  
  availableWidgets,
  moveWidget,
  handleRemove,
  handleDrop,
  moviesBySlot,
  setMoviesBySlot,
  weatherBySlot,
  setWeatherBySlot,
  triviaBySlot,
  setTriviaBySlot,
  triviaInitialized,
  setTriviaInitialized,
  triviaShowAnswer,
  setTriviaShowAnswer,
  wordDataBySlot,
  setWordDataBySlot
}) {
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const slots = [0, 1, 2, 3].map(pos => {
    const widgetId = dashboardWidgets[pos];
    let widgetClass = '';
    let slotClass = '';
    if (pos === 0) slotClass = 'weather-slot';
    if (pos === 1) slotClass = 'trivia-slot';
    if (pos === 2) slotClass = 'movies-slot';
    if (pos === 3) slotClass = 'worddict-slot';
    if (widgetId === 'weather') widgetClass = 'widget weather-widget';
    else if (widgetId === 'trivia') widgetClass = 'widget trivia-widget';
    else if (widgetId === 'movies') widgetClass = 'widget movies-widget';
    else if (widgetId === 'worddict') widgetClass = 'widget worddict-widget';

    return (
      <DashboardSlot
        key={pos}
        pos={pos}
        widgetId={widgetId}
        slotClass={slotClass}
        widgetClass={widgetClass}
        dashboardWidgets={dashboardWidgets}
        setDashboardWidgets={setDashboardWidgets}
        moveWidget={moveWidget}
        handleRemove={handleRemove}
        moviesBySlot={moviesBySlot}
        setMoviesBySlot={setMoviesBySlot}
        weatherBySlot={weatherBySlot}
        setWeatherBySlot={setWeatherBySlot}
        triviaBySlot={triviaBySlot}
        setTriviaBySlot={setTriviaBySlot}
        triviaInitialized={triviaInitialized}
        setTriviaInitialized={setTriviaInitialized}
        triviaShowAnswer={triviaShowAnswer}
        setTriviaShowAnswer={setTriviaShowAnswer}
        wordDataBySlot={wordDataBySlot}
        setWordDataBySlot={setWordDataBySlot}
      />
    );
  });

  return (
    <div className="dashboard-grid">
      {slots}
    </div>
  );
}

// New component to handle individual slot logic
function DashboardSlot({
  pos,
  widgetId,
  slotClass,
  widgetClass,
  dashboardWidgets,
  setDashboardWidgets,
  moveWidget,
  handleRemove,
  moviesBySlot,
  setMoviesBySlot,
  weatherBySlot,
  setWeatherBySlot,
  triviaBySlot,
  setTriviaBySlot,
  triviaInitialized,
  setTriviaInitialized,
  triviaShowAnswer,
  setTriviaShowAnswer,
  wordDataBySlot,
  setWordDataBySlot
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ['WIDGET', 'DASHBOARD_WIDGET'],
    drop: (item) => {
      if (!dashboardWidgets[pos]) {
        const newWidgets = [...dashboardWidgets];
        if (item.index !== undefined) {
          newWidgets[item.index] = undefined;
          if (item.id === 'movies') {
            setMoviesBySlot(prev => {
              const arr = [...prev];
              const [movie] = arr.splice(item.index, 1);
              arr.splice(pos, 0, movie);
              return arr;
            });
          }
          if (item.id === 'weather') {
            setWeatherBySlot(prev => {
              const arr = [...prev];
              const [weather] = arr.splice(item.index, 1);
              arr.splice(pos, 0, weather);
              return arr;
            });
          }
          if (item.id === 'trivia') {
            setTriviaBySlot(prev => {
              const arr = [...prev];
              const [trivia] = arr.splice(item.index, 1);
              arr.splice(pos, 0, trivia);
              return arr;
            });
            setTriviaInitialized(prev => {
              const arr = [...prev];
              const [initialized] = arr.splice(item.index, 1);
              arr.splice(pos, 0, initialized);
              return arr;
            });
            setTriviaShowAnswer(prev => {
              const arr = [...prev];
              const [showAnswer] = arr.splice(item.index, 1);
              arr.splice(pos, 0, showAnswer);
              return arr;
            });
          }
          if (item.id === 'worddict') {
            setWordDataBySlot(prev => {
              const arr = [...prev];
              const [wordData] = arr.splice(item.index, 1);
              arr.splice(pos, 0, wordData);
              return arr;
            });
          }
        } else {
          if (item.id === 'movies') {
            setMoviesBySlot(prev => {
              const arr = [...prev];
              arr[pos] = null;
              return arr;
            });
          }
          if (item.id === 'weather') {
            setWeatherBySlot(prev => {
              const arr = [...prev];
              arr[pos] = null;
              return arr;
            });
          }
          if (item.id === 'trivia') {
            setTriviaBySlot(prev => {
              const arr = [...prev];
              arr[pos] = null;
              return arr;
            });
            setTriviaInitialized(prev => {
              const arr = [...prev];
              arr[pos] = false;
              return arr;
            });
            setTriviaShowAnswer(prev => {
              const arr = [...prev];
              arr[pos] = false;
              return arr;
            });
          }
          if (item.id === 'worddict') {
            setWordDataBySlot(prev => {
              const arr = [...prev];
              arr[pos] = null;
              return arr;
            });
          }
        }
        newWidgets[pos] = item.id;
        setDashboardWidgets(newWidgets);
      }
      return { dropped: true };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'DASHBOARD_WIDGET',
    item: widgetId ? { index: pos, id: widgetId } : null,
    canDrag: !!widgetId,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  const slotHighlightClass = isOver ? 'drag-over' : '';

  if (widgetId) {
    return (
      <DraggableWidgetCard
        key={widgetId + '-' + pos}
        index={pos}
        moveWidget={moveWidget}
        onRemove={() => handleRemove(pos)}
      >
        <RemoveWidgetProvider onRemove={handleRemove} index={pos}>
          <div ref={node => { drop(node); drag(node); }} className={slotClass + ' ' + widgetClass + ' ' + slotHighlightClass + (isDragging ? ' dragging' : '')}>

            {widgetId === 'movies' ? (
              <MemoizedMoviesWidget
                movie={moviesBySlot[pos]}
                setMovie={movie => {
                  setMoviesBySlot(prev => {
                    const arr = [...prev];
                    arr[pos] = movie;
                    return arr;
                  });
                }}
              />
            ) : widgetId === 'weather' ? (
              <MemoizedWeatherWidget
                weather={weatherBySlot[pos]}
                setWeather={weather => {
                  setWeatherBySlot(prev => {
                    const arr = [...prev];
                    arr[pos] = weather;
                    return arr;
                  });
                }}
              />                              
            ) : widgetId === 'trivia' ? (
              <MemoizedTriviaWidget 
                index={pos} 
                trivia={triviaBySlot[pos]}
                setTrivia={trivia => {
                  setTriviaBySlot(prev => {
                    const arr = [...prev];
                    arr[pos] = trivia;
                    return arr;
                  });
                }}
                isInitialized={triviaInitialized[pos]}
                setIsInitialized={initialized => {
                  setTriviaInitialized(prev => {
                    const arr = [...prev];
                    arr[pos] = initialized;
                    return arr;
                  });
                }}
                showAnswer={triviaShowAnswer[pos]}
                setShowAnswer={showAnswer => {
                  setTriviaShowAnswer(prev => {
                    const arr = [...prev];
                    arr[pos] = showAnswer;
                    return arr;
                  });
                }}
              />
            ) : widgetId === 'worddict' ? (
              <MemoizedWordDictWidget index={pos} />
            ) : (
              null
            )}
          </div>
        </RemoveWidgetProvider>
      </DraggableWidgetCard>
    );
  } else {
    return (
      <div
        ref={drop}
        className={slotClass + ' ' + slotHighlightClass}
      >
        <div className="empty"></div>
      </div>
    );
  }
}

// SidebarWidget: draggable widget icon
function SidebarWidget({ widget }) {
  const appState = window.dashboardWidgetsState || [];
  const isDisabled = appState.some(id => id === widget.id);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WIDGET',
    item: { id: widget.id },
    canDrag: !isDisabled,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  let IconComponent;
  let tooltip = '';
  switch (widget.id) {
    case 'weather':
      IconComponent = WbSunnyIcon;
      tooltip = 'Weather';
      break;
    case 'trivia':
      IconComponent = HelpOutlineIcon;
      tooltip = 'Programming Trivia';
      break;
    case 'movies':
      IconComponent = LiveTvIcon;
      tooltip = 'Movies';
      break;
    case 'worddict':
      IconComponent = ArticleIcon;
      tooltip = 'Word Dictionary';
      break;
    default:
      IconComponent = null;
      tooltip = widget.name;
  }

  return (
    <li
      ref={drag}
      className={`sidebar-widget${isDragging ? ' dragging' : ''}${isDisabled ? ' disabled' : ''}`}
      style={{ opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}
      data-tooltip={tooltip}
    >
      {IconComponent && <IconComponent fontSize="large" style={{ margin: '0 8px' }} />}
    </li>
  );
}

// DraggableWidgetCard: dashboard widget card that can be reordered and removed
function DraggableWidgetCard({ children, index, moveWidget, onRemove }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'DASHBOARD_WIDGET',
    collect: monitor => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'DASHBOARD_WIDGET',
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} className={`dashboard-card${isDragging ? ' dragging' : ''}`} data-handler-id={handlerId}>
      {children}
    </div>
  );
}

export default App;