import { initThreeApp } from "./three/three-main";
import { onChangeInputFiles } from "./three/file-loader/file-loader";
import { pcdFiles } from "./html/element";
console.log("Hello World!");

window.addEventListener('DOMContentLoaded', initThreeApp);

const inputFiles = document.getElementById("inputFiles") as HTMLElement;
inputFiles.addEventListener("change", onChangeInputFiles);
