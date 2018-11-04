'use strict';
import {
  selectBandNumberById, 
  createColorElement, 
  colorsListRemoveChilds,
  changeBandColor
} from './main';

describe('selectBandNumberById::', () => {
  it('Should return band index in array', () => {
    window.onload = () => {
      expect(selectBandNumberById('first-band-color')).toEqual(0);
      expect(selectBandNumberById('second-band-color')).toEqual(1);
      expect(selectBandNumberById('third-band-color')).toEqual(2);
      expect(selectBandNumberById('fourth-band-color')).toEqual(3);
      expect(selectBandNumberById('fifth-band-color')).toEqual(4);
      expect(selectBandNumberById('sixth-band-color')).toEqual(5); 
    };
  });
  it('Should throw error, because there are no such band id', () => {
    window.onload = () => {
      expect(selectBandNumberById('wrong-input')).toThrow(
        'Unexpected result of getBandNumberById(): unknown id'
      );
      
    };
  });
});

const $li = document.createElement('li');
$li.className = 'colors-list__element';
$li.id = 'color-red';
$li.innerHTML = `
    <div class="colors-list__color-circle red"></div>
    <span class="colors-list__color-name">red</span>
    <span class="colors-list__color-description">2</span>
  `;

describe('createColorElement::', () => {
  it('Should return li element with structure of colors-list__element', () => {
    expect(createColorElement('red', '2')).toEqual($li);
  });
});

const $ul = document.createElement('ul');
const $emptyUl = document.createElement('ul');
$ul.appendChild(document.createElement('li'));
describe('colorsListRemoveChilds::', () => {
  it('Should remove all childs and return true', () => {
    window.onload = () => {
      expect(colorsListRemoveChilds($ul)).toEqual(true);
      expect($ul).toEqual($emptyUl);
      for (let i = 0; i < 13; i++) {
        $ul.appendChild(document.createElement('li'));
      }
      expect(colorsListRemoveChilds($ul)).toEqual(true);
    };
  });

  it('Should throw error when $element has more than 13 childs', () => {
    window.onload = () => {
      for (let i = 0; i < 14; i++) {
        $ul.appendChild(document.createElement('li'));
      }
      expect(colorsListRemoveChilds($ul)).toThrow('"while" loop gone out of color number limit');
    };
  });
});

const $div = document.createElement('div');
const redClassName = 'colors-list__element red';
const blueClassName = 'colors-list__element blue';
$div.className = redClassName;
describe('changeBandColor::', () => {
  it(
    'Should change second class of element to color added in parametrs', 
    () => {
      changeBandColor($div, 'blue');
      expect($div.className).toEqual(blueClassName);  
    }
  );

  it(
    'Should throw error when classList.length !== 2', 
    () => {
      window.onload = () => {
        $div.className = 'wrongName';
        expect(changeBandColor($div, 'blue')).toThrow(
          'wrong $element inputed: $element doesnt have 2 classes');
      };
    }
  );
});