import type { FileItem, Organization, EditorFile, Page, Layer } from "./types";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const mockOrganizations: Organization[] = [
  {
    id: "org1",
    name: "Personal",
    icon: "👤",
    plan: "free",
  },
  {
    id: "org2",
    name: "Design Studio",
    icon: "🎨",
    plan: "pro",
  },
  {
    id: "org3",
    name: "Startup Hub",
    icon: "🚀",
    plan: "team",
  },
];

export const mockFiles: FileItem[] = [
  {
    id: "file1",
    title: "Mobile App Design",
    thumbnail: "🎨",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    },
    lastEdited: daysAgo(1),
    organization: "Personal",
    type: "file",
    status: "draft",
  },
  {
    id: "file2",
    title: "Website Redesign 2024",
    thumbnail: "🌐",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
    },
    lastEdited: daysAgo(3),
    organization: "Design Studio",
    type: "project",
    status: "draft",
  },
  {
    id: "file3",
    title: "Component Library",
    thumbnail: "📦",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    },
    lastEdited: daysAgo(5),
    organization: "Personal",
    type: "file",
    status: "published",
  },
  {
    id: "file4",
    title: "Dashboard Prototype",
    thumbnail: "📊",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    },
    lastEdited: daysAgo(7),
    organization: "Startup Hub",
    type: "file",
    status: "draft",
  },
  {
    id: "file5",
    title: "Brand Guidelines",
    thumbnail: "📋",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)",
    },
    lastEdited: daysAgo(2),
    organization: "Design Studio",
    type: "project",
    status: "published",
  },
  {
    id: "file6",
    title: "Illustration Set",
    thumbnail: "🖼️",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
    },
    lastEdited: daysAgo(10),
    organization: "Personal",
    type: "file",
    status: "draft",
  },
  {
    id: "file7",
    title: "E-commerce Flow",
    thumbnail: "🛍️",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
    },
    lastEdited: daysAgo(4),
    organization: "Startup Hub",
    type: "project",
    status: "draft",
  },
  {
    id: "file8",
    title: "Animation Explorations",
    thumbnail: "✨",
    preview: {
      type: "color",
      content: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
    },
    lastEdited: daysAgo(6),
    organization: "Personal",
    type: "file",
    status: "published",
  },
];

export const mockEditorFile: EditorFile = {
  id: "file1",
  title: "Untitled",
  organization: "Personal",
  status: "draft",
  currentPageId: "page1",
  pages: [
    {
      id: "page1",
      name: "Page 1",
      layers: [
        {
          id: "layer1",
          name: "Frame",
          type: "frame",
          properties: {
            x: 100,
            y: 100,
            width: 400,
            height: 300,
            style: {
              fill: "#ffffff",
              borderRadius: 12,
              stroke: "#e5e7eb",
              strokeWidth: 1,
            },
          },
        },
        {
          id: "layer2",
          name: "Title",
          type: "text",
          properties: {
            x: 120,
            y: 120,
            width: 360,
            height: 40,
            content: "Welcome to Editor",
            style: {
              fill: "#1f2937",
              fontSize: 24,
              fontWeight: "600",
              textAlign: "left",
            },
          },
        },
      ],
    },
    {
      id: "page2",
      name: "Page 2",
      layers: [],
    },
  ],
};

export function getFileById(id: string): FileItem | undefined {
  return mockFiles.find((file) => file.id === id);
}

export function getRecentFiles(limit: number = 8): FileItem[] {
  return mockFiles
    .sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime())
    .slice(0, limit);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
