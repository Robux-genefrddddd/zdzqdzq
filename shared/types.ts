export interface PreviewContent {
  type: "color" | "image" | "component";
  content: string;
}

export interface FileItem {
  id: string;
  title: string;
  thumbnail: string;
  preview?: PreviewContent;
  lastEdited: Date;
  organization: string;
  type: "file" | "project";
  status: "draft" | "published";
}

export interface Organization {
  id: string;
  name: string;
  icon: string;
  plan: "free" | "pro" | "team";
}

export interface EditorFile {
  id: string;
  title: string;
  organization: string;
  status: "draft" | "published";
  pages: Page[];
  currentPageId: string;
}

export interface Page {
  id: string;
  name: string;
  layers: Layer[];
}

export interface LayerStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  opacity?: number;
}

export interface LayerProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  style: LayerStyle;
  content?: string; // For text elements
}

export interface Layer {
  id: string;
  name: string;
  type: "frame" | "text" | "shape" | "component";
  properties?: LayerProperties;
  children?: Layer[];
}
