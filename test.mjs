async function test() {
  const res = await fetch('https://dogapi.dog/api/v2/breeds');
  const json = await res.json();
  const breed = json.data.find(b => b.attributes.name.toLowerCase().includes('pug'));
  console.log(breed ? breed.attributes : 'Not found');
}
test();
