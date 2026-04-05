// src/index.js
import "./styles.css";
import "./brain.js";

import odinImage from "./file-account-outline.svg";

const image = document.createElement("img");
image.src = odinImage;

document.getElementById("profile").appendChild(image);

const greeting = "Welcome to My To Do List!";
console.log(greeting);
