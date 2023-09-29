document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.querySelector('.gallery');
  let worksData = []; // Pour stocker la liste complète des travaux
  let modal = null;

  const openModal = function (e) {
    e.preventDefault();
    const target = document.getElementById('modalworks');
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

      const modalWorksContainer = target.querySelector('.modal-works');
  modalWorksContainer.innerHTML = '';

  worksData.forEach(work => {
    const workElement = createWorkElement(work);
    const trashIcon = document.createElement('i');
    modalWorksContainer.appendChild(workElement);

    trashIcon.classList.add('fa-solid', 'fa-trash-can');
    trashIcon.addEventListener('click', () => {
      const workId = work.id;
      deleteWork(workId);
    });
    workElement.appendChild(trashIcon);

  });
  }
  function deleteWork(workId) {
   
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          worksData = worksData.filter(work => work.id !== workId);
          displayAllWorks();
          openModal(); 
        } else {
          console.error('La suppression a échoué');
        }
      })
      .catch(error => console.error('Erreur de suppression:', error));
  }
  const buttonAddWorks = document.querySelector('.button-add');
  const addWorkForm = document.getElementById('addWorkForm');
  addWorkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérez les valeurs des champs du formulaire
    const workImage = document.getElementById('workImage').files[0];
    const workTitle = document.getElementById('workTitle').value;
    const workCategory = document.getElementById('workCategory').value;

    // Créez un objet FormData pour envoyer les données, y compris le fichier
    const formData = new FormData();
    formData.append('image', workImage);
    formData.append('title', workTitle);
    formData.append('categoryId', workCategory);

    // Utilisez fetch pour envoyer une requête POST à l'API
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Assurez-vous d'avoir un token valide
      },
      body: formData,
    })
      .then(response => response.json())
      .then(newWork => {
        // Gérez la réponse de l'API après la création du travail
        console.log('Nouveau travail créé :', newWork);
        // Vous pouvez également réinitialiser le formulaire ou effectuer d'autres actions ici
      })
      .catch(error => console.error('Erreur lors de l\'ajout d\'un projet :', error));
  });
  buttonAddWorks.addEventListener('click', () => {
    const modalGallery = document.querySelector('.modal-gallery');
    const modalAddWorks = document.querySelector('.modal-add-works');

    modalGallery.style.display = 'none';
    modalAddWorks.style.display = 'block';
  });
  
  
  const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    const target = document.getElementById('modalworks');
    target.style.display = 'none';
    target.setAttribute('aria-hidden', 'true');
    target.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
  }

  const stopPropagation = function (e) {
    e.stopPropagation();
  }

  window.addEventListener('keydown', function(e){
    if (e.key ==="Escape" ) {
      closeModal(e);
    }
  })

  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
      worksData = works;
      displayAllWorks(); 
    })
    .catch(error => console.log(error));

    function createWorkElement(work) {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');
    
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;
    
      figure.appendChild(img);
      figure.appendChild(figcaption);
    
      return figure;
    }

  function displayAllWorks() {
    galleryContainer.innerHTML = '';
    worksData.forEach(work => {
      const workElement = createWorkElement(work);
      galleryContainer.appendChild(workElement);
    });
  }

  function filterGalleryByCategory(categoryId) {
    const filteredWorks = worksData.filter(work => work.categoryId === categoryId);
    galleryContainer.innerHTML = '';
    filteredWorks.forEach(work => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      galleryContainer.appendChild(figure);
    });
  }
    
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout');
    loginLink.addEventListener('click', () => {
      window.location.href= 'login.html';
  });

const token = localStorage.getItem('token');

if (token) {

  logoutLink.style.display = 'block';
  loginLink.style.display = 'none';

  console.log(token);

  const EditMod = document.createElement('div')
  EditMod.classList.add('editor-mod');

  const iconBlack = document.createElement('i');
  iconBlack.classList.add('fa-regular', 'fa-pen-to-square');

  const textBlack = document.createTextNode('Mode édition');

  EditMod.appendChild(iconBlack);
  EditMod.appendChild(textBlack);

  const body = document.querySelector('body');
  body.prepend(EditMod);

  const galleryEditDiv = document.createElement('div');
  galleryEditDiv.classList.add('gallery-edit'); 
  const portfolioContent = document.getElementById('portfolio');
  portfolioContent.prepend(galleryEditDiv);

  const iconEdit = document.createElement('i');
  iconEdit.classList.add('fa-regular', 'fa-pen-to-square');

  const editButton = document.createElement('button');
  editButton.textContent = 'modifier';
  galleryEditDiv.appendChild(editButton);
  editButton.prepend(iconEdit);
  editButton.setAttribute('id', 'js-modal');

  const titleElement = document.querySelector('#portfolio h2');
  galleryEditDiv.insertBefore(titleElement, editButton);

  editButton.addEventListener('click', openModal);

} else {
  logoutLink.style.display = 'none';
  console.log(token);

    function createFilterButton(category) {
      const button = document.createElement('button');
      button.textContent = category.name;
      button.addEventListener('click', () => {
        filterGalleryByCategory(category.id);
      });
      return button;
    }
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => {
      displayAllWorks();
    });
  
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
        console.log('Catégories récupérées :', categories);
        const filterButtonsContainer = document.createElement('div');
        filterButtonsContainer.classList.add('filter-buttons');
  
        filterButtonsContainer.appendChild(allButton);
  
        categories.forEach(category => {
          const button = createFilterButton(category);
          filterButtonsContainer.appendChild(button);
        });
  
        galleryContainer.parentNode.insertBefore(filterButtonsContainer, galleryContainer);
      })
      .catch(error => console.log(error));
  
}
  logoutLink.addEventListener('click', () => {

  localStorage.removeItem('token');

  window.location.href = 'login.html';
});

});
