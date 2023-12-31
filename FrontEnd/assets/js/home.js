

document.addEventListener('DOMContentLoaded', () => {
  const buttonAddWorks = document.querySelector('.button-add');
  const galleryContainer = document.querySelector('.gallery');
  const addWorkForm = document.getElementById('addWorkForm');
  const filterButtonsContainer = document.querySelector('.filter-buttons');
  const buttonValidWorks = document.querySelector('.button-valid-works');
  let worksData = [];
  let modal = null;
  const modalGallery = document.querySelector('.modal-gallery');
  const modalAddWorks = document.querySelector('.modal-add-works');
  const backModalArrow = document.querySelector('.js-modal-back');

  buttonAddWorks.addEventListener('click', () => {
    modalGallery.style.display = 'none';
    modalAddWorks.style.display = 'block';
    backModalArrow.style.display = 'block';
  });

  const openModal = function (e) {
    if(e){

    e.preventDefault();
    }
    const target = document.getElementById('modalworks');
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    modal.querySelector('.js-modal-back').addEventListener('click', backModal);
  
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
  const backModal = function (e) {
    modalGallery.style.display = 'block';
    modalAddWorks.style.display = 'none';
    backModalArrow.style.display = 'none';
  }
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
  window.addEventListener('keydown', function(e){
    if (e.key ==="Escape" ) {
      closeModal(e);
    }
  })
  const stopPropagation = function (e) {
    e.stopPropagation();
  }
  
  const displayAllWorks = function () {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = '';
    worksData.forEach(work => {
      const workElement = createWorkElement(work);
      galleryContainer.appendChild(workElement);
    });
  }
  
  const createWorkElement = function (work) {
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
  fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(categories => {
    const filterButtonsContainer = document.querySelector(".filter-buttons");

    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => {
      displayAllWorks();
    });

    filterButtonsContainer.appendChild(allButton);

    categories.forEach(category => {
      const button = createFilterButton(category);
      filterButtonsContainer.appendChild(button);
    });
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      workCategorySelect.appendChild(option);
    });
  })
  .catch(error => console.log(error));

  const createFilterButton = function (category) {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.addEventListener('click', () => {
      filterGalleryByCategory(category.id);
    });
    return button;
  }

  const filterGalleryByCategory = function (categoryId) {
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

  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
      worksData = works;
      displayAllWorks(); 
    })
    .catch(error => console.log(error));

  const deleteWork = function (workId) {
 
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
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout');
    loginLink.addEventListener('click', () => {
      window.location.href= 'login.html';
  });

const token = localStorage.getItem('token');

if (token) {

  logoutLink.style.display = 'block';
  loginLink.style.display = 'none';

  const editMod = document.createElement('div')
  editMod.classList.add('editor-mod');

  const iconBlack = document.createElement('i');
  iconBlack.classList.add('fa-regular', 'fa-pen-to-square');

  const textBlack = document.createTextNode('Mode édition');

  editMod.appendChild(iconBlack);
  editMod.appendChild(textBlack);

  const body = document.querySelector('body');
  body.prepend(editMod);

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

  editButton.addEventListener('click', (e) => {
    openModal(e);
  });
  

} else {
  logoutLink.style.display = 'none';
  filterButtonsContainer.style.display = 'flex';

}

  logoutLink.addEventListener('click', () => {

  localStorage.removeItem('token');

  window.location.href = 'login.html';
});
  const workCategorySelect = document.getElementById('workCategory');
  const uploadImageButton = document.getElementById('uploadImageButton');
  const workImageInput = document.getElementById('workImage');
  const imagePreview = document.getElementById('imagePreview');
  const workImageContainer = document.querySelector('.icon-works-limit');
  const workTitleInput = document.getElementById('workTitle');

  const checkFormValidity = () => {
    if (workImageInput.files.length > 0 && addWorkForm.checkValidity()) {
      buttonValidWorks.disabled = false;
    } else {
      buttonValidWorks.disabled = true;
    }
  };

  workImageInput.addEventListener('input', checkFormValidity);
  workTitleInput.addEventListener('input', checkFormValidity);

  addWorkForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    if (workImageInput.files.length === 0) {
      return;
    }


    const workImage = document.getElementById('workImage').files[0];
    const workTitle = document.getElementById('workTitle').value;
    const workCategory = workCategorySelect.value;


    const formData = new FormData();

    formData.append('image', workImage);
    formData.append('title', workTitle);
    formData.append('category', workCategory);


    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(createdWork => {

        worksData.push(createdWork);
        displayAllWorks();
        openModal();
        addWorkForm.reset();
        buttonValidWorks.disabled = true;
        imagePreview.style.display = 'none';
        workImageContainer.style.display = 'flex';
        workImageInput.value = '';
      })
      .catch(error => console.error('Erreur lors de l\'ajout du work :', error));
  });
  workImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {

      const reader = new FileReader();
      reader.onload = function () {
        imagePreview.src = reader.result;
        imagePreview.style.display = 'flex';
        workImageContainer.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      
      imagePreview.style.display = 'none';
      workImageContainer.style.display = 'flex';
    }
  });
  imagePreview.addEventListener('click', () => {
    workImageInput.value = null;
    imagePreview.style.display = 'none';
    workImageContainer.style.display = 'flex';
  })

  uploadImageButton.addEventListener('click', () => {
      workImageInput.click(); 
  });

});
