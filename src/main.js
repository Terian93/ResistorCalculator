import {currentBandsInfo, bandsConstInfoList, result} from './JS/bandsInfo';
import { isNumber, isString } from 'util';

let selectedBandNumber = 1;

const $resultField = document.getElementById('result');
const $bandsList = document.getElementById('bands-list');
const $colorsList = document.getElementById('colors-list');

export const clearColorsList = () => {
  let check = 0;
  while ($colorsList.firstChild) {
    check++;
    $colorsList.firstChild.onclick = null;
    $colorsList.removeChild($colorsList.firstChild);
    if (check > 13) {
      throw '"while" loop gone out of color number limit';
    }
  }
  return true;
};

export const createColorElement = (color, description) => {
  const $li = document.createElement('li');
  $li.className = 'colors-list__element';
  $li.id = `color-${color}`;
  $li.innerHTML = `
    <div class="colors-list__color-circle ${color}"></div>
    <span class="colors-list__color-name">${color}</span>
    <span class="colors-list__color-description">${description.replace(/ /g, '')}</span>
  `;
  return $li;
};

//can be divided to functions
const addColorsToList = () => {
  const fourthNumberColor = currentBandsInfo[3].color;
  const numberOfList = selectedBandNumber === 3 && fourthNumberColor === 'none' ?
    4 : selectedBandNumber;
  const bandConstInfo = JSON.parse(JSON.stringify(bandsConstInfoList[numberOfList - 1]));
  /*
   * Removing "none" color from colors list when third band is used as multiplier
   * because fourth band has "none" color
   */
  if ( selectedBandNumber === 3 && numberOfList === 4) {
    bandConstInfo.colorsList.shift();
  }

  bandConstInfo.colorsList.forEach( colorElementObj => {
    const $colorElement = createColorElement(colorElementObj.color, colorElementObj.description);
    $colorsList.appendChild($colorElement);
    const $colorBtn = document.getElementById(`color-${colorElementObj.color}`);
    $colorBtn.onclick = () => {
      const currentColor = currentBandsInfo[selectedBandNumber - 1].color;
      const newColor = colorElementObj.color;
      if (currentColor !== newColor) {
        const newDescription = colorElementObj.description;
        currentBandsInfo[selectedBandNumber - 1].color = newColor;
        currentBandsInfo[selectedBandNumber - 1].description = newDescription;

        if ( selectedBandNumber === 4 && currentColor === 'none'){
          const thirdBandNumber = 3;
          currentBandsInfo[thirdBandNumber - 1].color = 'black';
          currentBandsInfo[thirdBandNumber - 1].description = '0';
          changeUI('change band color', thirdBandNumber);
        } else if (  selectedBandNumber === 4 && newColor === 'none' ) {
          const thirdBandNumber = 3;
          currentBandsInfo[thirdBandNumber - 1].color = 'black';
          currentBandsInfo[thirdBandNumber - 1].description = 'x 1';
          changeUI('change band color', thirdBandNumber);
        }
        changeUI('change band color');
      }
    };
  });
};

export const changeColor = ($element, color) => {
  if ($element.classList.length !== 2) {
    throw 'wrong $element inputed: $element has less than 2 classes';
  }
  $element.classList.remove($element.classList.item(1));
  $element.classList.add(color);
};

export const moveMarker = ($marker, className) => {
  if (!isString(className)) {
    throw 'Wrong input of parametr "class" ';
  }
  if (className === 'resistor__band-marker' || className === 'bands-list__band-marker') {
    const [activeMarker] = document.getElementsByClassName(className + ' show-marker');
    activeMarker.classList.remove('show-marker');
    $marker.classList.add('show-marker');
  } else {
    throw 'Unknown class name passed as parametr "className"';
  }
};

export const saveToLocalHost = () => {
  localStorage.setItem('currentBandsInfo', JSON.stringify(currentBandsInfo));
  localStorage.setItem('result', result.value);
};

export const getResult = () => {

  const result = currentBandsInfo.reduce( (accumulator, bandInfo) => {
    if ( currentBandsInfo.length > 6 ) {
      throw '"currentBandsInfo" has more than 6 band objects';
    }

    const bandNumber = bandInfo.bandNumber;
    const fourthBandIndex = 3;

    if (bandNumber === 2) {
      return accumulator.description + bandInfo.description;
    }

    if ((bandNumber === 3 && currentBandsInfo[fourthBandIndex].color === 'none') ||
        (bandNumber === 4 && bandInfo.color !== 'none')) {
      const descriptionSplited = bandInfo.description.split(' ');
      const indexOfMultiplier = 1;
      const indexOfUnits = 2;
      const digitNumber = Number(accumulator);
      const multiplier = parseFloat(descriptionSplited[indexOfMultiplier]);
      const fullNumber = (digitNumber * (multiplier * 100) / 100 ).toString();
      return descriptionSplited.length === 3 ?
        fullNumber + descriptionSplited[indexOfUnits] + '&#x2126' :
        fullNumber + '&#x2126';
    }
    return accumulator + bandInfo.description;
  });
  return result;

};

export const changeUI = (action, bandNumber = selectedBandNumber, toBuildResult = true) => {
  if ( !isNumber(bandNumber) && bandNumber > 6 ) {
    throw ' "selectedNumber" has wrong value! ';
  }
  if ( !isString(action) ) {
    throw 'Wrong input of parametr "action" ';
  }
  const $resistorBand = bandsConstInfoList[bandNumber - 1].$resistorBand;
  const $resistorBandMarker = $resistorBand.childNodes[1];
  const $bandsListElement = bandsConstInfoList[bandNumber - 1].$bandsListBand;
  const $bandsListElementMarker = $bandsListElement.childNodes[1];
  const $bandsListElementDescription = $bandsListElement.childNodes[3];
  const newColor = currentBandsInfo[bandNumber - 1].color;
  const newDescription = currentBandsInfo[bandNumber - 1].description;

  if (action === 'change colors-list') {
    clearColorsList();
    addColorsToList();
    moveMarker($resistorBandMarker, 'resistor__band-marker');
    moveMarker($bandsListElementMarker, 'bands-list__band-marker');
  } else if (action === 'change band color') {
    changeColor($resistorBand, newColor);
    changeColor($bandsListElement, newColor);
    $bandsListElementDescription.innerHTML = newDescription.replace(/ /g, '');
    if (toBuildResult){
      result.value = getResult();
      $resultField.innerHTML = result.value;
      saveToLocalHost();
    }
  } else if (action === 'initialize') {
    const newBandsInfo = JSON.parse(localStorage.getItem('currentBandsInfo'));
    result.value = localStorage.getItem('result');
    newBandsInfo.forEach( bandInfo => {
      const bandNumber = bandInfo.bandNumber;
      const newColor = bandInfo.color;
      const newDescription = bandInfo.description;

      currentBandsInfo[bandNumber - 1].color = newColor;
      currentBandsInfo[bandNumber - 1].description = newDescription;
      changeUI('change band color', bandNumber, false);
    });
    $resultField.innerHTML = result.value;
    changeUI('change colors-list', 1);
  } else {
    throw 'Unknown action entered';
  }
};

changeUI('initialize');

window.onload = () => {
  $bandsList.onclick = event => {
    const {target} = event;
    const isBandBtn = target.classList.contains('bands-list__band-btn');
    if (isBandBtn) {
      const newSelectedBandNumber =  bandsConstInfoList.find( bandInfoObject =>
        bandInfoObject.$bandsListBand === target
      ).bandNumber;
      if (newSelectedBandNumber !== selectedBandNumber) {
        selectedBandNumber = newSelectedBandNumber;
        changeUI('change colors-list');
      }
    }
  };
};
