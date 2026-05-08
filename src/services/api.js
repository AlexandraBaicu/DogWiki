export const fetchDogImage = async (breed) => {
  try {
    const formattedBreed = breed.toLowerCase().trim();
    
    let endpoint = `https://dog.ceo/api/breed/${formattedBreed}/images/random`;
    
    if (formattedBreed.includes(' ')) {
       const parts = formattedBreed.split(' ');
       
       endpoint = `https://dog.ceo/api/breed/${parts[1]}/${parts[0]}/images/random`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.message;
    } else {
      throw new Error('Rasa nu a fost găsită. Încearcă altă rasă.');
    }
  } catch (error) {
    throw new Error(error.message || 'Eroare la aducerea imaginii.');
  }
};

const dogStats = {
  husky: { weight: "16-27 kg", age: "12-15 ani" },
  pug: { weight: "6-8 kg", age: "12-15 ani" },
  beagle: { weight: "9-11 kg", age: "12-15 ani" },
  labrador: { weight: "25-36 kg", age: "10-12 ani" },
  bulldog: { weight: "18-23 kg", age: "8-10 ani" },
  corgi: { weight: "10-14 kg", age: "12-15 ani" },
  poodle: { weight: "20-32 kg", age: "12-15 ani" },
  chihuahua: { weight: "1.5-3 kg", age: "12-20 ani" },
  boxer: { weight: "25-32 kg", age: "10-12 ani" },
  dalmatian: { weight: "20-32 kg", age: "10-13 ani" }
};

export const fetchDogFact = async (breed) => {
  try {
    const formattedBreed = breed.charAt(0).toUpperCase() + breed.slice(1).toLowerCase();
    const stats = dogStats[breed.toLowerCase()];
    
    let fact = "";
    if (stats) {
      fact = `Așa da! Această rasă ajunge de obicei la greutatea de ${stats.weight} și trăiește aproximativ ${stats.age}. `;
    }

    const endpoint = `https://ro.wikipedia.org/api/rest_v1/page/summary/${formattedBreed}`;
    let response = await fetch(endpoint);

    if (!response.ok) {
      const enEndpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedBreed}`;
      response = await fetch(enEndpoint);
    }

    if (response.ok) {
      const data = await response.json();
      if (data && data.extract) {
        const sentences = data.extract.split('.').slice(0, 2).join('.') + '.';
        fact += `În plus, am aflat din cloud că: ${sentences}`;
        return fact;
      }
    }
    
    return fact ? fact : `Această rasă este minunată, deși Wikipedia nu are un rezumat specific momentan!`;
  } catch (error) {
    console.error('API Error:', error);
    return `Câinii din această rasă sunt extrem de loiali și inteligenți!`;
  }
};
