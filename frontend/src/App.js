import React, { useState, useEffect } from 'react';
import { FileText, Presentation, Plus, Edit, Download, ThumbsUp, ThumbsDown, Sparkles, Trash2, ArrowUp, ArrowDown, Save, LogOut, User } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';

const API_BASE = 'http://localhost:5000/api';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  
if (!response.ok) {
  let message = 'API request failed';

  try {
    const error = await response.json();
    message = error.error || JSON.stringify(error);
  } catch {
    // Backend returned HTML → extract text
    const text = await response.text();
    message = text;
  }

  throw new Error(message);
}

try {
  return await response.json();
} catch {
  // Backend returned HTML
  const text = await response.text();
  throw new Error(text);
}

};



// Auth Component
const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name };
      
      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">infini</h1>
          <p className="text-gray-600 mt-2">Infinite AI Document Generation</p>

        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              !isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
};


const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
// Dashboard Component
const Dashboard = ({ user, theme, setTheme, onLogout, onSelectProject, onNewProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiCall('/projects');
      setProjects(data.projects);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    
    try {
      await apiCall(`/projects/${projectId}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Failed to delete project');
    }
  };

  return (
<div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black">
  <div className="moving-gradient-bg"></div>

<nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

    {/* Left Logo */}
    <div className="flex items-center gap-3">
      <FileText className="w-8 h-8 text-indigo-600" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">infini</h1>
    </div>

    {/* Right Controls */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">{user.name}</span>
      </div>

      <ThemeToggle theme={theme} setTheme={setTheme} />

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>

  </div>
</nav>

     
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Projects</h2>
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI-powered document</p>
            <button
              onClick={onNewProject}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {project.document_type === 'docx' ? (
                      <FileText className="w-8 h-8 text-blue-600" />
                    ) : (
                      <Presentation className="w-8 h-8 text-orange-600" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-1000"> {toTitleCase(project.title)}</h3>
                      <span className="text-sm text-gray-500">
                        {project.document_type === 'docx' ? 'Word Document' : 'PowerPoint'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.topic}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Open
                  </button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Configuration Component
const ProjectConfig = ({ onComplete, onBack }) => {
  const [docType, setDocType] = useState('docx');
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState(['Introduction', 'Main Content', 'Conclusion']);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const addSection = () => {
    setOutline([...outline, `Section ${outline.length + 1}`]);
  };

  const removeSection = (index) => {
    setOutline(outline.filter((_, i) => i !== index));
  };

  const updateSection = (index, value) => {
    const newOutline = [...outline];
    newOutline[index] = value;
    setOutline(newOutline);
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newOutline = [...outline];
      [newOutline[index - 1], newOutline[index]] = [newOutline[index], newOutline[index - 1]];
      setOutline(newOutline);
    } else if (direction === 'down' && index < outline.length - 1) {
      const newOutline = [...outline];
      [newOutline[index], newOutline[index + 1]] = [newOutline[index + 1], newOutline[index]];
      setOutline(newOutline);
    }
  };

  const generateAIOutline = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic first');
      return;
    }

    setAiGenerating(true);
    try {
      const data = await apiCall('/ai/suggest-outline', {
        method: 'POST',
        body: JSON.stringify({ topic, document_type: docType })
      });
      setOutline(data.outline);
    } catch (err) {
     console.error('Failed to generate outline: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreate = async () => {
    if (!topic.trim() || outline.length === 0) {
      alert('Please provide a topic and at least one section');
      return;
    }

    setLoading(true);
    try {
      const data = await apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify({
          document_type: docType,
          title: topic.substring(0, 100),
          topic,
          outline
        })
      });
      onComplete(data.project);
    } catch (err) {
     console.error('Failed to create project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDocType('docx')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    docType === 'docx'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <div className="font-semibold">Word Document</div>
                  <div className="text-sm text-gray-600">.docx format</div>
                </button>
                <button
                  onClick={() => setDocType('pptx')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    docType === 'pptx'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Presentation className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                  <div className="font-semibold">PowerPoint</div>
                  <div className="text-sm text-gray-600">.pptx format</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic / Main Prompt
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., A market analysis of the EV industry in 2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  {docType === 'docx' ? 'Document Outline' : 'Slide Titles'}
                </label>
                <button
                  onClick={generateAIOutline}
                  disabled={aiGenerating || !topic.trim()}
                  className="flex items-center gap-2 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiGenerating ? 'Generating...' : 'AI Suggest'}
                </button>
              </div>

              <div className="space-y-2">
                {outline.map((section, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === outline.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => updateSection(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeSection(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addSection}
                className="mt-3 w-full border-2 border-dashed border-gray-300 text-gray-600 py-2 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-colors"
              >
                + Add {docType === 'docx' ? 'Section' : 'Slide'}
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Generate Content'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard = ({ section, index, onRefine, onLike, onComment }) => {
  const [refinePrompt, setRefinePrompt] = useState('');
  const [comment, setComment] = useState(section.comment || '');
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!refinePrompt.trim()) return;
    
    setIsRefining(true);
    await onRefine(section.id, refinePrompt);
    setRefinePrompt('');
    setIsRefining(false);
  };

  const handleCommentSave = () => {
    onComment(comment);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {index + 1}. {section.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onLike(section.liked === true ? null : true)}
            className={`p-2 rounded-lg transition-colors ${
              section.liked === true
                ? 'bg-green-100 text-green-600'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => onLike(section.liked === false ? null : false)}
            className={`p-2 rounded-lg transition-colors ${
              section.liked === false
                ? 'bg-red-100 text-red-600'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4 whitespace-pre-wrap">
        {section.content || 'Generating content, Please Wait'}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="e.g., Make this more formal, Add bullet points, Shorten to 100 words..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleRefine()}
          />
          <button
            onClick={handleRefine}
            disabled={isRefining || !refinePrompt.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
          >
            {isRefining ? (
              <>Refining...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Refine with AI
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add notes or comments about this section..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            rows="2"
          />
          <button
            onClick={handleCommentSave}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Editor Component
const Editor = ({ project, theme, setTheme, onBack }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSections();
  }, [project.id]);

  const loadSections = async () => {
    try {
      const data = await apiCall(`/projects/${project.id}/sections`);
      setSections(data.sections);
      
      if (data.sections.length === 0 || data.sections.every(s => !s.content)) {
        await generateAllContent();
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAllContent = async () => {
    setGenerating(true);
    try {
      const data = await apiCall(`/projects/${project.id}/generate`, {
        method: 'POST'
      });
      setSections(data.sections);
    } catch (err) {
  console.error("Generate error:", err);
} finally {
  setGenerating(false);
}

  };

  const refineSection = async (sectionId, prompt) => {
    try {
      const data = await apiCall(`/sections/${sectionId}/refine`, {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, content: data.content } : s
      ));
    } catch (err) {
     console.error('Failed to refine: ' + err.message);
    }
  };

  const updateFeedback = async (sectionId, liked) => {
    try {
      await apiCall(`/sections/${sectionId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ liked })
      });
      
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, liked } : s
      ));
    } catch (err) {
      console.error('Failed to update feedback:', err);
    }
  };

  const updateComment = async (sectionId, comment) => {
    try {
      await apiCall(`/sections/${sectionId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ comment })
      });
      
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, comment } : s
      ));
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const exportDocument = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/projects/${project.id}/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title}.${project.document_type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
     console.error('Failed to export: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
            Generating Content with AI
          </h3>
          <p className="text-gray-600">This may take a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black">
      <div className="moving-gradient-bg"></div>

      <div className="absolute inset-0 pointer-events-none">
  <div className="animate-gradientMove opacity-40 dark:opacity-60 w-full h-full 
                  bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.3),transparent_60%), 
                      radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.25),transparent_60%),
                      radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.25),transparent_60%)]">
  </div>
</div>

      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

    {/* LEFT SIDE → Back + Title */}
    <div className="flex items-center gap-4">

      <button
        onClick={onBack}
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
      >
        ← Back
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {project.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {project.document_type === 'docx'
            ? 'Word Document'
            : 'PowerPoint Presentation'}
        </p>
      </div>
    </div>

    {/* RIGHT SIDE → Theme + Export */}
    <div className="flex items-center gap-4">
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <button
        onClick={exportDocument}
        disabled={exporting}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        {exporting ? 'Exporting...' : 'Export'}
      </button>
    </div>

  </div>
</nav>


      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              onRefine={refineSection}
              onLike={(liked) => updateFeedback(section.id, liked)}
              onComment={(comment) => updateComment(section.id, comment)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('auth');
  const [selectedProject, setSelectedProject] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('auth');
    setSelectedProject(null);
  };
  

  const handleNewProject = () => {
    setCurrentView('config');
  };

  const handleProjectCreated = (project) => {
    setSelectedProject(project);
    setCurrentView('editor');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'auth') {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (currentView === 'dashboard') {
    return (
  <Dashboard
    user={user}
    theme={theme}
    setTheme={setTheme}
    onLogout={handleLogout}
    onSelectProject={handleSelectProject}
    onNewProject={handleNewProject}
  />
);
  }

  if (currentView === 'config') {
    return (
      <ProjectConfig
        onComplete={handleProjectCreated}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'editor' && selectedProject) {
    return (
  <Editor
    project={selectedProject}
    theme={theme}
    setTheme={setTheme}
    onBack={handleBackToDashboard}
  />
);

  }

  return null;
};

export default App;