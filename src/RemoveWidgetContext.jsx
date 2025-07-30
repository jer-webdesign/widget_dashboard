import React, { createContext, useContext } from 'react';

export const RemoveWidgetContext = createContext();

export function RemoveWidgetProvider({ onRemove, index, children }) {
  return (
    <RemoveWidgetContext.Provider value={{ onRemove, index }}>
      {children}
    </RemoveWidgetContext.Provider>
  );
}

export function useRemoveWidget() {
  const ctx = useContext(RemoveWidgetContext);
  if (!ctx) return () => {};
  return () => ctx.onRemove(ctx.index);
}
