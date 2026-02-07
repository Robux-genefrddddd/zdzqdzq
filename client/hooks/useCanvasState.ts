import { useState, useCallback } from "react";
import { Layer, LayerProperties, LayerStyle } from "@shared/types";

export interface CanvasState {
  selectedElementId: string | null;
  elements: Layer[];
  zoom: number;
  panX: number;
  panY: number;
}

export function useCanvasState(initialLayers: Layer[] = []) {
  const [state, setState] = useState<CanvasState>({
    selectedElementId: null,
    elements: initialLayers.length > 0 ? initialLayers : [],
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  const selectElement = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedElementId: id }));
  }, []);

  const addElement = useCallback(
    (type: Layer["type"], x: number, y: number) => {
      const newElement: Layer = {
        id: `layer-${Date.now()}`,
        name:
          type.charAt(0).toUpperCase() + type.slice(1) + ` ${state.elements.length + 1}`,
        type,
        properties: {
          x,
          y,
          width: 200,
          height: 120,
          style: {
            fill: type === "text" ? "transparent" : "#6366f1",
            borderRadius: 8,
            fontSize: type === "text" ? 14 : undefined,
            fontWeight: type === "text" ? "500" : undefined,
          },
        },
      };

      setState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
        selectedElementId: newElement.id,
      }));

      return newElement.id;
    },
    [state.elements.length],
  );

  const updateElement = useCallback(
    (
      id: string,
      updates: Partial<{
        x: number;
        y: number;
        width: number;
        height: number;
        style: Partial<LayerStyle>;
        content: string;
        name: string;
      }>,
    ) => {
      setState((prev) => ({
        ...prev,
        elements: prev.elements.map((el) => {
          if (el.id === id) {
            const properties = el.properties || {
              x: 0,
              y: 0,
              width: 200,
              height: 120,
              style: {},
            };

            return {
              ...el,
              name: updates.name ?? el.name,
              properties: {
                ...properties,
                x: updates.x ?? properties.x,
                y: updates.y ?? properties.y,
                width: updates.width ?? properties.width,
                height: updates.height ?? properties.height,
                style: {
                  ...properties.style,
                  ...(updates.style || {}),
                },
                content: updates.content ?? properties.content,
              },
            };
          }
          return el;
        }),
      }));
    },
    [],
  );

  const deleteElement = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      selectedElementId:
        prev.selectedElementId === id ? null : prev.selectedElementId,
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom: Math.max(0.1, Math.min(zoom, 5)) }));
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setState((prev) => ({ ...prev, panX: x, panY: y }));
  }, []);

  const getSelectedElement = useCallback(() => {
    return state.elements.find((el) => el.id === state.selectedElementId);
  }, [state.elements, state.selectedElementId]);

  return {
    ...state,
    selectElement,
    addElement,
    updateElement,
    deleteElement,
    setZoom,
    setPan,
    getSelectedElement,
  };
}
