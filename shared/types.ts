export interface FileItem {
  id: string;
  title: string;
  thumbnail: string;
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

export interface Layer {
  id: string;
  name: string;
  type: "frame" | "text" | "shape" | "component";
  children?: Layer[];
}
