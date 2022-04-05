// import fetch from 'node-fetch';

function getDogImage(breed, count = 1) {
  let url = `https://dog.ceo/api/breed/${breed}/images/random/${count}`;
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(error => console.error('Failed to get image from API. ', error));
}

function getDogBreedList() {
  return fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(responseJson => responseJson.message)
    .catch(error => console.error('Failed to get dog breed list.', error));
}

function displayBreedList(breedList) {
  const breedListElement = document.querySelector('#breed-list-select');

  Object.entries(breedList).forEach(entry => {
    const [breed, subBreeds] = entry;

    // parent breed li element
    const listItem = document.createElement('li');
    listItem.classList.add('parent-breed-list-item', 'form-check');
    listItem.setAttribute('value', breed);

    // parent breed label
    const label = document.createElement('label');
    label.setAttribute('for', breed);
    label.classList.add('parent-breed', 'form-check-label');
    label.innerText = breed;

    // parent breed checkbox
    const parentOption = document.createElement('input');
    parentOption.setAttribute('type', 'checkbox');
    parentOption.setAttribute('name', breed);
    parentOption.classList.add('parent-breed', 'form-check-input');
    parentOption.id = breed;
    parentOption.setAttribute('checked', true);

    // append label and checkbox to li element
    listItem.appendChild(label);
    listItem.appendChild(parentOption);

    // conditional sub-breed list
    if (subBreeds.length > 0) {
      // sub-breed ul element
      const subBreedList = document.createElement('ul');
      subBreedList.classList.add('sub-breed-list');
      subBreedList.id = `${breed}-sub-breed-list`;

      subBreeds.forEach(subBreed => {
        // sub-breed li elements
        const listItem = document.createElement('li');
        listItem.classList.add('sub-breed-list-item', 'form-check');

        // sub-breed label
        const label = document.createElement('label');
        label.setAttribute('for', subBreed);
        label.classList.add('sub-breed', 'form-check-label');
        label.innerText = subBreed;

        // sub-breed checkbox
        const option = document.createElement('input');
        option.setAttribute('type', 'checkbox');
        option.value = `${breed}/${subBreed}`;
        option.classList.add('sub-breed', 'form-check-input');
        option.id = subBreed;
        option.setAttribute('checked', true);
        option.addEventListener('change', () => {
          if (option.checked) {
            getDogImage(`${breed}/${subBreed}`, 1);
          }
        });

        // append label and checkbox to li element
        listItem.appendChild(option);
        listItem.appendChild(label);

        // append li element to ul element
        subBreedList.appendChild(listItem);
      });

      // append sub-breed ul element to parent li element
      listItem.appendChild(subBreedList);

      // event listener for parent checkbox to toggle sub-breed checkboxes
      parentOption.addEventListener('change', () => {
        parentOption.checked ? subBreedList.removeAttribute('hidden') : subBreedList.setAttribute('hidden', true);
        const subBreeds = subBreedList.querySelectorAll('input[type="checkbox"]');
        subBreeds.forEach(subBreed => {
          subBreed.checked = parentOption.checked;
        });
      });
    } else {
      parentOption.value = breed;
    }

    // append parent li element to ul element
    breedListElement.appendChild(listItem);
  });
}

function displayResults(responseJson) {
  const dogImageContainer = document.querySelector('#dog-image-container');
  const dogImageWrapper = document.createElement('div');
  dogImageWrapper.classList.add('dog-image');

  const dogImage = document.createElement('img');
  dogImage.setAttribute('src', responseJson.message);

  dogImageWrapper.appendChild(dogImage);
  dogImageContainer.appendChild(dogImageWrapper);
}

getDogBreedList().then(displayBreedList);

const submitButton = document.querySelector('#submit-btn');

submitButton.addEventListener('click', () => {
  const breedList = document.querySelectorAll('input[type="checkbox"]');
  const selectedBreeds = [];

  breedList.forEach(breed => {
    if (breed.checked && breed.value !== 'on') {
      selectedBreeds.push(breed.value);
    }
  });
  console.log(selectedBreeds);

  selectedBreeds.forEach(breed => {
    getDogImage(breed, 1);
  });
});


const clearButton = document.querySelector('#clear-btn');
clearButton.addEventListener('click', () => {
  const dogImageContainer = document.querySelector('#dog-image-container');
  dogImageContainer.innerHTML = '';
});
