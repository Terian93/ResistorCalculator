import {bandsInfo} from './JS/bandsInfo';

const $bandsList = document.getElementById('bands-list');
const $colorsList = document.getElementById('colors-list');
const $firstBand = document.getElementById('first-band');
const $secondBand = document.getElementById('second-band');
const $thirdBand = document.getElementById('third-band');
const $fourthBand = document.getElementById('fourth-band');
const $fifthBand = document.getElementById('fifth-band');
const $sixthBand = document.getElementById('sixth-band');

let selectedBandNumber = 0;
let $bandMarker;
//let $bandDescriprion;

export const selectBandNumberById = id => {
  const bandsList = document.getElementsByClassName('resistor__band-marker');
  Array.prototype.forEach.call(bandsList, element => {
    element.className = 'resistor__band-marker';
  });
  switch (id) {
    case 'first-band-color':
      $firstBand.childNodes[1].classList.toggle('show-marker');
      return 0;

    case 'second-band-color':
      $secondBand.childNodes[1].classList.toggle('show-marker');
      return 1;

    case 'third-band-color':
      $thirdBand.childNodes[1].classList.toggle('show-marker');
      return 2;

    case 'fourth-band-color':
      $fourthBand.childNodes[1].classList.toggle('show-marker');
      return 3;

    case 'fifth-band-color':
      $fifthBand.childNodes[1].classList.toggle('show-marker');
      return 4;

    case 'sixth-band-color':
      $sixthBand.childNodes[1].classList.toggle('show-marker');
      return 5;
    default:
      throw 'Unexpected result of getBandNumberById(): unknown id';
  }
};

const createColorElement = (color, description) => {
  const $li = document.createElement('li');
  $li.className = 'colors-list__element';
  $li.innerHTML = `
    <div class="colors-list__color-circle ${color}"></div>
    <span class="colors-list__color-name">${color}</span>
    <span class="colors-list__color-description">${description}</span>
  `;
  return $li;
};

window.onload = () => {

  $bandsList.onclick = event => {
    const {target} = event;
    const isBandBtn = target.classList.contains('bands-list__band-btn');
    if (isBandBtn) {
      $bandMarker = target.childNodes[1];
      //$bandDescriprion = target.childNodes[3];
      const bandColorMarkersList = document.getElementsByClassName('bands-list__band-marker');
      Array.prototype.forEach.call(bandColorMarkersList, element => {
        element.className = 'bands-list__band-marker';
      });
      $bandMarker.className = 'bands-list__band-marker show-marker';
      selectedBandNumber = selectBandNumberById(target.id);
      $colorsList.innerHTML = '';
      const bandInfoIndex = $fourthBand.classList.contains('none') && selectedBandNumber === 2 ?
        3 : selectedBandNumber;
      bandsInfo[bandInfoIndex].colorsList.forEach( element => {
        const $el = createColorElement(element.color, element.description);
        $colorsList.appendChild($el);
      });
    }
  };
};
