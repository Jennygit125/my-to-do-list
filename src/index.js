// src/index.js
import "./styles.css";
import "./brain.js";

import profile from "./img/file-account-outline.svg";
import menu from "./img/nav.svg";
const image = document.createElement("img");
image.src = profile;

document.getElementById("profile").appendChild(image);
const menuImage = document.createElement("img");
menuImage.src = menu;
document.getElementById("nav").appendChild(menuImage);

const greeting = "Welcome to My To Do List!";
console.log(greeting);
