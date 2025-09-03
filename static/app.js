const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function setLoading(isLoading) {
  const btn = $('#generate');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Generating…' : 'Generate Optimized Prompt';
}

async function loadModels() {
  const select = $('#model');
  select.innerHTML = '<option>Loading…</option>';
  try {
    const res = await fetch('/api/models');
    const data = await res.json();
    const models = data.models || [];
    if (!models.length) throw new Error('No models');
    select.innerHTML = '';
    for (const name of models) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
  } catch (e) {
    select.innerHTML = '<option value="llama3.1">llama3.1</option>';
  }
}

function getPayload() {
  return {
    model: $('#model').value,
    goal: $('#goal').value,
    audience: $('#audience').value,
    tone: $('#tone').value,
    style: $('#style').value,
    output_format: $('#output_format').value,
    length: $('#length').value,
    keywords: $('#keywords').value,
    constraints: $('#constraints').value,
    language: $('#language').value,
    context: $('#context').value,
    examples: $('#examples').value,
    creativity: $('#creativity').value,
  };
}

async function generate() {
  setLoading(true);
  $('#output').textContent = '';
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getPayload()),
    });
    if (!res.ok || !res.body) {
      const txt = await res.text();
      throw new Error(txt || 'Request failed');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      $('#output').textContent += chunk;
    }
  } catch (err) {
    $('#output').textContent = `[ERROR] ${err.message || err}`;
  } finally {
    setLoading(false);
  }
}

function clearForm() {
  for (const id of ['goal','audience','tone','style','output_format','length','keywords','constraints','context','examples']) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }
  $('#language').value = 'English';
  $('#output').textContent = '';
}

function copyOutput() {
  const text = $('#output').textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text);
}

function buildShareUrl(target, text) {
  const q = encodeURIComponent(text);
  switch (target) {
    case 'chatgpt':
      return 'https://chat.openai.com/?model=gpt-4o&q=' + q;
    case 'blackbox':
      return 'https://www.blackbox.ai/share?prompt=' + q;
    case 'perplexity':
      return 'https://www.perplexity.ai/?q=' + q;
    case 'gemini':
      return 'https://gemini.google.com/app?query=' + q;
    case 'grok':
      return 'https://grok.com/?q=' + q;
    default:
      return null;
  }
}

function setupUseMenu() {
  const menuBtn = $$('.use-menu > button')[0];
  const dropdown = $('#use-menu');
  menuBtn.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== menuBtn) dropdown.classList.remove('open');
  });
  dropdown.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const target = e.target.getAttribute('data-target');
    const text = $('#output').textContent.trim();
    if (!text) return;
    const url = buildShareUrl(target, text);
    if (url) window.open(url, '_blank');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadModels();
  $('#generate').addEventListener('click', generate);
  $('#clear').addEventListener('click', clearForm);
  $('#copy').addEventListener('click', copyOutput);
  setupUseMenu();
});

