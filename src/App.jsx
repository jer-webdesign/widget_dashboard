import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WeatherWidget from './widgets/Weather/WeatherWidget';
import { RemoveWidgetProvider } from './RemoveWidgetContext';
import QuoteWidget from './widgets/Quote/QuoteWidget';
import NewsWidget from './widgets/News/NewsWidget';
import StockWidget from './widgets/Stock/StockWidget';
import './App.css';

function App() {
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  window.dashboardWidgetsState = dashboardWidgets.filter(Boolean);
  const availableWidgets = [
    { id: 'weather', name: 'Weather', component: WeatherWidget },
    { id: 'quote', name: 'Quote', component: QuoteWidget },
    { id: 'news', name: 'News', component: NewsWidget },
    { id: 'stock', name: 'Stock', component: StockWidget },
  ];

  // Add widget from sidebar
  function handleDrop(widgetId) {
    if (!dashboardWidgets.includes(widgetId)) {
      setDashboardWidgets([...dashboardWidgets, widgetId]);
    }
  }

  // Remove widget from dashboard
  function handleRemove(idx) {
    const newWidgets = [...dashboardWidgets];
    newWidgets[idx] = undefined;
    setDashboardWidgets(newWidgets);
  }

  // Drag-and-drop reorder logic
  function moveWidget(dragIndex, hoverIndex) {
    const updated = [...dashboardWidgets];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setDashboardWidgets(updated);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <RemoveWidgetProvider onRemove={handleRemove}>
        <div className="dashboard-container">
          <aside className="sidebar">
            <h2>Personalized Dashboard</h2>
            <ul>
              {availableWidgets.map(w => (
                <SidebarWidget key={w.id} widget={w} />
              ))}
            </ul>
          </aside>
          <main className="dashboard">
            {/* <h1>My Dashboard</h1> */}
            <DashboardGrid
              dashboardWidgets={dashboardWidgets}
              availableWidgets={availableWidgets}
              moveWidget={moveWidget}
              handleRemove={handleRemove}
              handleDrop={handleDrop}
            />
          </main>
        </div>
      </RemoveWidgetProvider>
    </DndProvider>
  );
// DashboardGrid: drop target for sidebar widgets
function DashboardGrid({ dashboardWidgets, availableWidgets, moveWidget, handleRemove, handleDrop }) {
  // Track which slot is being hovered
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const handleSlotEnter = idx => setHoveredSlot(idx);
  const handleSlotLeave = () => setHoveredSlot(null);

  // Always show 4 slots, fill with widgets or empty slots
  const slots = [0, 1, 2, 3].map(pos => {
    const widgetId = dashboardWidgets[pos];
    let widgetClass = '';
    let slotClass = '';
    if (pos === 0) slotClass = 'weather-slot';
    if (pos === 1) slotClass = 'quote-slot';
    if (pos === 2) slotClass = 'stock-slot';
    if (pos === 3) slotClass = 'news-slot';
    if (widgetId === 'weather') widgetClass = 'widget weather-widget';
    else if (widgetId === 'quote') widgetClass = 'widget quote-widget';
    else if (widgetId === 'stock') widgetClass = 'widget stock-widget';
    else if (widgetId === 'news') widgetClass = 'widget news-widget';

    // Make each slot a drop target for any widget
    const [{ isOver }, drop] = useDrop({
      accept: 'WIDGET',
      drop: (item) => {
        if (!dashboardWidgets[pos]) {
          const newWidgets = [...dashboardWidgets];
          newWidgets[pos] = item.id;
          setDashboardWidgets(newWidgets);
        }
        return { dropped: true };
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
      }),
    });

    const slotHighlightClass = isOver ? 'drag-over' : '';

    if (widgetId) {
      const WidgetComponent = availableWidgets.find(w => w.id === widgetId).component;
      return (
        <DraggableWidgetCard
          key={widgetId + '-' + pos}
          index={pos}
          moveWidget={moveWidget}
          onRemove={() => handleRemove(pos)}
        >
          <RemoveWidgetProvider onRemove={handleRemove} index={pos}>
            <div ref={drop} className={slotClass + ' ' + widgetClass + ' ' + slotHighlightClass}>
              <WidgetComponent />
            </div>
          </RemoveWidgetProvider>
        </DraggableWidgetCard>
      );
    } else {
      return (
        <div
          key={pos}
          ref={drop}
          className={slotClass + ' ' + slotHighlightClass}
        >
          <div className="empty"></div>
        </div>
      );
    }
  });

  return (
    <div className="dashboard-grid">
      {slots}
    </div>
  );
}
}

// SidebarWidget: draggable widget icon
function SidebarWidget({ widget }) {
  // Disable drag if widget is already in dashboardWidgets
  const appState = window.dashboardWidgetsState || [];
  const isDisabled = appState.includes(widget.id);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WIDGET',
    item: { id: widget.id },
    canDrag: !isDisabled,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <li
      ref={drag}
      className={`sidebar-widget${isDragging ? ' dragging' : ''}${isDisabled ? ' disabled' : ''}`}
      style={{ opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto' }}
    >
      {widget.name}
    </li>
  );
}

// DraggableWidgetCard: dashboard widget card that can be reordered and removed
import { useRef } from 'react';
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
