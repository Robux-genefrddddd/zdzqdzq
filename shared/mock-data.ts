import type { FileItem, Organization, EditorFile, Page, Layer } from "./types";

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

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
    lastEdited: daysAgo(1),
    organization: "Personal",
    type: "file",
    status: "draft",
  },
  {
    id: "file2",
    title: "Website Redesign 2024",
    thumbnail: "🌐",
    lastEdited: daysAgo(3),
    organization: "Design Studio",
    type: "project",
    status: "draft",
  },
  {
    id: "file3",
    title: "Component Library",
    thumbnail: "📦",
    lastEdited: daysAgo(5),
    organization: "Personal",
    type: "file",
    status: "published",
  },
  {
    id: "file4",
    title: "Dashboard Prototype",
    thumbnail: "📊",
    lastEdited: daysAgo(7),
    organization: "Startup Hub",
    type: "file",
    status: "draft",
  },
  {
    id: "file5",
    title: "Brand Guidelines",
    thumbnail: "📋",
    lastEdited: daysAgo(2),
    organization: "Design Studio",
    type: "project",
    status: "published",
  },
  {
    id: "file6",
    title: "Illustration Set",
    thumbnail: "🖼️",
    lastEdited: daysAgo(10),
    organization: "Personal",
    type: "file",
    status: "draft",
  },
  {
    id: "file7",
    title: "E-commerce Flow",
    thumbnail: "🛍️",
    lastEdited: daysAgo(4),
    organization: "Startup Hub",
    type: "project",
    status: "draft",
  },
  {
    id: "file8",
    title: "Animation Explorations",
    thumbnail: "✨",
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
          children: [
            {
              id: "layer2",
              name: "Title",
              type: "text",
            },
            {
              id: "layer3",
              name: "Button",
              type: "shape",
            },
          ],
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
  return mockFiles.sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime()).slice(0, limit);
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
