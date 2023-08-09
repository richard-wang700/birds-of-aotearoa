function getStatusColorClass(status) {
  switch (status) {
    case "Not Threatened":
      return "background-color:#02a028;";
    case "Naturally Uncommon":
      return "background-color:#649a31;";
    case "Relict":
      return "background-color:#99cb68;";
    case "Recovering":
      return "background-color:#fecc33;";
    case "Declining":
      return "background-color:#fe9a01;";
    case "Nationally Increasing":
      return "background-color:#c26967;";
    case "Nationally Vulnerable":
      return "background-color:#9b0000;";
    case "Nationally Endangered":
      return "background-color:#660032;";
    case "Nationally Critical":
      return "background-color:#320033;";
    case "Extinct":
      return "background-color:black;";
    case "Data Deficient":
      return "background-color:black;";
    default:
      return "background-color:black;";
  }
}

function generateBirdCard(bird) {
  const stat = bird.status;
  const statusColorClass = getStatusColorClass(stat);
  return `
      <div class="card">
        <div class="card-inner">
          <div class="flip-card-front">
            <img src="${bird.photo.source}" alt="${bird.english_name}" class="bird-image">
            <div class="big-text">
              <span class="card-txt-big">${bird.primary_name}</span>
              <div class="credit">Photo by ${bird.photo.credit}</div>
              <div class="conservationColour" style=${statusColorClass}></div>
            </div>
          </div>
          <div class="flip-card-back">
            <div class="back-word">
              <h1 class="card-txt-med">${bird.english_name}</h1> 
            </div>
            <div class="description">
              <span class="card-label">Scientific Name:</span>
              <span class="card-txt">${bird.scientific_name}</span>
            </div>
            <div class="description">
              <span class="card-label">Family:</span>
              <span class="card-txt">${bird.family}</span>
            </div>
            <div class="description">
              <span class="card-label">Order:</span>
              <span class="card-txt">${bird.order}</span>
            </div>
            <div class="description">
              <span class="card-label">Status:</span>
              <span class="card-txt">${stat}</span>
            </div>
            <div class="description">
              <span class="card-label">Size:</span>
              <span class="card-txt">${bird.size.length.value} ${bird.size.length.units}</span>
            </div>
            <div class="description">
              <span class="card-label">Weight:</span>
              <span class="card-txt">${bird.size.weight.value} ${bird.size.weight.units}</span>
            </div>
            </div>
          </div>
        </div>
      </div>`;
}

function generateAllBirdCards(birdsData) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  birdsData.forEach((bird) => {
    const birdCardHTML = generateBirdCard(bird);
    cardContainer.innerHTML += birdCardHTML;
  });
}

fetch('./data/nzbird.json')
  .then(response => response.json())
  .then(data => {
    generateAllBirdCards(data);
  })
  .catch(error => console.error('Error fetching bird data:', error));

function filterEvent(eventData) {
  eventData.preventDefault();
  const searchIn = document.querySelector("#search-input").value.normalize('NFC').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const conservIn = document.querySelector("#conservation-input").value.toLowerCase();
  const sortIn = document.querySelector("#sort-input").value.toLowerCase();
  fetch("./data/nzbird.json")
    .then(response => response.json())
    .then(birds => {
      if (searchIn == "surprise me") {
        if (conservIn.toLowerCase() !== "all") {
          birds = birds.filter(bird => bird.status.toLowerCase().includes(conservIn));
        }
        birds = birds[Math.floor((Math.random() * birds.length))];
        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = ""; // Clear existing cards
        const birdCardHTML = generateBirdCard(birds);
        cardContainer.innerHTML = birdCardHTML;
      } else {
        let searchedBirds = birds.filter(bird =>
          bird.english_name.toLowerCase().includes(searchIn) ||
          bird.primary_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(searchIn) ||
          bird.scientific_name.toLowerCase().includes(searchIn) ||
          bird.family.toLowerCase().includes(searchIn) ||
          bird.order.toLowerCase().includes(searchIn)
        );
        if (conservIn.toLowerCase() !== "all") {
          searchedBirds = searchedBirds.filter(bird => bird.status.toLowerCase().includes(conservIn));
        }
        switch (sortIn) {
          case "eng-inc":
            searchedBirds.sort((a, b) => a.english_name.localeCompare(b.english_name));
            break;
          case "eng-dec":
            searchedBirds.sort((a, b) => b.english_name.localeCompare(a.english_name));
            break;
          case "mao-inc":
            searchedBirds.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
            break;
          case "mao-dec":
            searchedBirds.sort((a, b) => b.primary_name.localeCompare(a.primary_name));
            break;
          case "wei-inc":
            searchedBirds.sort((a, b) => a.size.weight.value - b.size.weight.value);
            break;
          case "wei-dec":
            searchedBirds.sort((a, b) => b.size.weight.value - a.size.weight.value);
            break;
          case "len-inc":
            searchedBirds.sort((a, b) => a.size.length.value - b.size.length.value);
            break;
          case "len-dec":
            searchedBirds.sort((a, b) => b.size.length.value - a.size.length.value);
            break;
          default:
            break;
        }
        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = ""; // Clear existing cards
        searchedBirds.forEach(bird => {
          const birdCardHTML = generateBirdCard(bird);
          cardContainer.innerHTML += birdCardHTML;
        });
      }
    })
    .catch(error => console.error("Error: " + error));
}

let submitB = document.querySelector("#submit-button");
if (submitB) {
  submitB.addEventListener('click', filterEvent);
}

function toggleSidebar() {
  const sideBar = document.querySelector(".side-bar");
  const mainContent = document.querySelector("body");
  const image = document.querySelector("#sidebar-pic");

  if (sideBar.classList.contains("sidebar-closed")) {
    sideBar.classList.remove("sidebar-closed");
    mainContent.style.gridTemplateColumns = "minmax(250px, 20%) 1fr";
    mainContent.style.gridTemplateAreas = "'side main'";
    image.style.transform = 'scaleX(1)';
  } else {
    sideBar.classList.add("sidebar-closed");
    mainContent.style.gridTemplateColumns = "1fr";
    mainContent.style.gridTemplateAreas = "'main'";
    image.style.transform = 'scaleX(-1)';
  }
}
