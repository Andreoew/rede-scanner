# 🔄 Sistema de Auto-Update - Rede Scanner

## 📋 Como Funciona

O Rede Scanner agora possui um sistema de atualizações automáticas que:

- ✅ **Verifica atualizações** automaticamente ao iniciar
- ✅ **Notifica o usuário** quando há nova versão
- ✅ **Permite download** manual ou automático
- ✅ **Instala automaticamente** após download
- ✅ **Reinicia o app** após instalação

## 🚀 Como Publicar Atualizações

### 1. **Configurar GITHUB_TOKEN**

```bash
# Configure o token como variável de ambiente
export GITHUB_TOKEN=ghp_seu_token_aqui

# Ou use no comando
GH_TOKEN=ghp_seu_token_aqui npm run publish:win
```

### 2. **Atualizar Versão**

```bash
# Edite o package.json e incremente a versão
"version": "1.0.1"  # 1.0.0 → 1.0.1
```

### 3. **Publicar Release**

```bash
# Build e publish para Windows
npm run publish:win

# Ou para todas as plataformas
npm run publish
```

## 📱 Experiência do Usuário

### **Verificação Automática:**
- App verifica atualizações ao iniciar
- Silencioso, não interrompe o usuário

### **Notificação de Atualização:**
```
┌─────────────────────────────────┐
│        Atualização Disponível   │
├─────────────────────────────────┤
│ Uma nova versão do Rede Scanner │
│ está disponível!                │
│                                 │
│ Versão 1.0.1                    │
│                                 │
│ Deseja baixar e instalar agora? │
│                                 │
│        [Sim]    [Não]           │
└─────────────────────────────────┘
```

### **Progresso do Download:**
```
┌─────────────────────────────────┐
│      Baixando Atualização       │
├─────────────────────────────────┤
│ Baixando a nova versão...       │
│                                 │
│ Por favor, aguarde. O aplicativo│
│ será reiniciado automaticamente │
│ após o download.                │
│                                 │
│              [OK]               │
└─────────────────────────────────┘
```

### **Instalação:**
```
┌─────────────────────────────────┐
│       Atualização Pronta        │
├─────────────────────────────────┤
│ A atualização foi baixada com   │
│ sucesso!                        │
│                                 │
│ O aplicativo será reiniciado    │
│ para instalar a atualização.    │
│                                 │
│    [Reiniciar Agora] [Mais Tarde]│
└─────────────────────────────────┘
```

## 🛠️ Menu do Aplicativo

O usuário pode verificar atualizações manualmente:

**Ajuda → Verificar Atualizações**

## ⚙️ Configurações

### **Auto Updater:**
```javascript
autoUpdater.autoDownload = false;        // Não baixa automaticamente
autoUpdater.autoInstallOnAppQuit = true; // Instala ao fechar
```

### **Publish:**
```yaml
publish:
  provider: github
  releaseType: release
  private: false
  publishAutoUpdate: true
```

## 🔐 Permissões Necessárias

O GITHUB_TOKEN precisa das seguintes permissões:

- ✅ `repo` - Acesso completo ao repositório
- ✅ `workflow` - Executar GitHub Actions
- ✅ `write:packages` - Publicar releases

## 📊 Monitoramento

### **Logs do Console:**
```javascript
// Verificando atualizações...
// Atualização disponível: { version: '1.0.1', ... }
// Progresso do download: { percent: 45, ... }
// Atualização baixada: { version: '1.0.1', ... }
```

### **Arquivos Gerados:**
- `dist/latest.yml` - Metadados da versão
- `dist/app-update.yml` - Configuração do updater
- `RedeScanner-Setup-1.0.1.exe` - Instalador

## 🚨 Troubleshooting

### **Erro de Token:**
```bash
# Verificar se o token está configurado
echo $GITHUB_TOKEN

# Ou usar diretamente
GH_TOKEN=ghp_xxx npm run publish:win
```

### **Erro de Permissão:**
- Verificar se o token tem permissão `repo`
- Verificar se o repositório é público ou token tem acesso

### **Erro de Build:**
```bash
# Limpar cache
rm -rf dist/
rm -rf node_modules/
npm install
npm run publish:win
```

## 📈 Fluxo Completo

1. **Desenvolvedor:**
   - Atualiza código
   - Incrementa versão
   - Executa `npm run publish:win`

2. **GitHub:**
   - Cria release automático
   - Gera arquivos de update
   - Disponibiliza download

3. **Usuário:**
   - Abre o app
   - Recebe notificação de update
   - Escolhe baixar ou não
   - App reinicia com nova versão

## 🎯 Benefícios

- ✅ **Atualizações automáticas** sem intervenção manual
- ✅ **Experiência profissional** com notificações nativas
- ✅ **Controle do usuário** sobre quando atualizar
- ✅ **Processo transparente** com feedback visual
- ✅ **Rollback automático** em caso de erro 