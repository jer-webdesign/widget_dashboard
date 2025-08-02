import React, { createContext, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
export function MaterialRemoveIcon(props) {
  return <CloseIcon {...props} />;
}

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
