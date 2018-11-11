import './style.scss';
require('./assets/img/favicon.ico');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

import {
  currentBandsInfo, 
  bandsConstInfoList, 
  result
} from './JS/bandsInfo';
import { 
  isString, 
  isNull 
} from 'util';


//Use number 1-6 or decremented for arrays 0-5?
let selectedBandNumber = 1;

const $resultField = document.getElementById('result');
const $bandsList = document.getElementById('bands-list');
const $colorsList = document.getElementById('colors-list');

export const clearColorsList = $colorsList => {
  if (($colorsList.childNodes).length > 13) {
    throw '"while" loop gone out of color number limit';
  }
  while ($colorsList.firstChild) {
    $colorsList.firstChild.removeEventListener('click', colorClickEvent.bind());
    $colorsList.removeChild($colorsList.firstChild);
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

/*
 * In this event is holding cases when not selected bands must to change,
 * when selected band is changed to specific color:
 * 1) 3rd band uses as multiplier when 4th band has "none" color.
 * In this case when 4th band changes color to "none" 3rd band
 * changes to "black" color and uses multiplier(4th bands) color-list
 * 2) 4th band must be "none" color when 5th band is "none" color
 * 3) 6th band must be "none" color when 4th or 5th color is "none"
 */
const colorClickEvent = colorElementObj => {
  const currentColor = currentBandsInfo[selectedBandNumber - 1].color;
  const newColor = colorElementObj.color;
  const newDescription = colorElementObj.description;
  const thirdBandInfo = currentBandsInfo[2];
  const fourthBandInfo = currentBandsInfo[3];
  const sixthBandInfo = currentBandsInfo[5];

  if (currentColor !== newColor) {
    currentBandsInfo[selectedBandNumber - 1].color = newColor;
    currentBandsInfo[selectedBandNumber - 1].description = newDescription;

    if ( selectedBandNumber === 4 && newColor !== 'none'){
      thirdBandInfo.color = 'black';
      thirdBandInfo.description = '0';
      changeBandColor(thirdBandInfo.bandNumber);
    } else if (selectedBandNumber === 4 && newColor === 'none') {
      thirdBandInfo.color = 'black';
      thirdBandInfo.description = 'x 1 &#x2126';
      changeBandColor(thirdBandInfo.bandNumber);

      sixthBandInfo.color = 'none';
      sixthBandInfo.description = '';
      changeBandColor(sixthBandInfo.bandNumber);
    } else if (selectedBandNumber === 5 && newColor === 'none' ) {
      if (fourthBandInfo.color !== 'none') {
        thirdBandInfo.color = 'black';
        thirdBandInfo.description = 'x 1 &#x2126';
        changeBandColor(thirdBandInfo.bandNumber);

        fourthBandInfo.color = 'none';
        fourthBandInfo.description = '';
        changeBandColor(fourthBandInfo.bandNumber);
      }

      sixthBandInfo.color = 'none';
      sixthBandInfo.description = '';
      changeBandColor(sixthBandInfo.bandNumber);
    } 

    changeBandColor();
  }
};

export const addColorsToList = (
  bandNumber = selectedBandNumber, 
  testingFunction = false
) => {
  const fourthBandColor = currentBandsInfo[3].color;
  const fifthBandColor = currentBandsInfo[4].color;
  const numberOfColorsList = bandNumber === 3 && fourthBandColor === 'none' ?
    4 : bandNumber;
  const bandConstInfo = JSON.parse(JSON.stringify(bandsConstInfoList[numberOfColorsList - 1]));

  /*
   * Removing "none" color from colors list when third band is used as multiplier
   * because fourth band has "none" color
   */
  if ( bandNumber === 3 && numberOfColorsList === 4) {
    bandConstInfo.colorsList.shift();
  }

  /*
   * Removing all colors except "none" from colors list for 6th band,
   * when 4th or 5th band has "none" color
   */
  if ( bandNumber === 6 && (fourthBandColor === 'none' || fifthBandColor === 'none')) {
    bandConstInfo.colorsList = bandConstInfo.colorsList.filter(
      colorObject => colorObject.color === 'none');
  }
  /*
   * Removing all colors except "none" from colors list for 4th band,
   * when 5th band has "none" color
   */
  if ( bandNumber === 4 && fifthBandColor === 'none') {
    bandConstInfo.colorsList = bandConstInfo.colorsList.filter(
      colorObject => colorObject.color === 'none');
  }

  if (!testingFunction) {
    bandConstInfo.colorsList.forEach( colorElementObj => {
      const $colorElement = createColorElement(colorElementObj.color, colorElementObj.description);
      $colorsList.appendChild($colorElement);
      const $colorBtn = document.getElementById(`color-${colorElementObj.color}`);
      $colorBtn.addEventListener('click', colorClickEvent.bind(event, colorElementObj));
    });
  }
  return bandConstInfo.colorsList;
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
    throw 'Wrong input of parametr "className" ';
  }
  if (className === 'resistor__band-marker' || className === 'bands-list__band-marker') {
    const [activeMarker] = document.getElementsByClassName(className + ' show-marker');
    activeMarker.classList.remove('show-marker');
    $marker.classList.add('show-marker');
  } else {
    throw 'Unknown class name passed as parametr "className"';
  }
};

export const getResult = () => {

  const result = currentBandsInfo.reduce( (accumulator, bandInfo) => {
    const bandNumber = bandInfo.bandNumber;
    const fourthBandColor = currentBandsInfo[3].color;
    let resultString = accumulator + bandInfo.description;

    if ( currentBandsInfo.length > 6 ) {
      throw '"currentBandsInfo" has more than 6 band objects';
    }

    if (bandNumber === 2) {
      resultString = accumulator.description + bandInfo.description;
    }

    if ((bandNumber === 3 && fourthBandColor === 'none') ||
        (bandNumber === 4 && fourthBandColor !== 'none')) {
      const descriptionSplited = bandInfo.description.split(' ');
      const digitNumber = parseInt(accumulator);
      const multiplier = parseFloat(descriptionSplited[1]);
      const units = descriptionSplited[2];
      const fullNumber = (digitNumber * (multiplier * 100) / 100 ).toString();
      resultString = fullNumber + units;
    }
    return resultString;
  });
  return result;
};

export const saveToLocalHost = () => {
  localStorage.setItem('currentBandsInfo', JSON.stringify(currentBandsInfo));
  localStorage.setItem('result', result.value);
};

const changeColorsList = (bandNumber = selectedBandNumber) => {
  const $resistorBandMarker = bandsConstInfoList[bandNumber - 1].$resistorBand.childNodes[1];
  const $bandsListElementMarker = bandsConstInfoList[bandNumber - 1].$bandsListBand.childNodes[1];

  clearColorsList($colorsList);
  addColorsToList();
  moveMarker($resistorBandMarker, 'resistor__band-marker');
  moveMarker($bandsListElementMarker, 'bands-list__band-marker');
};

const changeBandColor = (bandNumber = selectedBandNumber, toBuildResult = true) => {
  const $resistorBand = bandsConstInfoList[bandNumber - 1].$resistorBand;
  const $bandsListElement = bandsConstInfoList[bandNumber - 1].$bandsListBand;
  const $bandsListElementDescription = $bandsListElement.childNodes[3];
  const newColor = currentBandsInfo[bandNumber - 1].color;
  const newDescription = currentBandsInfo[bandNumber - 1].description;

  changeColor($resistorBand, newColor);
  changeColor($bandsListElement, newColor);
  $bandsListElementDescription.innerHTML = newDescription.replace(/ /g, '');
  if (toBuildResult){
    result.value = getResult();
    $resultField.innerHTML = result.value;
    saveToLocalHost();
  }
};

const initialize = () => {
  const newBandsInfo = JSON.parse(localStorage.getItem('currentBandsInfo'));
  if (!isNull(newBandsInfo)) {
    result.value = localStorage.getItem('result');
    newBandsInfo.forEach( bandInfo => {
      const bandNumber = bandInfo.bandNumber;
      const newColor = bandInfo.color;
      const newDescription = bandInfo.description;

      currentBandsInfo[bandNumber - 1].color = newColor;
      currentBandsInfo[bandNumber - 1].description = newDescription;
      changeBandColor(bandNumber, false);
    });
  }
  $resultField.innerHTML = result.value;
  changeColorsList(1);
};

window.onload = () => {
  initialize();
  $bandsList.addEventListener('click', event => {
    const {target} = event;
    const isBandBtn = target.classList.contains('bands-list__band-btn');
    if (isBandBtn) {
      const newSelectedBandNumber =  bandsConstInfoList.find( bandInfoObject =>
        bandInfoObject.$bandsListBand === target
      ).bandNumber;
      if (newSelectedBandNumber !== selectedBandNumber) {
        selectedBandNumber = newSelectedBandNumber;
        changeColorsList();
      }
    }
  });
};
