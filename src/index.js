// src/index.js
import "./styles.css";
import "./brain.js";

import profile from "./img/file-account-outline.svg";
import menu from "./img/nav.svg";

const image = document.createElement("img");
image.src = profile;

const profileContainer = document.getElementById("profile");
if (profileContainer) {
  profileContainer.appendChild(image);
}

const menuImage = document.createElement("img");
menuImage.src = menu;
const menuContainer = document.getElementById("nav");
if (menuContainer) {
  menuContainer.appendChild(menuImage);
}
