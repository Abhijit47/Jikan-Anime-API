const bodyEl = document.querySelector('body');

// create element function
const createElement = (childElName) => {
  return document.createElement(childElName);
};

// Append child to parent element function
const appendChild = (parent, childEl) => {
  return parent.appendChild(childEl);
};

// For create Attribute
const createAttribute = (attrName) => {
  return document.createAttribute(attrName);
};

bodyEl.classList.add("bg-dark", "bg-opacity-75");

// create a main element
const mainEl = createElement("main");
const mailElClass = ["container-fluid", "gx-0"];
mainEl.classList.add(...mailElClass);
mainEl.id = "header";
appendChild(bodyEl, mainEl);

// create Toast popup
const toastMsgContainer = createElement("div");
const toastMsgContainerClass = ["position-absolute", "top-0", "z-2", "end-0", "mt-2", "me-2", "toast", "fade"];
toastMsgContainer.classList.add(...toastMsgContainerClass);
toastMsgContainer.role = "alert";
appendChild(bodyEl, toastMsgContainer);

// Create a Toast Header
const toastHeader = createElement("div");
const toastHeaderClass = ["toast-header"];
toastHeader.classList.add(...toastHeaderClass);
appendChild(toastMsgContainer, toastHeader);

// Create a Toast Heading
const toastHeading = createElement("strong");
const toastHeadingClass = ["me-auto"];
toastHeading.classList.add(...toastHeadingClass);
toastHeading.innerHTML = "";
appendChild(toastHeader, toastHeading);

// Create a Toast Text
const toastText = createElement("small");
const toastTextClass = [];
toastText.classList.add(...toastTextClass);
toastText.innerHTML = "11 min ago";

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  toastText.innerHTML = strTime;
}
formatAMPM(new Date);
appendChild(toastHeader, toastText);

// Create a Toast button
const toastBtn = createElement("button");
const toastBtnClass = ["btn-close"];
toastBtn.classList.add(...toastBtnClass);
toastBtn.type = "button";

// Add data-* attribute to this button
const nodeMap = toastBtn.attributes;
const attrName = ['data-bs-dismiss'];
// 1) Toggle node
const toggleNode = createAttribute(attrName[0]);
toggleNode.value = "toast";
nodeMap.setNamedItem(toggleNode);
appendChild(toastHeader, toastBtn);

// Create a Toast body
const toastBody = createElement("div");
const toastBodyClass = ["toast-body"];
toastBody.classList.add(...toastBodyClass);
toastBody.innerHTML = "";
appendChild(toastMsgContainer, toastBody);

// create a section element
const sectionEl = createElement("section");
const sectionElClass = ["bg-info", "bg-gradient", "shadow", "d-flex", "flex-column", "align-items-center", "gap-2", "rounded-3", "p-2"];
sectionEl.classList.add(...sectionElClass);
appendChild(mainEl, sectionEl);

// create a heading tag
const headingEl = createElement("h1");
const headingElClass = ["text-dark", "text-opacity-75", "fs-3"];
headingEl.classList.add(...headingElClass);
headingEl.innerHTML = 'Jikan Anime API';
appendChild(sectionEl, headingEl);

// create a paragraph tag
const headingInfoEl = createElement("p");
const headingInfoElClass = ["text-break"];
headingInfoEl.classList.add(...headingInfoElClass);
headingInfoEl.innerHTML = 'Jikan is an open-source REST API for the “most active online anime + manga community and database” ';
appendChild(sectionEl, headingInfoEl);

// create a input container
const inputContainer = createElement("div");
const inputContainerClass = ["p-1", "row", "col", "col-lg-6", "col-md-10", "col-sm-10", "col-xs-12"];
inputContainer.classList.add(...inputContainerClass);
appendChild(sectionEl, inputContainer);

// create a input element
const inputEl = createElement("input");
const inputElClass = ["form-control"];
inputEl.classList.add(...inputElClass);
inputEl.placeholder = "Enter anime name";
appendChild(inputContainer, inputEl);

// create a button
const buttonEl = createElement("button");
const buttonElClass = ["btn", "btn-primary"];
buttonEl.classList.add(...buttonElClass);
buttonEl.innerHTML = "Get Anime";
buttonEl.setAttribute("onclick", "getAnime()");
appendChild(sectionEl, buttonEl);

// create a card section
const cardSection = createElement("section");
const cardSectionClass = ["container", "p-3", "d-flex", "flex-wrap", "justify-content-around", "gap-3"];
cardSection.classList.add(...cardSectionClass);
appendChild(mainEl, cardSection);

// create a pagination section;
const paginationSection = createElement("div");
const paginationSectionClass = ["container", "fade", "mt-5"];
paginationSection.classList.add(...paginationSectionClass);
appendChild(mainEl, paginationSection);

// create a pagination nav element
const paginationNav = createElement("nav");
const paginationNavClass = [];
paginationNav.classList.add(...paginationNavClass);
appendChild(paginationSection, paginationNav);

// create a pagination ul element
const paginationUl = createElement("ul");
const paginationUlClass = ["pagination", "justify-content-center"];
paginationUl.classList.add(...paginationUlClass);
appendChild(paginationNav, paginationUl);

// create 5 li with anchor tag
const createLi = (count) => {
  for (let i = 1; i <= count; i++) {
    const li = document.createElement("li");
    const liClass = ["page-item"];
    li.classList.add(...liClass);

    const a = document.createElement("a");
    const aClass = ["page-link"];
    a.classList.add(...aClass);

    if (i === 1) {
      a.innerHTML = "Previous";
    } else if (i === 5) {
      a.innerHTML = "Next";
    } else {
      a.innerHTML = i;
    }
    a.href = "#";
    appendChild(paginationUl, li);
    appendChild(li, a);
  }
};

createLi(5);

const bottomBtn = createElement("a");
const bottomBtnClass = ["bg-success", "rounded-5", "p-3", "text-decoration-none", "text-light", "position-sticky", "float-end", "z-5", "fade"];
bottomBtn.innerHTML = "UP";
bottomBtn.href = "#header";
bottomBtn.classList.add(...bottomBtnClass);
appendChild(mainEl, bottomBtn);

// Get Anime Data
const getAnime = async () => {
  // Initial Point card section
  cardSection.innerHTML = "";

  // if the input field empty Guard Class
  if (inputEl.value.length === 0) {
    toastMsgContainer.classList.toggle('show');
    toastHeading.innerHTML = "Please type one Anime name";
    toastBody.innerHTML = "Without query you can't get any result";
    // Show the pagination and footer button
    paginationSection.classList.remove("show");
    bottomBtn.classList.remove("show");
    return;
  };

  // API URI
  const api = `https://api.jikan.moe/v4/anime?q=${inputEl.value}&sfw`;
  // console.log(api);
  try {
    const response = await fetch(api);
    const animeList = await response.json();
    // console.log("Data:", animeList.data);

    if (animeList.data.length === 0) {
      toastMsgContainer.classList.toggle('show');
      toastHeading.innerHTML = "There is no anime that your query";
      toastBody.innerHTML = "Please search Again!";
      // Show the pagination and footer button
      paginationSection.classList.remove("show");
      bottomBtn.classList.remove("show");
    }
    // Input field value clear
    inputEl.value = "";

    // Call displayData function
    displayData(animeList);
  } catch (err) {
    toastMsgContainer.classList.toggle('show');
    toastHeading.innerHTML = err.message;
    toastBody.innerHTML = "Something went wrong!";
  }
};

// Display data Function
const displayData = (animeList) => {
  // console.log(animeList);
  if (animeList === undefined) return;

  animeList.data.forEach(anime => {
    // console.log(anime.genres);

    let genreList = [];
    anime.genres.forEach(genre => {
      genreList.push(genre.name ? genre.name : "");
    });

    // console.log(genreList.slice(0));

    // Show the pagination and footer button
    paginationSection.classList.add("show");
    bottomBtn.classList.add("show");

    // Create cards
    cardSection.innerHTML += `
    <div class="card" style="width: 18rem">
        <img
          src="${anime.images.webp.large_image_url}"
          class="card-img-bottom rounded-2 shadow"
          alt="..." />

        <div class="card-body">
          <span class="badge bg-primary">${anime.year ? anime.year : ""}</span>
          <span class="badge bg-info">${anime.score ? anime.score : ""}</span>
          <span class="badge bg-success">${anime.source ? anime.source : ""}</span>
          <span class="badge bg-warning">${anime.rating ? anime.rating.slice(0, 6) : ""}</span>
          <span class="badge bg-danger">${anime.type ? anime.type : ""}</span>
          <h5 class="card-title mt-1">${anime.title ? anime.title : ""}</h5>
          <p class="card-text">${anime.synopsis ? anime.synopsis.slice(0, 30) : "Synopsis not found"}...</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Duration : ${anime.duration ? anime.duration : ""}</li>
          <li class="list-group-item text-break">Genres: ${genreList ? genreList.toString() : ""}, </li>
        </ul>
        <div
          class="card-footer bg-primary rounded-bottom-2 d-flex justify-content-center gap-2">
          <span class="badge text-bg-light">${anime.aired.from ? anime.aired.from.slice(0, 10) : "..."}</span>
          to
          <span class="badge text-bg-light">${anime.aired.to ? anime.aired.to.slice(0, 10) : "..."}</span>
        </div>
      </div>
    `;
    // Show the pagination and footer button
    // paginationSection.classList.remove("show");
    // bottomBtn.classList.remove("show");

  });
};
displayData();

// console.log("Aired", anime.aired);
// console.log("From", anime.aired.from.slice(0, 10));
// console.log("To", anime.aired.to.slice(0, 10));
// console.log(anime.background);
// console.log("Duration", anime.duration);
// console.log("Favorites", anime.favorites);
// console.log("Images", anime.images.webp);
// console.log("Rank", anime.rank);
// console.log("Rating", anime.rating);
// console.log("Score", anime.score);
// console.log("Season", anime.season);
// console.log("Source", anime.source);
// console.log("Status", anime.status);
// console.log("Synopsis", `${anime.synopsis.slice(0, 100)}...`);
// console.log("Title", anime.title);
// console.log("Title-Eng", anime.title_english);
// console.log("Title-Jap", anime.title_japanese);
// console.log("Type", anime.type);
// console.log("Year", anime.year);
