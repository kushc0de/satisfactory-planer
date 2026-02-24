import { useEffect } from 'react';
import { useProjectsStore } from '../../store/projectsStore';
import StartPage from '../StartPage/StartPage';
import Editor from './Editor';

export default function App() {
  const currentProjectId = useProjectsStore((s) => s.currentProjectId);
  const loadIndex = useProjectsStore((s) => s.loadIndex);

  useEffect(() => {
    loadIndex();
  }, [loadIndex]);

  if (currentProjectId) {
    return <Editor key={currentProjectId} />;
  }

  return <StartPage />;
}
