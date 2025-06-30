# 🔍 Rede Scanner

Scanner de rede para descobrir dispositivos conectados na rede local com identificação automática de fabricantes e tipos de dispositivos.

## ✨ Funcionalidades

- 🔍 **Scan de Rede**: Descobre dispositivos ativos na rede local
- 🏭 **Identificação de Fabricantes**: Identifica automaticamente fabricantes via API MAC Lookup
- 📱 **Tipos de Dispositivos**: Categoriza dispositivos (Mobile, Computer, Camera, etc.)
- 📊 **Exportação CSV**: Exporta resultados para análise
- 🎯 **Interface Moderna**: Design responsivo e intuitivo
- 📋 **Copiar IP/MAC**: Duplo clique para copiar endereços
- 🔔 **Notificações Toast**: Feedback visual elegante
- 🖥️ **Multiplataforma**: Windows, macOS e Linux

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Desenvolvimento
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rede-scanner.git
cd rede-scanner

# Instale as dependências
npm install

# Configure a API key (opcional)
cp .env.example .env
# Edite o arquivo .env e adicione sua MAC_LOOKUP_API_KEY

# Execute em modo desenvolvimento
npm start
```

### Build para Produção
```bash
# Build para Windows
npm run build:win

# Build para macOS
npm run build:mac

# Build para Linux
npm run build:linux

# Build para todas as plataformas
npm run build
```

## 📖 Como Usar

1. **Inicie o aplicativo**
2. **Clique em "Iniciar Scan da Rede"**
3. **Aguarde o scan completar**
4. **Visualize os dispositivos encontrados**
5. **Duplo clique no IP ou MAC para copiar**
6. **Use "Exportar CSV" para salvar resultados**

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
rede-scanner/
├── src/
│   ├── main.js              # Processo principal do Electron
│   ├── preload.js           # Script de preload
│   ├── renderer.html        # Interface do usuário
│   └── device-types.json    # Base de dados de fabricantes
├── .github/workflows/       # CI/CD GitHub Actions
├── package.json
└── README.md
```

### Adicionando Novos Fabricantes

Edite o arquivo `src/device-types.json` para adicionar novos fabricantes:

```json
{
  "deviceTypes": {
    "NOVO_FABRICANTE": {
      "type": "📱 Tipo do Dispositivo",
      "category": "Categoria"
    }
  }
}
```

### Scripts Disponíveis
- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Build para todas as plataformas
- `npm run build:win` - Build apenas para Windows
- `npm run build:mac` - Build apenas para macOS
- `npm run build:linux` - Build apenas para Linux

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
MAC_LOOKUP_API_KEY=sua_api_key_aqui
```

### API MAC Lookup
O aplicativo usa a API MAC Lookup para identificar fabricantes. Você pode:
- Usar sem API key (limitado)
- Obter uma API key gratuita em [maclookup.app](https://maclookup.app)

## 🚀 CI/CD

O projeto inclui GitHub Actions para CI/CD automático:

### Triggers
- **Push para main/master**: Executa testes e build
- **Pull Request**: Executa testes
- **Release**: Cria release automático

### Workflows
1. **Test**: Executa testes e linting
2. **Build Windows**: Build para Windows (.exe)
3. **Build macOS**: Build para macOS (.dmg)
4. **Build Linux**: Build para Linux (.AppImage)
5. **Release**: Cria release no GitHub

## 📦 Build

### Windows
- **Formato**: .exe (NSIS installer)
- **Arquitetura**: x64
- **Recursos**: Instalador com opções personalizadas

### macOS
- **Formato**: .dmg
- **Arquitetura**: x64, arm64 (Apple Silicon)
- **Recursos**: Instalador nativo

### Linux
- **Formato**: .AppImage
- **Arquitetura**: x64
- **Recursos**: Executável portátil

## 🎯 Tipos de Dispositivos Identificados

### 📱 Mobile
- iPhone/iPad (Apple)
- Samsung Mobile
- Xiaomi Mobile
- Huawei Mobile
- OnePlus
- Google Pixel

### 💻 Computadores
- Dell Computer
- HP Computer
- Lenovo Computer
- ASUS Computer
- MacBook/iMac

### 📡 Rede
- Roteadores TP-Link, ASUS, Netgear
- Modems Motorola, Arris

### 📹 Câmeras
- Hikvision
- Dahua
- Axis
- Bosch

### 🏠 Smart Home
- Nest IoT
- Amazon Echo
- Google Home

### 📺 TVs
- Samsung TV
- LG TV
- Vizio TV

### 🖨️ Impressoras
- Canon, HP, Epson, Brother

### 🎮 Gaming
- Nintendo Switch
- Xbox
- PlayStation

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**André Silva**
- Email: contato@adss.com.br
- GitHub: [@Andreoew](https://github.com/Andreoew)

## 🙏 Agradecimentos

- [Electron](https://electronjs.org/) - Framework para aplicações desktop
- [MAC Lookup API](https://maclookup.app/) - API para identificação de fabricantes
- [GitHub Actions](https://github.com/features/actions) - CI/CD automático 