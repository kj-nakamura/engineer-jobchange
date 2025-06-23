const services = require('./public/data/services.json');
const tags = require('./public/data/tags.json');

const usedMotiveTags = new Set();
services.forEach(service => {
  service.motiveTags.forEach(tag => usedMotiveTags.add(tag));
});

console.log('Used motivation tags:', Array.from(usedMotiveTags).sort());
console.log('Defined motivation tags:', tags.motiveTags.map(t => t.id).sort());

const missingTags = tags.motiveTags.filter(tag => !usedMotiveTags.has(tag.id));
console.log('Missing tags:', missingTags.map(t => t.id));