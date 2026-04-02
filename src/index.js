// src/index.js
import "./styles.css";

import odinImage from "./logo.png";

const image = document.createElement("img");
image.src = odinImage;

document.getElementById("main-card").
style.backgroundImage = `url(${odinImage})`;

import { greeting } from "./greeting.js";

console.log(greeting);
