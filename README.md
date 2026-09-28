# 🌙 Definitive Dark Mode

**Definitive Dark Mode** é uma extensão para navegadores baseados em Chromium (Google Chrome, Microsoft Edge, Brave, Opera) que permite aplicar modo escuro de forma personalizada ou inteligente em qualquer site da web, com suporte avançado a padrões de domínios e wildcards (`*`).

---

## ✨ Funcionalidades

- ⚡ **Ativação / Desativação Global:** Ligue ou desligue a extensão facilmente a qualquer momento.
- 🌐 **Modo Global ou por Lista:** Escolha aplicar o tema escuro em **todos os sites** ou apenas em sites específicos adicionados à lista de **Ativos**.
- 🚫 **Lista de Ignorados:** Adicione sites à lista de ignorados para garantir que não recebam o modo escuro, mesmo quando a opção de aplicar a todos estiver ativa.
- 🔍 **Controle Avançado por Domínio e Wildcards:**
  - `www.site.com/*` — Aplica em todas as páginas do domínio `www.site.com`.
  - `*.site.com/*` — Aplica no domínio raiz e em todos os seus subdomínios (ex: `app.site.com`, `blog.site.com`).
  - `site.com/blog/*` — Aplica apenas em subcaminhos específicos.
  - `site.com` — Aplica em todo o domínio `site.com`.
- 🎨 **Dois Métodos de Tema Escuro:**
  - **Cores Personalizadas:** Escolha exatamente a cor de fundo (background) e a cor dos textos de acordo com sua preferência.
  - **Inversão Inteligente:** Inverte dinamicamente as cores do site preservando as cores originais de mídias (imagens, vídeos, SVG, canvas).
- 🔄 **Sincronização em Tempo Real:** As alterações feitas no popup são aplicadas instantaneamente na aba ativa sem precisar recarregar a página.

---

## 🚀 Como Instalar no Navegador

Como esta extensão está em desenvolvimento local, você pode instalá-la no navegador no modo desenvolvedor:

1. Baixe ou clone este repositório no seu computador.
2. Abra o seu navegador e acesse a página de extensões:
   - **Chrome:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
   - **Brave:** `brave://extensions/`
3. No canto superior direito, ative o **Modo do desenvolvedor** (*Developer mode*).
4. Clique no botão **Carregar sem compactação** (*Load unpacked*).
5. Selecione a pasta raiz onde estão os arquivos deste projeto (onde se encontra o `manifest.json`).
6. Pronto! O ícone da extensão **Definitive Dark Mode** aparecerá na barra de extensões do navegador.

---

## 💻 Como Usar

1. Clique no ícone da extensão na barra de ferramentas do navegador.
2. **Preenchimento Automático:** Ao abrir o popup, o campo *Padrão de URL* já vem preenchido automaticamente com a sugestão do domínio da página atual (ex: `www.exemplo.com/*`).
3. **Adicionar Padrões:**
   - Para aplicar modo escuro no padrão digitado, clique em **Ativar Padrão**.
   - Para ignorar o padrão digitado, clique em **Ignorar Padrão**.
4. **Modo Global:** Marque a opção **Ativar para todos os sites** se desejar aplicar em toda a web (respeitando a lista de ignorados).
5. **Personalização de Cores:** Alterne entre os métodos *Cores Personalizadas* (com seletor de cor) ou *Inversão Inteligente*.

---

## 📁 Estrutura de Arquivos

```text
definitive-dark-mode/
├── manifest.json      # Configurações e permissões da extensão (Manifest V3)
├── content.js         # Content script responsável pela injeção do CSS e checagem de URLs
├── popup.html         # Interface visual do menu popup
└── popup.js           # Lógica do popup, gerenciamento do armazenamento (chrome.storage) e padrões
```

---

## 🛠️ Tecnologias Utilizadas

- **JavaScript (ES6+)**
- **HTML5 & CSS3**
- **Web Extensions API (Manifest V3)**
