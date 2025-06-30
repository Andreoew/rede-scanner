const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Carregar variáveis de ambiente do .env
require('dotenv').config();

// Carregar base de dados de dispositivos
let deviceTypes = {};
let keywords = {};

try {
  const deviceData = JSON.parse(fs.readFileSync(path.join(__dirname, 'device-types.json'), 'utf8'));
  deviceTypes = deviceData.deviceTypes || {};
  keywords = deviceData.keywords || {};
} catch (error) {
  console.log('Erro ao carregar device-types.json:', error.message);
  // Fallback com dados básicos
  deviceTypes = {};
  keywords = {};
}

// Função para identificar tipo de dispositivo
function identifyDeviceType(vendor) {
  const vendorUpper = vendor.toUpperCase();
  
  // Busca exata nos fabricantes
  if (deviceTypes[vendorUpper]) {
    return deviceTypes[vendorUpper];
  }
  
  // Busca parcial nos fabricantes
  for (const [key, value] of Object.entries(deviceTypes)) {
    if (vendorUpper.includes(key) || key.includes(vendorUpper)) {
      return value;
    }
  }
  
  // Busca por palavras-chave
  for (const [key, value] of Object.entries(keywords)) {
    if (vendorUpper.includes(key)) {
      return value;
    }
  }
  
  return { type: '❓ Dispositivo Desconhecido', category: 'Unknown' };
}

// Função para consultar fabricante via API
async function getVendorInfo(macAddress) {
  return new Promise((resolve) => {
    // Limpar MAC address (remover separadores)
    const cleanMac = macAddress.replace(/[:\-\.]/g, '').substring(0, 6);
    
    // Usar API key se disponível
    const apiKey = process.env.MAC_LOOKUP_API_KEY || '';
    const url = apiKey 
      ? `https://api.maclookup.app/v2/macs/${cleanMac}/company/name?apiKey=${apiKey}`
      : `https://api.maclookup.app/v2/macs/${cleanMac}/company/name`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const vendor = data.trim();
            if (vendor === '*NO COMPANY*') {
              resolve({ vendor: 'Fabricante desconhecido', deviceInfo: { type: '❓ Dispositivo Desconhecido', category: 'Unknown' } });
            } else {
              const deviceInfo = identifyDeviceType(vendor);
              resolve({ vendor: vendor, deviceInfo: deviceInfo });
            }
          } else {
            resolve({ vendor: 'Fabricante desconhecido', deviceInfo: { type: '❓ Dispositivo Desconhecido', category: 'Unknown' } });
          }
        } catch (error) {
          resolve({ vendor: 'Fabricante desconhecido', deviceInfo: { type: '❓ Dispositivo Desconhecido', category: 'Unknown' } });
        }
      });
    }).on('error', (error) => {
      resolve({ vendor: 'Fabricante desconhecido', deviceInfo: { type: '❓ Dispositivo Desconhecido', category: 'Unknown' } });
    });
  });
}

window.api = {
  scanNetwork: (onProgress, onResult) => {
    return new Promise(async (resolve) => {
      console.log('scanNetwork chamado!');
      const results = [];
      let currentIndex = 1;
      
      async function testIP() {
        if (currentIndex > 254) {
          console.log('scanNetwork terminou!', results);
          resolve(results);
          return;
        }
        
        const ip = `192.168.15.${currentIndex}`;
        
        // Envia progresso
        onProgress(`Testando ${ip}... (${currentIndex}/254)`);
        
        try {
          const ping = execSync(`ping -n 1 -w 100 ${ip}`).toString();
          if (ping.includes('TTL=')) {
            const arp = execSync(`arp -a ${ip}`).toString();
            const macMatch = arp.match(/([a-f0-9]{2}-){5}[a-f0-9]{2}/i);
            const mac = macMatch ? macMatch[0] : 'MAC desconhecido';
            
            // Consultar fabricante
            let vendorInfo = { vendor: 'Consultando...', deviceInfo: { type: '⏳ Identificando...', category: 'Loading' } };
            if (mac !== 'MAC desconhecido') {
              vendorInfo = await getVendorInfo(mac);
            }
            
            const deviceInfo = `${ip} - ${mac} - ${vendorInfo.vendor} - ${vendorInfo.deviceInfo.type} - ${vendorInfo.deviceInfo.category}`;
            
            results.push(deviceInfo);
            onResult(deviceInfo); // Envia resultado encontrado
          }
        } catch (err) {
          // Ignora erro
        }
        
        currentIndex++;
        
        // Continua com o próximo IP após um pequeno delay
        setTimeout(testIP, 10);
      }
      
      // Inicia o teste
      testIP();
    });
  },
  
  exportResults: (devices) => {
    if (!devices || devices.length === 0) {
      return { success: false, message: 'Nenhum dispositivo encontrado para exportar' };
    }
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `rede-scanner-${timestamp}.csv`;
      const desktopPath = path.join(require('os').homedir(), 'Desktop');
      const filePath = path.join(desktopPath, filename);
      
      // Cabeçalho CSV
      let csvContent = 'IP,MAC Address,Fabricante,Tipo de Dispositivo,Categoria,Data/Hora\n';
      
      // Adicionar dados
      devices.forEach(device => {
        const parts = device.split(' - ');
        const ip = parts[0];
        const mac = parts[1];
        const vendor = parts[2] || 'Desconhecido';
        const deviceType = parts[3] || 'Desconhecido';
        const category = parts[4] || 'Unknown';
        const now = new Date().toLocaleString('pt-BR');
        csvContent += `"${ip}","${mac}","${vendor}","${deviceType}","${category}","${now}"\n`;
      });
      
      fs.writeFileSync(filePath, csvContent, 'utf8');
      
      return { 
        success: true, 
        message: `Exportado com sucesso!\nArquivo: ${filename}\nLocal: Desktop`,
        filePath: filePath
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao exportar: ${error.message}` 
      };
    }
  }
};
