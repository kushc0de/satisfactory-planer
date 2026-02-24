import { useProjectsStore } from '../../store/projectsStore';
import { importFactory } from '../../utils/serialization';
import ProjectCard from './ProjectCard';
import NewProjectCard from './NewProjectCard';

export default function StartPage() {
  const projects = useProjectsStore((s) => s.projects);
  const createProject = useProjectsStore((s) => s.createProject);
  const renameProject = useProjectsStore((s) => s.renameProject);
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const openProject = useProjectsStore((s) => s.openProject);

  const handleCreate = (name: string) => {
    const id = createProject(name);
    openProject(id);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = importFactory(text);
      if ('error' in result) {
        alert(`Import-Fehler: ${result.error}`);
        return;
      }
      const name = result.projectName || file.name.replace(/\.json$/, '');
      const id = createProject(name, {
        version: 2,
        buildings: result.buildings,
        connections: result.connections,
      });
      openProject(id);
    };
    reader.readAsText(file);
  };

  // Sort projects by updatedAt descending (most recent first)
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="h-screen w-screen bg-[#0a0a15] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-[#0f0f1a] border-b border-gray-800/80 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="#F59E0B" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.3" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-gray-200 tracking-wide">
            Satisfactory <span className="text-amber-500">Fabrikplaner</span>
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-300 mb-5">Projekte</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={openProject}
                onRename={renameProject}
                onDelete={deleteProject}
              />
            ))}
            <NewProjectCard onCreate={handleCreate} onImport={handleImport} />
          </div>

          {projects.length === 0 && (
            <p className="text-sm text-gray-600 mt-4">
              Noch keine Projekte vorhanden. Erstelle ein neues Projekt, um loszulegen.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
