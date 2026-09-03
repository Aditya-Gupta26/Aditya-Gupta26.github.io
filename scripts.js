// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications data
  loadPublications();

  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });

  // Wire up any timeline thumbnails to the image modal
  document.querySelectorAll('.timeline-thumb img').forEach(img => {
    img.parentElement.addEventListener('click', () => openModal(img.src));
  });

  // Collapsible sections: click the heading to expand/collapse
  document.querySelectorAll('.collapsible > h2').forEach(h2 => {
    h2.addEventListener('click', () => {
      const content = h2.nextElementSibling;
      content.hidden = !content.hidden;
      h2.classList.toggle('expanded', !content.hidden);
    });
  });
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderPublications(data.publications);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Render the full publications list
function renderPublications(publications) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';

  publications.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  // Create thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(publication.thumbnail);

  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = publication.thumbnail;
  thumbnailImg.alt = `${publication.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);

  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';

  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';

  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (author.includes('Aditya Gupta')) {
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }

    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });

  authors.innerHTML = authorsHTML;
  content.appendChild(authors);

  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }

  content.appendChild(venueContainer);

  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.target = '_blank';
      pdfLink.textContent = '[Paper]';
      links.appendChild(pdfLink);
    }

    if (publication.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.code;
      codeLink.target = '_blank';
      codeLink.textContent = '[Code]';
      links.appendChild(codeLink);
    }

    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.target = '_blank';
      projectLink.textContent = '[Project Page]';
      links.appendChild(projectLink);
    }

    content.appendChild(links);
  }

  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);

  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
