/* ============================================================
   CYMALAUBAT SUARL — FORM JS
   Validation, Dynamic Fields, File Upload with Progress
   ============================================================ */

'use strict';

/* ── Utility: Validate Email ─────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Utility: Show field error ───────────────────────────────── */
function setFieldError(field, msg) {
  field.classList.remove('success');
  field.classList.add('error');
  const err = field.parentElement.querySelector('.form-error');
  if (err) { err.textContent = msg; err.classList.add('visible'); }
}

/* ── Utility: Clear field error ──────────────────────────────── */
function clearFieldError(field) {
  field.classList.remove('error');
  field.classList.add('success');
  const err = field.parentElement.querySelector('.form-error');
  if (err) { err.classList.remove('visible'); }
}

/* ── Live Validation ─────────────────────────────────────────── */
document.querySelectorAll('.form-control[required]').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) validateField(field);
  });
});

function validateField(field) {
  const val = field.value.trim();

  if (!val) {
    setFieldError(field, 'Ce champ est obligatoire.');
    return false;
  }

  if (field.type === 'email' && !isValidEmail(val)) {
    setFieldError(field, 'Adresse email invalide.');
    return false;
  }

  if (field.type === 'tel' && !/^[\d\s\+\-\(\)\.]{8,}$/.test(val)) {
    setFieldError(field, 'Numéro de téléphone invalide.');
    return false;
  }

  clearFieldError(field);
  return true;
}

/* ── Dynamic Devis Form ──────────────────────────────────────── */
const projectTypeSelect = document.getElementById('projectType');
const dynamicFields = document.querySelectorAll('[data-show-for]');

function updateDynamicFields() {
  if (!projectTypeSelect) return;
  const val = projectTypeSelect.value;

  dynamicFields.forEach(el => {
    const showFor = el.dataset.showFor.split(',').map(s => s.trim());
    const parent = el.closest('.form-group') || el;

    if (showFor.includes('all') || showFor.includes(val)) {
      parent.style.display = '';
      parent.style.animation = 'fadeInUp 0.3s ease both';
    } else {
      parent.style.display = 'none';
    }
  });
}

projectTypeSelect?.addEventListener('change', updateDynamicFields);
if (projectTypeSelect) updateDynamicFields(); // initial

/* ── Budget Range Slider ─────────────────────────────────────── */
const budgetSlider = document.getElementById('budgetSlider');
const budgetDisplay = document.getElementById('budgetDisplay');

function formatBudget(val) {
  const n = parseInt(val);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + ' M FCFA';
  if (n >= 1000) return (n / 1000).toFixed(0) + ' k FCFA';
  return n.toLocaleString('fr-FR') + ' FCFA';
}

budgetSlider?.addEventListener('input', () => {
  if (budgetDisplay) budgetDisplay.textContent = formatBudget(budgetSlider.value);
  // Update fill
  const pct = ((budgetSlider.value - budgetSlider.min) / (budgetSlider.max - budgetSlider.min)) * 100;
  budgetSlider.style.background = `linear-gradient(90deg, var(--color-orange) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
});

if (budgetSlider && budgetDisplay) {
  budgetDisplay.textContent = formatBudget(budgetSlider.value);
}

/* ── File Upload ─────────────────────────────────────────────── */
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/acad',
  'application/x-acad',
  'application/autocad_dwg',
  'image/x-dwg',
  'application/dwg',
  'application/x-dwg',
  'application/zip',
  'application/x-zip-compressed',
  'image/jpeg',
  'image/png',
];

function initFileUpload(dropZoneId, inputId, progressBarId, fileInfoId) {
  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(inputId);
  const progressBar = document.getElementById(progressBarId);
  const fileInfo = document.getElementById(fileInfoId);

  if (!dropZone || !fileInput) return;

  // Drag & drop events
  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'));
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files?.length) handleFileSelect(files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) handleFileSelect(fileInput.files[0]);
  });

  function handleFileSelect(file) {
    if (file.size > MAX_FILE_SIZE) {
      window.showToast?.('Fichier trop volumineux (max 25 Mo)', 'error');
      return;
    }

    // Show simulated progress
    if (progressBar) {
      progressBar.classList.add('visible');
      const fill = progressBar.querySelector('.progress-bar__fill');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          if (fileInfo) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.innerHTML = `
              <span style="color:var(--color-success)">✔</span>
              <strong>${file.name}</strong> (${sizeMB} Mo)
              <button type="button" class="btn btn--sm" style="margin-left:auto" onclick="clearFile('${dropZoneId}','${inputId}','${progressBarId}','${fileInfoId}')">✕ Supprimer</button>
            `;
            fileInfo.style.display = 'flex';
            fileInfo.style.alignItems = 'center';
            fileInfo.style.gap = 'var(--space-3)';
          }
          window.showToast?.(`Fichier "${file.name}" chargé avec succès`, 'success');
        }
        if (fill) fill.style.width = `${progress}%`;
      }, 60);
    }
  }
}

window.clearFile = function(dropZoneId, inputId, progressBarId, fileInfoId) {
  const fileInput = document.getElementById(inputId);
  const progressBar = document.getElementById(progressBarId);
  const fileInfo = document.getElementById(fileInfoId);
  if (fileInput) fileInput.value = '';
  if (progressBar) {
    progressBar.classList.remove('visible');
    const fill = progressBar.querySelector('.progress-bar__fill');
    if (fill) fill.style.width = '0%';
  }
  if (fileInfo) { fileInfo.innerHTML = ''; fileInfo.style.display = 'none'; }
};

// Initialize upload zones
initFileUpload('devisDropZone', 'devisFile', 'devisProgress', 'devisFileInfo');
initFileUpload('cvDropZone', 'cvFile', 'cvProgress', 'cvFileInfo');

/* ── Form Submission ─────────────────────────────────────────── */
function handleFormSubmit(formId, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('.form-control[required]').forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      window.showToast?.('Veuillez corriger les erreurs du formulaire.', 'error');
      return;
    }

    // Simulate submit
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours…';
    }

    await new Promise(r => setTimeout(r, 2000)); // Simulate network

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    form.reset();
    updateDynamicFields();
    if (budgetDisplay && budgetSlider) budgetDisplay.textContent = formatBudget(budgetSlider.value);

    window.showToast?.(successMsg, 'success', 6000);
  });
}

handleFormSubmit('devisForm',
  '✅ Votre demande de devis a été envoyée ! Nous vous répondrons sous 48h.');
handleFormSubmit('contactForm',
  '✅ Message envoyé avec succès ! Notre équipe vous contactera bientôt.');
handleFormSubmit('candidatureForm',
  '✅ Votre candidature a bien été reçue ! Merci de votre intérêt pour Cymalaubat SUARL.');
