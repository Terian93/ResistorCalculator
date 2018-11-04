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
let $markedBand;
let $markedBandColor;
let $bandColorMarker;
let $bandColorDescriprion;

export const selectBandNumberById = id => {
  const bandsList = document.getElementsByClassName('resistor__band-marker');
  Array.prototype.forEach.call(bandsList, element => {
    element.className = 'resistor__band-marker';
  });
  switch (id) {
    case 'first-band-color':
      $firstBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $firstBand;
      return 0;

    case 'second-band-color':
      $secondBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $secondBand;
      return 1;

    case 'third-band-color':
      $thirdBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $thirdBand;
      return 2;

    case 'fourth-band-color':
      $fourthBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $fourthBand;
      return 3;

    case 'fifth-band-color':
      $fifthBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $fifthBand;
      return 4;

    case 'sixth-band-color':
      $sixthBand.childNodes[1].classList.toggle('show-marker');
      $markedBand = $sixthBand;
      return 5;
    default:
      throw new Error('Unexpected result of getBandNumberById(): unknown id');
  }
};

export const createColorElement = (color, description) => {
  const $li = document.createElement('li');
  $li.className = 'colors-list__element';
  $li.id = `color-${color}`;
  $li.innerHTML = `
    <div class="colors-list__color-circle ${color}"></div>
    <span class="colors-list__color-name">${color}</span>
    <span class="colors-list__color-description">${description}</span>
  `;
  return $li;
};

export const colorsListRemoveChilds = $list => {
  let check = 0;
  while ($list.firstChild) {
    check++;
    $list.firstChild.onclick = null;
    $list.removeChild($list.firstChild);
    if (check > 13) {
      throw '"while" loop gone out of color number limit';
    }
  }
  return true;
};

export const changeBandColor = ($element, color) => {
  if ($element.classList.length !== 2) {
    throw 'wrong $element inputed: $element has less than 2 classes';
  }
  $element.classList.remove($element.classList.item(1));
  $element.classList.add(color);
};

//TODO check if that function can be restructurized or breaked more into small functions
const changeColorsList = bandInfo => {
  bandInfo.colorsList.forEach( element => {
    const $el = createColorElement(element.color, element.description);
    $colorsList.appendChild($el);
    const $colorBtn = document.getElementById(`color-${element.color}`);
    
    $colorBtn.onclick = () => {
      changeBandColor($markedBandColor, element.color);
      changeBandColor($markedBand, element.color);

      if ( $markedBandColor.id === 'fourth-band-color' ) {
        const $thirdBandColor = document.getElementById('third-band-color');
        const color = $thirdBandColor.classList.item(1);
        if (element.color === 'none') {
          const bandColorInfo = bandsInfo[3].colorsList.find( object => {
            return object.color === color;
          });
          $thirdBandColor.childNodes[3].innerHTML = bandColorInfo.description;
          bandsInfo[2].description = bandColorInfo.description;
        } else {
          let bandColorInfo = bandsInfo[2].colorsList.find( object => {
            return object.color === color;
          });
          if (typeof bandColorInfo === 'undefined') {
            bandColorInfo = {color: 'black', description: '0'};
            changeBandColor($thirdBand, bandColorInfo.color);
            changeBandColor($thirdBandColor, bandColorInfo.color);
            bandsInfo[2].color = bandColorInfo.color;
          }
          $thirdBandColor.childNodes[3].innerHTML = bandColorInfo.description;
          bandsInfo[2].description = bandColorInfo.description;
        }
      } 
      $bandColorDescriprion.innerHTML = element.description;
      bandsInfo[selectedBandNumber].color = element.color;
      bandsInfo[selectedBandNumber].description = element.description;
    };
  });
};

window.onload = () => {

  $bandsList.onclick = event => {
    const {target} = event;
    const isBandBtn = target.classList.contains('bands-list__band-btn');
    if (isBandBtn) {
      $markedBandColor = target;
      $bandColorMarker = $markedBandColor.childNodes[1];
      $bandColorDescriprion = $markedBandColor.childNodes[3];
      const bandColorMarkersList = document.getElementsByClassName('bands-list__band-marker');
      Array.prototype.forEach.call(bandColorMarkersList, element => {
        element.className = 'bands-list__band-marker';
      });
      $bandColorMarker.className = 'bands-list__band-marker show-marker';
      selectedBandNumber = selectBandNumberById(target.id);
      colorsListRemoveChilds($colorsList);
      const bandInfoIndex = $fourthBand.classList.contains('none') && selectedBandNumber === 2 ?
        3 : selectedBandNumber;
      changeColorsList(bandsInfo[bandInfoIndex]);
    }
  };
};
