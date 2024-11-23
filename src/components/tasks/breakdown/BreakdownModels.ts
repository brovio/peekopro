export const availableModels = {
  openai: [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' }
  ],
  openrouter: [
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B' }
  ],
  fal: [
    { id: 'fast-sdxl', name: 'Fast SDXL' },
    { id: 'flux1.1pro', name: 'FLUX 1.1 Pro' },
    { id: 'lcm', name: 'LCM' }
  ],
  google: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' }
  ],
  grok: [
    { id: 'grok-1', name: 'Grok-1' }
  ]
};

export type Provider = keyof typeof availableModels;