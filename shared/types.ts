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
  fill?: string | null;
  stroke?: string | null;
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
  shapeType?: "rectangle" | "circle" | "triangle" | "polygon" | "line"; // For shape elements
}

export interface PathPoint {
  x: number;
  y: number;
}

export interface Path {
  points: PathPoint[];
  closed: boolean;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
}

export interface Comment {
  text: string;
  author?: string;
  createdAt?: Date;
}

export interface FrameProperties extends LayerProperties {
  isFrame: true;
}

export interface TextBoxProperties extends LayerProperties {
  isTextBox: true;
  content: string;
}

export interface PathProperties extends LayerProperties {
  path: Path;
}

export interface Layer {
  id: string;
  name: string;
  type: "frame" | "text" | "shape" | "component" | "path" | "comment";
  properties?: LayerProperties | FrameProperties | TextBoxProperties | PathProperties;
  comment?: Comment; // For comment type
  children?: Layer[];
}
