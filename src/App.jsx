import { createSignal, onMount, createEffect, Show, For } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from 'solid-markdown';
import { useNavigate } from '@solidjs/router';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [projects, setProjects] = createSignal([]);
  const [selectedTemplate, setSelectedTemplate] = createSignal(null);
  const [websiteContent, setWebsiteContent] = createSignal({});
  const [contentSuggestions, setContentSuggestions] = createSignal({});
  const [previewMode, setPreviewMode] = createSignal(false);

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('dashboard');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('dashboard');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchProjects = async () => {
    // Fetch user's projects from backend or local storage
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(savedProjects);
  };

  createEffect(() => {
    if (user()) {
      fetchProjects();
    }
  });

  const createNewProject = () => {
    setCurrentPage('selectTemplate');
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setWebsiteContent({ template, content: {} });
    setCurrentPage('customize');
  };

  const updateContent = (field, value) => {
    setWebsiteContent((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  const generateContent = async (field) => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `Generate a professional ${field} for a website.`,
        response_type: 'text',
      });
      setContentSuggestions((prev) => ({
        ...prev,
        [field]: result,
      }));
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = () => {
    const newProject = {
      id: Date.now(),
      content: websiteContent(),
    };
    const updatedProjects = [...projects(), newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setCurrentPage('dashboard');
  };

  const deleteProject = (id) => {
    const updatedProjects = projects().filter((project) => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const editProject = (project) => {
    setWebsiteContent(project.content);
    setCurrentPage('customize');
  };

  const previewWebsite = () => {
    setPreviewMode(true);
  };

  const closePreview = () => {
    setPreviewMode(false);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 text-gray-800">
      <Show
        when={currentPage() !== 'login'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-7xl mx-auto">
          <header class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Professional Website Builder</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </header>

          <Show when={currentPage() === 'dashboard'}>
            <div>
              <button
                class="mb-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={createNewProject}
              >
                Create New Website
              </button>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Websites</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={projects()}>
                  {(project) => (
                    <div class="bg-white p-6 rounded-lg shadow-md">
                      <h3 class="font-semibold text-lg mb-2">{project.content.content.title || 'Untitled Website'}</h3>
                      <div class="flex space-x-2">
                        <button
                          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                          onClick={() => editProject(project)}
                        >
                          Edit
                        </button>
                        <button
                          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                          onClick={() => deleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={currentPage() === 'selectTemplate'}>
            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Select a Template</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={['Template1', 'Template2', 'Template3']}>
                  {(template) => (
                    <div
                      class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => selectTemplate(template)}
                    >
                      <h3 class="font-semibold text-lg mb-2">{template}</h3>
                      <p>Preview of {template}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={currentPage() === 'customize'}>
            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Customize Your Website</h2>
              <div class="space-y-4">
                <div>
                  <label class="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={websiteContent().content.title || ''}
                    onInput={(e) => updateContent('title', e.target.value)}
                  />
                  <button
                    class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => generateContent('title')}
                    disabled={loading()}
                  >
                    {loading() ? 'Generating...' : 'Generate Title'}
                  </button>
                  <Show when={contentSuggestions().title}>
                    <p>Suggestion: {contentSuggestions().title}</p>
                  </Show>
                </div>
                <div>
                  <label class="block font-semibold mb-1">Description</label>
                  <textarea
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    rows="5"
                    value={websiteContent().content.description || ''}
                    onInput={(e) => updateContent('description', e.target.value)}
                  />
                  <button
                    class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => generateContent('description')}
                    disabled={loading()}
                  >
                    {loading() ? 'Generating...' : 'Generate Description'}
                  </button>
                  <Show when={contentSuggestions().description}>
                    <p>Suggestion: {contentSuggestions().description}</p>
                  </Show>
                </div>
                <div class="flex space-x-4">
                  <button
                    class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={saveProject}
                  >
                    Save Website
                  </button>
                  <button
                    class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={previewWebsite}
                  >
                    Preview Website
                  </button>
                </div>
              </div>
            </div>
          </Show>

          <Show when={previewMode()}>
            <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full h-full overflow-auto">
                <button
                  class="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={closePreview}
                >
                  Close Preview
                </button>
                <div>
                  <h1 class="text-3xl font-bold mb-4">{websiteContent().content.title}</h1>
                  <p>{websiteContent().content.description}</p>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;