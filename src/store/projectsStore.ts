import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { ProjectMeta, ProjectData } from '../types';

const PROJECTS_INDEX_KEY = 'satisfactory-projects';
const PROJECT_DATA_PREFIX = 'satisfactory-project-';
const LEGACY_KEY = 'satisfactory-planner';

interface ProjectsState {
  projects: ProjectMeta[];
  currentProjectId: string | null;

  loadIndex: () => void;
  createProject: (name: string, data?: ProjectData) => string;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  updateProjectMeta: (id: string, updates: Partial<Pick<ProjectMeta, 'updatedAt' | 'buildingCount'>>) => void;
}

function readIndex(): ProjectMeta[] {
  try {
    const raw = localStorage.getItem(PROJECTS_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeIndex(projects: ProjectMeta[]) {
  localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(projects));
}

export function loadProjectData(id: string): ProjectData | null {
  try {
    const raw = localStorage.getItem(PROJECT_DATA_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProjectData(id: string, data: ProjectData) {
  localStorage.setItem(PROJECT_DATA_PREFIX + id, JSON.stringify(data));
}

function migrateLegacyData(): ProjectMeta | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const legacy = JSON.parse(raw);
    // zustand persist wraps state in { state: ..., version: ... }
    const state = legacy.state || legacy;
    const buildings = state.buildings || [];
    const connections = state.connections || [];

    // Only migrate if there's actual data
    if (buildings.length === 0 && connections.length === 0) {
      localStorage.removeItem(LEGACY_KEY);
      return null;
    }

    const id = nanoid();
    const now = Date.now();
    const meta: ProjectMeta = {
      id,
      name: 'Mein Projekt',
      createdAt: now,
      updatedAt: now,
      buildingCount: buildings.length,
    };
    const data: ProjectData = {
      version: 2,
      buildings,
      connections,
    };

    saveProjectData(id, data);
    localStorage.removeItem(LEGACY_KEY);
    return meta;
  } catch {
    return null;
  }
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
  projects: [],
  currentProjectId: null,

  loadIndex: () => {
    let projects = readIndex();

    // Migrate legacy data if no projects exist yet
    if (projects.length === 0) {
      const migrated = migrateLegacyData();
      if (migrated) {
        projects = [migrated];
        writeIndex(projects);
      }
    }

    set({ projects });
  },

  createProject: (name, data) => {
    const id = nanoid();
    const now = Date.now();
    const meta: ProjectMeta = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      buildingCount: data?.buildings.length ?? 0,
    };

    const projectData: ProjectData = data ?? {
      version: 2,
      buildings: [],
      connections: [],
    };
    saveProjectData(id, projectData);

    const projects = [...get().projects, meta];
    writeIndex(projects);
    set({ projects });
    return id;
  },

  renameProject: (id, name) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
    );
    writeIndex(projects);
    set({ projects });
  },

  deleteProject: (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    writeIndex(projects);
    localStorage.removeItem(PROJECT_DATA_PREFIX + id);
    set({ projects });
  },

  openProject: (id) => {
    set({ currentProjectId: id });
  },

  closeProject: () => {
    set({ currentProjectId: null });
  },

  updateProjectMeta: (id, updates) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p,
    );
    writeIndex(projects);
    set({ projects });
  },
}));
