/* === VARIÁVEIS GLOBAIS === */
const { jsPDF } = window.jspdf;

// ATUALIZADO: Adicionado 'pretitle'
const checkpoints = [
  { id: 1, pretitle: "Unidade 1", title: "O Início da Jornada", desc: "Quem é você como empreendedor?", badge: "Primeiro Passo", file: "checkpoint1.html", icon: "lightbulb" },
  { id: 2, pretitle: "Unidade 2", title: "Explorando o Território do Mercado", desc: "Qual o ambiente do seu negócio?", badge: "Explorador de Oportunidades", file: "checkpoint2.html", icon: "map" },
  { id: 3, pretitle: "Unidade 3", title: "Construindo o Modelo de Negócio", desc: "Como seu negócio gera valor?", badge: "Arquiteto do Negócio", file: "checkpoint3.html", icon: "domain_add" },
  { id: 4, pretitle: "Unidade 4", title: "Gerenciando os Recursos", desc: "Seu negócio é sustentável financeiramente?", badge: "Guardião dos Recursos", file: "checkpoint4.html", icon: "monitoring" },
  { id: 5, pretitle: "Unidade 5", title: "Final Boss – A Grande Decisão", desc: "Seu negócio é pronto para investidores?", badge: "Empreendedor Visionário", file: "final-boss.html", isFinal: true, icon: "workspace_premium" }
];

// Carrega o progresso UMA VEZ
let progress = JSON.parse(localStorage.getItem('empreendedorismo-progress')) || {};

/* === FUNÇÕES GLOBAIS === */

function saveProgress(checkpointId, data = {}) {
  // MODIFICADO: Não salva mais a string 'notes'. Salva os dados brutos.
  progress[checkpointId] = { ...data, completed: true };
  localStorage.setItem('empreendedorismo-progress', JSON.stringify(progress));
}

function isCompleted(id) {
  return progress[id]?.completed === true;
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // Mostra por 3 segundos
  }
}

function showBadgeModal(title, badgeName, badgeColorVar, onContinue) {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBadgeName = document.getElementById('modal-badge-name');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (!modalBackdrop || !modalTitle || !modalBadgeName || !modalCloseBtn) {
    console.error("Elementos do modal não encontrados!"); if (onContinue) onContinue(); return;
  }
  modalTitle.textContent = title;
  modalBadgeName.textContent = badgeName;
  modalBadgeName.style.color = badgeColorVar; 
  modalBackdrop.classList.remove('hidden');
  const newBtn = modalCloseBtn.cloneNode(true);
  newBtn.style.background = badgeColorVar; // Cor do botão
  modalCloseBtn.parentNode.replaceChild(newBtn, modalCloseBtn);
  newBtn.addEventListener('click', () => {
    modalBackdrop.classList.add('hidden');
    if (onContinue) { setTimeout(onContinue, 300); }
  });
}

/**
 * Lógica da página principal (index.html)
 */
function initIndexPage() {
  const container = document.getElementById('checkpoints-container');
  if (!container) return; // Sai se não estiver na página certa

  container.innerHTML = '';
  let completedCount = 0;

  for (let i = 0; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    let isUnlocked = false;
    const isDone = isCompleted(cp.id);

    if (isDone && !cp.isFinal) completedCount++;

    if (cp.id === 1) isUnlocked = true;
    else if (cp.isFinal) isUnlocked = isCompleted(1) && isCompleted(2) && isCompleted(3) && isCompleted(4);
    else isUnlocked = isCompleted(cp.id - 1);

    const el = document.createElement('div');
    el.className = `checkpoint ${isDone ? 'completed' : ''} ${cp.isFinal ? 'final-boss' : ''}`;

    if (isUnlocked) {
      el.innerHTML = `
        <div class="checkpoint-icon-container badge-${cp.id}">
          <span class="material-symbols-outlined">${cp.icon}</span>
        </div>
        <div class="checkpoint-text-content">
          <span class="checkpoint-pretitle">${cp.pretitle}</span>
          <h3>${cp.title}</h3>
          <p>${cp.desc}</p>
          <div class="badge-wrapper">
            <div class="badge badge-${cp.id}">${cp.badge}</div>
          </div>
        </div>
      `;
      el.onclick = () => window.location.href = cp.file;
    } else {
      el.classList.add('locked-card'); 
      el.innerHTML = `
        <div class="checkpoint-icon-container locked">
          <span class="material-symbols-outlined">lock</span>
        </div>
        <div class="checkpoint-text-content">
          <span class="checkpoint-pretitle">${cp.pretitle}</span>
          <h3>${cp.title} (Bloqueado)</h3>
          <p>Complete o checkpoint anterior para liberar.</p>
          <div class="badge-wrapper">
            <div class="badge-bloqueado">Bloqueado</div>
          </div>
        </div>
      `;
      el.style.cursor = 'not-allowed';
    }
    container.appendChild(el);
  }

  // Atualiza a barra de progresso
  const progressBar = document.getElementById('progress-bar-inner');
  const progressText = document.getElementById('progress-text');
  if (progressBar && progressText) {
    const totalSteps = checkpoints.length - 1; // Ignora o Final Boss
    const percentage = (completedCount / totalSteps) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `Progresso: ${completedCount} de ${totalSteps} etapas concluídas.`;
  }
}


/* --- LÓGICA DO CHECKPOINT 1 (ATUALIZADA) --- */
function initCheckpoint1() {
  const d = progress[1] || {};
  document.getElementById('perfil').value = d.perfil || '';
  document.getElementById('negocio').value = d.negocio || '';
  document.getElementById('aluno-nome').value = localStorage.getItem('empreendedorismo-aluno') || '';

  window.saveData = () => {
    const nomeEl = document.getElementById('aluno-nome');
    const perfilEl = document.getElementById('perfil');
    const negocioEl = document.getElementById('negocio');
    
    const nome = nomeEl.value.trim();
    const p = perfilEl.value.trim();
    const n = negocioEl.value.trim();
    
    let isValid = true;

    if (!nome) { nomeEl.classList.add('form-field-error'); isValid = false; } 
    else { nomeEl.classList.remove('form-field-error'); }
    
    if (!p) { perfilEl.classList.add('form-field-error'); isValid = false; } 
    else { perfilEl.classList.remove('form-field-error'); }
    
    if (!n) { negocioEl.classList.add('form-field-error'); isValid = false; } 
    else { negocioEl.classList.remove('form-field-error'); }

    if (!isValid) { 
      showToast("⚠️ Preencha todos os campos destacados."); 
      return false; 
    }

    localStorage.setItem('empreendedorismo-aluno', nome);
    
    // ATUALIZADO: Salva os dados brutos, sem a string "notes"
    saveProgress(1, { perfil: p, negocio: n });
    return true;
  };
  
  window.saveOnly = () => { if (saveData()) showToast('✅ Salvo! Você pode continuarDepois.'); };
  
  window.saveAndNext = () => { 
    if (saveData()) {
      showBadgeModal('Checkpoint 1 Concluído!', 'Primeiro Passo', 'var(--badge-1)', () => { window.location.href = "checkpoint2.html"; });
    }
  };
}

/* --- LÓGICA DO CHECKPOINT 2 (ATUALIZADA) --- */
function initCheckpoint2() {
  if (!isCompleted(1)) { alert("⚠️ Complete o Checkpoint 1 primeiro."); window.location.href = "index.html"; return; }
  const d = progress[2] || {};
  document.getElementById('persona').value = d.persona || '';
  document.getElementById('concorrencia').value = d.concorrencia || '';

  window.saveData = () => {
    const personaEl = document.getElementById('persona');
    const concorrenciaEl = document.getElementById('concorrencia');
    const p = personaEl.value.trim();
    const c = concorrenciaEl.value.trim();
    let isValid = true;
    if (!p) { personaEl.classList.add('form-field-error'); isValid = false; } else { personaEl.classList.remove('form-field-error'); }
    if (!c) { concorrenciaEl.classList.add('form-field-error'); isValid = false; } else { concorrenciaEl.classList.remove('form-field-error'); }
    if (!isValid) { showToast("⚠️ Preencha os campos destacados."); return false; }
    
    // ATUALIZADO: Salva os dados brutos
    saveProgress(2, { persona: p, concorrencia: c });
    return true;
  };
  window.saveOnly = () => { if (saveData()) showToast('✅ Salvo! Você pode continuar depois.'); };
  window.saveAndNext = () => { 
    if (saveData()) {
      showBadgeModal('Checkpoint 2 Concluído!', 'Explorador de Oportunidades', 'var(--badge-2)', () => { window.location.href = "checkpoint3.html"; });
    }
  };
}

/* --- LÓGICA DO CHECKPOINT 3 (ATUALIZADA) --- */
function initCheckpoint3() {
  if (!isCompleted(2)) { alert("⚠️ Complete o Checkpoint 2 primeiro."); window.location.href = "index.html"; return; }
  const d = progress[3] || {};
  document.getElementById('valor').value = d.valor || '';
  document.getElementById('canais').value = d.canais || '';
  document.getElementById('receitas').value = d.receitas || '';
  document.getElementById('custos').value = d.custos || '';
  window.saveData = () => {
    const valorEl = document.getElementById('valor');
    const canaisEl = document.getElementById('canais');
    const receitasEl = document.getElementById('receitas');
    const custosEl = document.getElementById('custos');
    const v = valorEl.value.trim();
    const ca = canaisEl.value.trim();
    const r = receitasEl.value.trim();
    const cu = custosEl.value.trim();
    let isValid = true;
    if (!v) { valorEl.classList.add('form-field-error'); isValid = false; } else { valorEl.classList.remove('form-field-error'); }
    if (!ca) { canaisEl.classList.add('form-field-error'); isValid = false; } else { canaisEl.classList.remove('form-field-error'); }
    if (!r) { receitasEl.classList.add('form-field-error'); isValid = false; } else { receitasEl.classList.remove('form-field-error'); }
    if (!cu) { custosEl.classList.add('form-field-error'); isValid = false; } else { custosEl.classList.remove('form-field-error'); }
    if (!isValid) { showToast("⚠️ Preencha todos os campos."); return false; }
    
    // ATUALIZADO: Salva os dados brutos
    saveProgress(3, { valor: v, canais: ca, receitas: r, custos: cu });
    return true;
  };
  window.saveOnly = () => { if (saveData()) showToast('✅ Salvo! Você pode continuar depois.'); };
  window.saveAndNext = () => {
    if (saveData()) {
      showBadgeModal('Checkpoint 3 Concluído!', 'Arquiteto do Negócio', 'var(--badge-3)', () => { window.location.href = "checkpoint4.html"; });
    }
  };
}

/* --- LÓGICA DO CHECKPOINT 4 (ATUALIZADA) --- */
function initCheckpoint4() {
  if (!isCompleted(3)) { alert("⚠️ Complete o Checkpoint 3 primeiro."); window.location.href = "index.html"; return; }
  const invEl = document.getElementById('investimento');
  const fixEl = document.getElementById('fixos');
  const recEl = document.getElementById('receita');
  const displayEl = document.getElementById('payback-display');
  const d = progress[4] || {};
  invEl.value = d.investimento || '';
  fixEl.value = d.fixos || '';
  recEl.value = d.receita || '';
  function updatePayback() {
    const inv = parseFloat(invEl.value);
    const fix = parseFloat(fixEl.value);
    const rec = parseFloat(recEl.value);
    if (!inv || !fix || !rec) { if(displayEl) displayEl.textContent = "Preencha os valores..."; return; }
    const lucroMensal = rec - fix;
    if (lucroMensal <= 0) {
      if(displayEl) { displayEl.textContent = "Receita deve ser maior que o Custo Fixo!"; displayEl.style.color = "#dc2626"; }
    } else {
      const meses = Math.ceil(inv / lucroMensal);
      if(displayEl) { displayEl.textContent = `${meses} meses`; displayEl.style.color = "#2a9d8f"; }
    }
  }
  invEl.addEventListener('input', updatePayback);
  fixEl.addEventListener('input', updatePayback);
  recEl.addEventListener('input', updatePayback);
  updatePayback();
  window.saveData = () => {
    const inv = invEl.value.trim();
    const fix = fixEl.value.trim();
    const rec = recEl.value.trim();
    let isValid = true;
    if (!inv) { invEl.classList.add('form-field-error'); isValid = false; } else { invEl.classList.remove('form-field-error'); }
    if (!fix) { fixEl.classList.add('form-field-error'); isValid = false; } else { fixEl.classList.remove('form-field-error'); }
    if (!rec) { recEl.classList.add('form-field-error'); isValid = false; } else { recEl.classList.remove('form-field-error'); }
    if (!isValid) { showToast("⚠️ Preencha todos os campos."); return false; }
    
    const lucroMensal = parseFloat(rec) - parseFloat(fix);
    const pe = (lucroMensal > 0) ? Math.ceil(parseFloat(inv) / lucroMensal) + " meses" : 'N/A (Prejuízo)';
    
    // ATUALIZADO: Salva os dados brutos
    saveProgress(4, { investimento: inv, fixos: fix, receita: rec, payback: pe });
    return true;
  };
  window.saveOnly = () => { if (saveData()) showToast('✅ Salvo! Você pode finalizar Depois.'); };
  window.saveAndNext = () => {
    if (saveData()) {
      showBadgeModal('Checkpoint 4 Concluído!', 'Guardião dos Recursos', 'var(--badge-4)', () => { window.location.href = "final-boss.html"; });
    }
  };
}

/* --- LÓGICA DO FINAL BOSS (TOTALMENTE ATUALIZADA) --- */
function initFinalBoss() {
  if (!isCompleted(1) || !isCompleted(2) || !isCompleted(3) || !isCompleted(4)) {
    alert("⚠️ Complete todos os checkpoints antes de acessar a Grande Decisão."); 
    window.location.href = "index.html"; 
    return;
  }

  // --- ATUALIZADO: Carrega o resumo com os dados brutos ---
  let html = '';
  const cp1Data = progress[1] || {};
  html += `<h4>${checkpoints[0].title}</h4>`;
  html += `<p class="summary-notes"><strong>Perfil:</strong><br>${cp1Data.perfil || 'Não preenchido'}</p>`;
  html += `<p class="summary-notes"><strong>Negócio:</strong><br>${cp1Data.negocio || 'Não preenchido'}</p>`;

  const cp2Data = progress[2] || {};
  html += `<h4>${checkpoints[1].title}</h4>`;
  html += `<p class="summary-notes"><strong>Persona:</strong><br>${cp2Data.persona || 'Não preenchido'}</p>`;
  html += `<p class="summary-notes"><strong>Concorrência:</strong><br>${cp2Data.concorrencia || 'Não preenchido'}</p>`;

  const cp3Data = progress[3] || {};
  html += `<h4>${checkpoints[2].title}</h4>`;
  html += `<p class="summary-notes"><strong>Proposta de Valor:</strong><br>${cp3Data.valor || 'Não preenchido'}</p>`;
  html += `<p class="summary-notes"><strong>Canais:</strong><br>${cp3Data.canais || 'Não preenchido'}</p>`;
  html += `<p class="summary-notes"><strong>Receitas:</strong><br>${cp3Data.receitas || 'Não preenchido'}</p>`;
  html += `<p class="summary-notes"><strong>Custos:</strong><br>${cp3Data.custos || 'Não preenchido'}</p>`;

  const cp4Data = progress[4] || {};
  html += `<h4>${checkpoints[3].title}</h4>`;
  html += `<p class="summary-notes"><strong>Investimento Inicial:</strong><br>R$ ${cp4Data.investimento || '0'}</p>`;
  html += `<p class="summary-notes"><strong>Custos Fixos:</strong><br>R$ ${cp4Data.fixos || '0'}</p>`;
  html += `<p class="summary-notes"><strong>Receita Mensal:</strong><br>R$ ${cp4Data.receita || '0'}</p>`;
  html += `<p class="summary-notes"><strong>Payback (meses):</strong><br>${cp4Data.payback || 'N/A'}</p>`;

  document.getElementById('summary').innerHTML = html;

  // --- FUNÇÃO DE GERAR PDF (TOTALMENTE ATUALIZADA) ---
  window.generateFinalPDF = () => {
    
    const doc = new jsPDF();
    const nomeAluno = localStorage.getItem('empreendedorismo-aluno') || 'Aluno(a) não identificado(a)';
    const logoElement = document.getElementById('logo-for-pdf');
    
    // Constantes do Layout
    const pageHeight = 297;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const topMargin = 30; // Margem superior para páginas de conteúdo
    const bottomMargin = 280; // Ponto de quebra de página
    
    // Cores
    const bgColor = "#f0f4f8";
    const headerColor = "#0f172a";
    const titleColor = "#0f172a";
    const subtitleColor = "#64748b";
    const bodyColor = "#333333";
    const accentColor = "#0284c7";

    // --- FUNÇÕES HELPER (Dentro do generateFinalPDF) ---
    let y = topMargin; // Posição Y global (dentro desta função)

    // Helper: Desenha o cabeçalho em todas as páginas, menos a capa
    const drawPageHeader = () => {
      let pageNum = doc.internal.getNumberOfPages();
      if (pageNum > 1) { 
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(subtitleColor);
        
        if (logoElement && logoElement.src) {
          doc.addImage(logoElement, 'PNG', margin, 10, 10, 10);
          doc.text("Projeto Empreendedorismo", margin + 12, 16);
        } else {
          doc.text("Projeto Empreendedorismo", margin, 16);
        }

        doc.text(`Página ${pageNum - 1}`, pageWidth - margin, 16, { align: 'right' });
        doc.setDrawColor(subtitleColor);
        doc.line(margin, 20, pageWidth - margin, 20);
      }
    };

    // Helper: Desenha o Título da Seção (Ex: "1 - O Início da Jornada")
    const drawSectionTitle = (title) => {
      doc.setFillColor(headerColor);
      doc.rect(margin, y, contentWidth, 10, 'F'); // Caixa de fundo do título
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor("#ffffff"); // Texto branco
      doc.text(title, margin + 3, y + 7); // Adiciona 3mm de padding
      
      y += 15; // Move para baixo após o título
    };

    // Helper: Desenha o ponto de dado (Rótulo + Valor)
    const drawDataPoint = (label, value) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(titleColor);
      doc.text(label + ":", margin, y);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(bodyColor);
      
      // Quebra linhas longas
      const lines = doc.splitTextToSize(value || "Não preenchido", contentWidth);
      lines.forEach(line => {
        doc.text(line, margin, y + 6); // Coloca o valor abaixo do rótulo
        y += 7; // Altura da linha
      });
      y += 8; // Espaço extra entre itens
    };
    
    // --- NOVO HELPER: Lógica de quebra de página inteligente ---
    const drawSection = (title, data) => {
      let neededHeight = 15; // Altura do título da seção

      // Calcula a altura necessária para todos os itens
      data.forEach(item => {
        const lines = doc.splitTextToSize(item.value || "Não preenchido", contentWidth);
        neededHeight += 6; // Espaço do rótulo
        neededHeight += (lines.length * 7); // Espaço do valor (linhas)
        neededHeight += 8; // Espaço extra
      });

      // Se a seção inteira não couber, adicione uma nova página
      if (y + neededHeight >= bottomMargin) {
        doc.addPage();
        drawPageHeader();
        y = topMargin;
      }
      
      // Agora podemos desenhar a seção sabendo que ela cabe
      drawSectionTitle(title);
      data.forEach(item => {
        drawDataPoint(item.label, item.value);
      });
    };
    // --- FIM DOS HELPERS ---


    // --- PÁGINA 1: CAPA (Sem mudanças) ---
    doc.setFillColor(bgColor); 
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); 

    if (logoElement && logoElement.src) {
      try {
        doc.addImage(logoElement, 'PNG', 75, 60, 60, 60); 
      } catch (e) {
        console.error("Erro ao adicionar o logo.", e);
        doc.text("[Erro no Logo]", 105, 90, { align: 'center' });
      }
    } else {
      doc.text("[Sem Logo]", 105, 90, { align: 'center' });
    }
    
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor); 
    doc.text("Plano de Negócio Final", 105, 150, { align: 'center' }); 

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(subtitleColor); 
    doc.text("Projeto Empreendedorismo", 105, 160, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.text("Preparado por:", 105, 190, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(accentColor); 
    doc.text(nomeAluno, 105, 200, { align: 'center' });
    
    
    // --- PÁGINAS DE CONTEÚDO (LÓGICA ATUALIZADA) ---
    doc.addPage();
    drawPageHeader();
    y = topMargin; // Reseta o Y para a primeira página de conteúdo

    // Checkpoint 1
    const cp1Data = progress[1] || {};
    drawSection(checkpoints[0].title, [
      { label: "Perfil", value: cp1Data.perfil },
      { label: "Negócio", value: cp1Data.negocio }
    ]);

    // Checkpoint 2
    const cp2Data = progress[2] || {};
    drawSection(checkpoints[1].title, [
      { label: "Persona", value: cp2Data.persona },
      { label: "Concorrência", value: cp2Data.concorrencia }
    ]);

    // Checkpoint 3
    const cp3Data = progress[3] || {};
    drawSection(checkpoints[2].title, [
      { label: "Proposta de Valor", value: cp3Data.valor },
      { label: "Canais", value: cp3Data.canais },
      { label: "Receitas", value: cp3Data.receitas },
      { label: "Custos", value: cp3Data.custos }
    ]);

    // Checkpoint 4
    const cp4Data = progress[4] || {};
    drawSection(checkpoints[3].title, [
      { label: "Investimento Inicial", value: `R$ ${cp4Data.investimento || '0'}` },
      { label: "Custos Fixos", value: `R$ ${cp4Data.fixos || '0'}` },
      { label: "Receita Mensal", value: `R$ ${cp4Data.receita || '0'}` },
      { label: "Payback (meses)", value: cp4Data.payback || 'N/A' }
    ]);
    
    // Salva o arquivo
    doc.save(`Plano_de_Negocio_${nomeAluno.replace(/ /g, '_')}.pdf`);
  };
}


/* === ROTEADOR PRINCIPAL === */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  const accessibilityBtn = document.getElementById('accessibility-btn');
  if (accessibilityBtn) { 
    accessibilityBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }

  if (path.endsWith('index.html') || path.endsWith('/') || path.endsWith('/ProjetoEmpreendedorismo/')) {
    initIndexPage();
  } else if (path.endsWith('checkpoint1.html')) {
    initCheckpoint1();
  } else if (path.endsWith('checkpoint2.html')) {
    initCheckpoint2();
  } else if (path.endsWith('checkpoint3.html')) {
    initCheckpoint3();
  } else if (path.endsWith('checkpoint4.html')) {
    initCheckpoint4();
  } else if (path.endsWith('final-boss.html')) {
    initFinalBoss();
  }
});