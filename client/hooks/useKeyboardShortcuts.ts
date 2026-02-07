import { useEffect, useCallback } from "react";

interface KeyboardCallbacks {
  // Tool shortcuts
  onSelectTool: (tool: string) => void;

  // Canvas actions
  onDelete: () => void;
  onSelectAll: () => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onUndo: () => void;
  onRedo: () => void;

  // Zoom/View actions
  onZoom: (action: "in" | "out" | "reset" | "fit") => void;

  // Hand tool temporary activation
  onTemporaryHandTool: (active: boolean) => void;

  // Pan tool
  onEscapeAction: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardCallbacks) {
  // Detect if user is typing in a text input or editable area
  const isTextInput = useCallback(() => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    // Check if it's an input, textarea, or contenteditable element
    const isInputElement =
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      (activeElement instanceof HTMLElement &&
        activeElement.contentEditable === "true");

    if (isInputElement) return true;

    // Also check if the active element is inside an editor panel or sidebar
    // to prevent shortcuts from firing when editing properties/values
    if (activeElement instanceof HTMLElement) {
      const inPropertiesPanel =
        activeElement.closest(".editor-properties-panel") !== null;
      const inLeftPanel = activeElement.closest(".editor-left-panel") !== null;
      const inBottomPanel =
        activeElement.closest(".editor-bottom-panel") !== null;

      return inPropertiesPanel || inLeftPanel || inBottomPanel;
    }

    return false;
  }, []);

  // Determine if Ctrl or Meta based on OS
  const isMac = useCallback(() => {
    try {
      return (
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
        navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      );
    } catch {
      return false;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isTextInputActive = isTextInput();
      const isCtrlOrCmd = isMac() ? e.metaKey : e.ctrlKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;

      // Space bar: temporary hand tool
      if (e.code === "Space" && !isTextInputActive) {
        e.preventDefault();
        callbacks.onTemporaryHandTool(true);
        return;
      }

      // Don't process other shortcuts if typing
      if (isTextInputActive && !isCtrlOrCmd) return;

      // Tool shortcuts
      if (!e.repeat) {
        switch (e.key.toUpperCase()) {
          case "V":
            if (!isTextInputActive) {
              callbacks.onSelectTool("select");
            }
            break;
          case "F":
            if (!isTextInputActive) {
              callbacks.onSelectTool("frame");
            }
            break;
          case "R":
            if (!isTextInputActive) {
              callbacks.onSelectTool("rectangle");
            }
            break;
          case "O":
            if (!isTextInputActive) {
              callbacks.onSelectTool("circle");
            }
            break;
          case "L":
            if (!isTextInputActive) {
              callbacks.onSelectTool("line");
            }
            break;
          case "P":
            if (!isTextInputActive) {
              if (isShift) {
                callbacks.onSelectTool("pencil");
              } else {
                callbacks.onSelectTool("pen");
              }
            }
            break;
          case "T":
            if (!isTextInputActive) {
              callbacks.onSelectTool("text");
            }
            break;
          case "C":
            if (!isTextInputActive) {
              callbacks.onSelectTool("comment");
            }
            break;
          case "Z":
            if (!isTextInputActive && !isCtrlOrCmd) {
              callbacks.onSelectTool("zoom");
            }
            break;
        }
      }

      // Edit shortcuts
      if (isCtrlOrCmd) {
        switch (e.key.toUpperCase()) {
          case "Z":
            if (isShift) {
              callbacks.onRedo();
            } else {
              callbacks.onUndo();
            }
            e.preventDefault();
            break;
          case "Y":
            // Windows/Linux redo
            callbacks.onRedo();
            e.preventDefault();
            break;
          case "A":
            callbacks.onSelectAll();
            e.preventDefault();
            break;
          case "D":
            callbacks.onDuplicate();
            e.preventDefault();
            break;
          case "G":
            if (isShift) {
              callbacks.onUngroup();
            } else {
              callbacks.onGroup();
            }
            e.preventDefault();
            break;
          case "+":
          case "=":
            callbacks.onZoom("in");
            e.preventDefault();
            break;
          case "-":
            callbacks.onZoom("out");
            e.preventDefault();
            break;
          case "0":
            callbacks.onZoom("reset");
            e.preventDefault();
            break;
        }
      }

      // Zoom shortcuts (Shift combinations)
      if (isShift && !isCtrlOrCmd && !isTextInputActive) {
        switch (e.key) {
          case "1":
            callbacks.onZoom("fit");
            e.preventDefault();
            break;
          case "2":
            callbacks.onZoom("fit"); // Zoom to selection - same as fit for now
            e.preventDefault();
            break;
        }
      }

      // Delete/Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && !isTextInputActive) {
        callbacks.onDelete();
        e.preventDefault();
      }

      // Escape
      if (e.key === "Escape") {
        callbacks.onEscapeAction();
      }
    },
    [isTextInput, isMac, callbacks],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // Space bar released: deactivate temporary hand tool
      if (e.code === "Space") {
        e.preventDefault();
        callbacks.onTemporaryHandTool(false);
      }
    },
    [callbacks],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
