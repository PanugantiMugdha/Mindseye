const fs = require('fs');
const path = require('path');

const artworksFile = path.join(__dirname, 'artworks.json');
const gallery = document.getElementById('gallery');
const artFileInput = document.getElementById('artFile');
const artTitleInput = document.getElementById('artTitle');
const artPriceInput = document.getElementById('artPrice');

// Load artworks from JSON file on app start
function loadArtworks() {
  if (fs.existsSync(artworksFile)) {
    const data = fs.readFileSync(artworksFile, 'utf8');
    const artworks = JSON.parse(data);

    gallery.innerHTML = ''; // Clear gallery

    artworks.forEach(art => {
      const artDiv = createArtDiv(art);
      gallery.appendChild(artDiv);
    });
  }
}

// Create an art card div
function createArtDiv(art) {
  const div = document.createElement('div');
  div.className = 'art';

  div.innerHTML = `
    <img src="${art.image}" alt="${art.title}">
    <h3>${art.title}</h3>
    <p>Price: &#8377;${art.price}</p>
  `;

  return div;
}

// Save artwork list to JSON file
function saveArtworks(artworks) {
  fs.writeFileSync(artworksFile, JSON.stringify(artworks, null, 2));
}

// Add artwork button handler
function addArt() {
  const file = artFileInput.files[0];
  const title = artTitleInput.value.trim();
  const price = artPriceInput.value.trim();

  if (!file || !title || !price) {
    alert('Please select an image and enter both title and price.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageData = e.target.result;

    // Create new art object
    const newArt = {
      title: title,
      price: price,
      image: imageData
    };

    // Load current artworks
    let artworks = [];
    if (fs.existsSync(artworksFile)) {
      artworks = JSON.parse(fs.readFileSync(artworksFile, 'utf8'));
    }

    // Add new artwork and save
    artworks.push(newArt);
    saveArtworks(artworks);

    // Update gallery display
    const artDiv = createArtDiv(newArt);
    gallery.appendChild(artDiv);

    // Clear inputs
    artFileInput.value = '';
    artTitleInput.value = '';
    artPriceInput.value = '';
  };

  reader.readAsDataURL(file);
}

// Run load on startup
window.onload = loadArtworks;

// Expose addArt to global window (for inline onclick in HTML)
window.addArt = addArt;
