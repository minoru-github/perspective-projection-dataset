import { initThreeApp } from "./three/three-main";
import { onChangeInputFiles } from "./three/file-loader/file-loader";
console.log("Hello World!");

window.addEventListener('DOMContentLoaded', initThreeApp);

const inputFiles = document.getElementById("inputFiles") as HTMLElement;
inputFiles.addEventListener("change", onChangeInputFiles);
