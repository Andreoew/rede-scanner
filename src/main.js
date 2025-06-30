const { app, BrowserWindow, Menu, dialog, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray = null; // Tray global

// Configuração do Auto Updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icons', 'icon.ico'), // Ícone correto para Windows
    show: false // Não mostrar até estar pronto
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer.html'));
  
  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Verificar atualizações após mostrar a janela
    checkForUpdates();
  });

  // Tray (bandeja do sistema)
  if (!tray) {
    const trayIconPath = path.join(__dirname, 'icons', '24x24.png');
    const fallbackIconPath = path.join(__dirname, 'icons', 'icon.png');
    const iconToUse = fs.existsSync(trayIconPath) ? trayIconPath : fallbackIconPath;
    tray = new Tray(iconToUse);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Mostrar', click: () => { mainWindow.show(); } },
      { label: 'Sair', click: () => { app.isQuiting = true; app.quit(); } }
    ]);
    tray.setToolTip('Rede Scanner');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      mainWindow.show();
    });
  }

  // Minimizar para tray ao fechar
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Criar menu personalizado
  createCustomMenu();
}

function createCustomMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Exportar Resultados',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.exportResults();
            `);
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Desenvolvimento',
      submenu: [
        {
          label: 'Abrir DevTools',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Verificar Atualizações',
          click: () => {
            checkForUpdates();
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Verificando Atualizações',
              message: 'Verificando se há atualizações disponíveis...',
              detail: 'Você será notificado se uma nova versão estiver disponível.'
            });
          }
        },
        {
          label: 'Sobre',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre Scanner de Rede',
              message: 'Scanner de Rede v1.0.0',
              detail: 'Aplicação para descobrir dispositivos conectados na rede local.\n\nDesenvolvido com Electron e Node.js\n\nContato: contato@adss.com.br\nGitHub: https://github.com/Andreoew/rede-scanner'
            });
          }
        },
        {
          label: 'Contato',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Contato',
              message: 'Informações de Contato',
              detail: '📧 Email: contato@adss.com.br\n📱 WhatsApp: (65) 99252-2895\n🌐 Website: www.adss.com.br'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Função para verificar atualizações
function checkForUpdates() {
  // Verificar atualizações em background
  autoUpdater.checkForUpdates().catch(err => {
    console.log('Erro ao verificar atualizações:', err);
  });
}

// Eventos do Auto Updater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info);
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Disponível',
    message: 'Uma nova versão do Rede Scanner está disponível!',
    detail: `Versão ${info.version}\n\nDeseja baixar e instalar agora?`,
    buttons: ['Sim', 'Não'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      // Usuário escolheu baixar
      autoUpdater.downloadUpdate();
      showUpdateProgress();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('Nenhuma atualização disponível');
});

autoUpdater.on('error', (err) => {
  console.log('Erro no auto updater:', err);
  dialog.showErrorBox('Erro de Atualização', 'Erro ao verificar atualizações: ' + err.message);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log('Progresso do download:', progressObj);
  // Enviar progresso para a interface
  mainWindow.webContents.send('update-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização baixada:', info);
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Pronta',
    message: 'A atualização foi baixada com sucesso!',
    detail: 'O aplicativo será reiniciado para instalar a atualização.',
    buttons: ['Reiniciar Agora', 'Mais Tarde'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// Função para mostrar progresso da atualização
function showUpdateProgress() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Baixando Atualização',
    message: 'Baixando a nova versão...',
    detail: 'Por favor, aguarde. O aplicativo será reiniciado automaticamente após o download.',
    buttons: ['OK']
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
