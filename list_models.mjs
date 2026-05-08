import fs from 'fs';

async function listModels() {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const apiKeyLine = envFile.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY='));
    
    if (!apiKeyLine) {
      console.log("Nu am găsit cheia VITE_GEMINI_API_KEY în .env");
      return;
    }
    
    const apiKey = apiKeyLine.split('=')[1].trim();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Modele disponibile care suportă generateContent:');
      data.models.forEach(m => {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
          console.log(m.name);
        }
      });
    } else {
      console.log('Eroare la aducerea modelelor:', data);
    }
  } catch (err) {
    console.error('Script error:', err);
  }
}

listModels();
