import { useState, useCallback, useRef, useEffect } from 'react';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  activeFile: string | null;
  openFiles: string[];
  onFileSelect: (path: string) => void;
  onFileClose: (path: string) => void;
  onFileCreate?: (path: string, isFolder: boolean) => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onContentChange?: (path: string, content: string) => void;
}

function getPath(node: FileNode, parentPath: string = ''): string {
  return parentPath ? `${parentPath}/${node.name}` : node.name;
}

function findNode(files: FileNode[], targetPath: string): FileNode | null {
  const parts = targetPath.split('/');
  let current: FileNode[] = files;
  let node: FileNode | null = null;

  for (let i = 0; i < parts.length; i++) {
    node = current.find(f => f.name === parts[i]) || null;
    if (!node) return null;
    if (i < parts.length - 1) {
      if (!node.children) return null;
      current = node.children;
    }
  }
  return node;
}

export function FileTree({
  files,
  activeFile,
  openFiles,
  onFileSelect,
  onFileClose,
  onFileCreate,
  onFileDelete,
}: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src']));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string; isFolder: boolean } | null>(null);
  const [creating, setCreating] = useState<{ parentPath: string; isFolder: boolean } | null>(null);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creating]);

  const toggleExpand = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, path: string, isFolder: boolean) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, path, isFolder });
  };

  const handleCreateFile = (parentPath: string, isFolder: boolean) => {
    setCreating({ parentPath, isFolder });
    setNewName('');
    setContextMenu(null);
    if (!expanded.has(parentPath)) {
      setExpanded(prev => new Set(prev).add(parentPath));
    }
  };

  const handleCreateSubmit = () => {
    if (newName && creating && onFileCreate) {
      const path = creating.parentPath ? `${creating.parentPath}/${newName}` : newName;
      onFileCreate(path, creating.isFolder);
    }
    setCreating(null);
    setNewName('');
  };

  const renderNode = (node: FileNode, parentPath: string = '', depth: number = 0) => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expanded.has(path);
    const isActive = activeFile === path;
    const isFolder = node.type === 'folder';

    return (
      <div key={path}>
        <div
          className={`flex items-center gap-1.5 px-2 py-1 cursor-pointer text-sm rounded transition-colors ${
            isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleExpand(path);
            } else {
              onFileSelect(path);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, path, isFolder)}
        >
          <span className="text-xs flex-shrink-0 w-4">
            {isFolder ? (isExpanded ? '▼' : '▶') : ''}
          </span>
          <span className="flex-shrink-0">
            {isFolder ? (isExpanded ? '📂' : '📁') : getFileIcon(node.name)}
          </span>
          <span className="truncate">{node.name}</span>
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, path, depth + 1))}
            {creating && creating.parentPath === path && (
              <div className="flex items-center gap-1 px-2 py-1" style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
                <span className="text-xs">{creating.isFolder ? '📁' : '📄'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateSubmit();
                    if (e.key === 'Escape') setCreating(null);
                  }}
                  onBlur={handleCreateSubmit}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-0.5 rounded border border-cyan-500/50 outline-none"
                  placeholder={creating.isFolder ? 'folder name' : 'filename'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <button
            onClick={() => handleCreateFile('src', false)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 hover:text-white text-xs"
            title="New file"
          >
            📄+
          </button>
          <button
            onClick={() => handleCreateFile('src', true)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 hover:text-white text-xs"
            title="New folder"
          >
            📁+
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {files.map(node => renderNode(node))}
      </div>

      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.isFolder && (
              <>
                <button
                  onClick={() => handleCreateFile(contextMenu.path, false)}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10"
                >
                  New File
                </button>
                <button
                  onClick={() => handleCreateFile(contextMenu.path, true)}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10"
                >
                  New Folder
                </button>
                <div className="border-t border-white/10 my-1" />
              </>
            )}
            {onFileDelete && (
              <button
                onClick={() => {
                  onFileDelete(contextMenu.path);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function FileTabs({
  openFiles,
  activeFile,
  onSelect,
  onClose,
}: {
  openFiles: string[];
  activeFile: string | null;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}) {
  if (openFiles.length === 0) return null;

  return (
    <div className="flex items-center bg-gray-900 border-b border-white/10 overflow-x-auto">
      {openFiles.map(path => {
        const name = path.split('/').pop() || path;
        const isActive = activeFile === path;
        return (
          <div
            key={path}
            className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-white/10 cursor-pointer min-w-0 ${
              isActive
                ? 'bg-gray-950 text-white border-t-2 border-t-cyan-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
            onClick={() => onSelect(path)}
          >
            <span className="flex-shrink-0">{getFileIcon(name)}</span>
            <span className="truncate">{name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(path);
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-white/20 text-gray-500 hover:text-white text-xs"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

function getFileIcon(name: string): string {
  if (name.endsWith('.js')) return '📜';
  if (name.endsWith('.json')) return '📋';
  if (name.endsWith('.md')) return '📝';
  if (name.endsWith('.env')) return '🔒';
  if (name.endsWith('.sql')) return '🗄️';
  if (name.endsWith('.test.js') || name.endsWith('.spec.js')) return '🧪';
  if (name === 'package.json') return '📦';
  if (name === 'docker-compose.yml') return '🐳';
  if (name === 'Dockerfile') return '🐳';
  return '📄';
}

export function useFileSystem(initialFiles: FileNode[]) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const getFileContent = useCallback((path: string): string => {
    const node = findNode(files, path);
    return node?.content || '';
  }, [files]);

  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles(prev => {
      const update = (nodes: FileNode[]): FileNode[] =>
        nodes.map(node => {
          const nodePath = path.split('/');
          if (nodePath.length === 1 && node.name === nodePath[0]) {
            return { ...node, content };
          }
          if (node.children) {
            const childPath = nodePath.slice(1).join('/');
            if (path.startsWith(node.name + '/')) {
              return { ...node, children: updateInPath(node, path, content) };
            }
          }
          return node;
        });
      return update(prev);
    });
  }, []);

  const openFile = useCallback((path: string) => {
    setActiveFile(path);
    setOpenFiles(prev => prev.includes(path) ? prev : [...prev, path]);
  }, []);

  const closeFile = useCallback((path: string) => {
    setOpenFiles(prev => {
      const next = prev.filter(p => p !== path);
      if (activeFile === path) {
        setActiveFile(next[next.length - 1] || null);
      }
      return next;
    });
  }, [activeFile]);

  const createFile = useCallback((path: string, isFolder: boolean) => {
    setFiles(prev => addNode(prev, path, isFolder));
    if (!isFolder) {
      openFile(path);
    }
  }, [openFile]);

  const deleteFile = useCallback((path: string) => {
    setFiles(prev => removeNode(prev, path));
    setOpenFiles(prev => prev.filter(p => !p.startsWith(path)));
    if (activeFile?.startsWith(path)) {
      setActiveFile(null);
    }
  }, [activeFile]);

  return {
    files,
    openFiles,
    activeFile,
    getFileContent,
    updateFileContent,
    openFile,
    closeFile,
    createFile,
    deleteFile,
    setFiles,
  };
}

function addNode(files: FileNode[], path: string, isFolder: boolean): FileNode[] {
  const parts = path.split('/');
  if (parts.length === 1) {
    return [...files, { name: parts[0], type: isFolder ? 'folder' : 'file', content: isFolder ? undefined : '', children: isFolder ? [] : undefined }];
  }
  return files.map(node => {
    if (node.name === parts[0] && node.children) {
      return { ...node, children: addNode(node.children, parts.slice(1).join('/'), isFolder) };
    }
    return node;
  });
}

function removeNode(files: FileNode[], path: string): FileNode[] {
  const parts = path.split('/');
  if (parts.length === 1) {
    return files.filter(n => n.name !== parts[0]);
  }
  return files.map(node => {
    if (node.name === parts[0] && node.children) {
      return { ...node, children: removeNode(node.children, parts.slice(1).join('/')) };
    }
    return node;
  });
}

function updateInPath(root: FileNode, fullPath: string, content: string): FileNode[] {
  const parts = fullPath.split('/').slice(1);
  if (parts.length === 1) {
    return (root.children || []).map(node =>
      node.name === parts[0] ? { ...node, content } : node
    );
  }
  return (root.children || []).map(node => {
    if (node.name === parts[0] && node.children) {
      return { ...node, children: updateInPath(node, parts.join('/'), content) };
    }
    return node;
  });
}
