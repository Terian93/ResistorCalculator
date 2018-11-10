import {
  createColorElement,
  clearColorsList,
  addColorsToList,
  changeColor,
  moveMarker,
  getResult
} from './main';
import {result, currentBandsInfo, bandsConstInfoList} from './JS/bandsInfo';
//pre-test save
const resultSave = JSON.parse(JSON.stringify(result));
const currentBandsInfoSave = JSON.parse(JSON.stringify(currentBandsInfo));

describe('createColorElement()::', () => {
  const expectedInnerHTML = `
    <div class="colors-list__color-circle black"></div>
    <span class="colors-list__color-name">black</span>
    <span class="colors-list__color-description">x100Ω</span>
  `;
  const colorElement = createColorElement('black', 'x 100 &#x2126');
  it('innerHTML of returned element', () =>{
    expect(colorElement.innerHTML).toEqual(expectedInnerHTML);  
  });
  it('Id of returned element', () =>{
    expect(colorElement.id).toEqual('color-black');
  });
  it('className of returned element', () =>{
    expect(colorElement.className).toEqual('colors-list__element');   
  });
});

describe('clearColorsList()::', () => {
  const $ul = document.createElement('ul');
  const $emptyUl = document.createElement('ul');
  for (let i = 0; i < 13; i++) {
    $ul.appendChild(document.createElement('li'));
  }
  it('Returns true when process finished', () => {
    expect(clearColorsList($ul)).toEqual(true);
  });
  it('Processed list is empty', () => {
    expect($ul).toEqual($emptyUl);
  });
  
  it('Should throw error when $ul has more than 13 childs', () => {
    for (let i = 0; i < 15; i++) {
      $ul.appendChild(document.createElement('li'));
    }
    const test = () => {
      clearColorsList($ul);
    };
    expect(test).toThrow('"while" loop gone out of color number limit');
  });
});
describe('addColorsToList()::', () => {
  it('First band colors-list passed', () => {
    expect(addColorsToList(1, true)).toEqual(bandsConstInfoList[0].colorsList);
  });
  
  it('Third band colors-list passed', () => {
    expect(addColorsToList(3, true)).toEqual([
      {color: 'black', description: 'x 1 &#x2126'},
      {color: 'brown', description: 'x 10 &#x2126'},
      {color: 'red', description: 'x 100 &#x2126'},
      {color: 'orange', description: 'x 1 K&#x2126'},
      {color: 'yellow', description: 'x 10 K&#x2126'},
      {color: 'green', description: 'x 100 K&#x2126'},
      {color: 'blue', description: 'x 1 M&#x2126'},
      {color: 'violet', description: 'x 10 M&#x2126'},
      {color: 'grey', description: 'x 100 M&#x2126'},
      {color: 'white', description: 'x 1 G&#x2126'},
      {color: 'gold', description: 'x 0.1 &#x2126'},
      {color: 'silver', description: 'x 0.01 &#x2126'}
    ]);
    currentBandsInfo[3].color = 'orange';
    currentBandsInfo[3].description = 'x 1 k&#x2126';
    expect(addColorsToList(3, true)).toEqual(bandsConstInfoList[2].colorsList);
  });
  it('Fourth band colors-list passed', () => {
    expect(addColorsToList(4, true)).toEqual(bandsConstInfoList[3].colorsList);
    currentBandsInfo[4].color = 'none';
    currentBandsInfo[4].description = '';
    expect(addColorsToList(4, true)).toEqual([
      {color: 'none', description: ''}
    ]);
  });
  it('Fifth band colors-list passed', () => {
    expect(addColorsToList(5, true)).toEqual(bandsConstInfoList[4].colorsList);
  });
  it('Sixth band colors-list passed', () => {
    expect(addColorsToList(6, true)).toEqual([
      {color: 'none', description: ''}
    ]);
    currentBandsInfo[4].color = 'brown';
    currentBandsInfo[4].description = ' 1%';
    expect(addColorsToList(6,true)).toEqual(bandsConstInfoList[5].colorsList);
  });
});

describe('changeColor()::', () => {
  const $element = document.createElement('div');
  $element.className = 'class1 class2';
  it('changes className', () =>{
    changeColor($element, 'red');
    expect($element.className).toEqual('class1 red');  
  });
  it('Throws error when classList.length !== 2', () =>{
    $element.className = 'class1';
    const test = () => {
      changeColor($element, 'red');
    };
    expect(test)
      .toThrow('wrong $element inputed: $element has less than 2 classes');
  });
});

describe('moveMarker()::', () => {
  it('changes marker at list', () =>{
    document.body.innerHTML = `
    <div class="container">
      <div class="resistor__band-marker show-marker"></div>
      <div class="resistor__band-marker" id="markIt"></div>
      <div class="resistor__band-marker "></div>
      <div class="resistor__and-marker"></div>
      <div class="resistor__band-marker"></div>
      <div class="resistor__band-marker"></div>
    </div>
    `;
    const $marker = document.getElementById('markIt');
    moveMarker($marker,'resistor__band-marker');
    expect(document.body.innerHTML).toEqual(`
    <div class="container">
      <div class="resistor__band-marker"></div>
      <div class="resistor__band-marker show-marker" id="markIt"></div>
      <div class="resistor__band-marker "></div>
      <div class="resistor__and-marker"></div>
      <div class="resistor__band-marker"></div>
      <div class="resistor__band-marker"></div>
    </div>
    `);  
  });
  it('Throws error when class is unknown or wrong type', () =>{
    document.body.innerHTML = `
    <div class="container">
      <div class="resistor__band-marker show-marker"></div>
      <div class="resistor__band-marker" id="markIt"></div>
      <div class="resistor__band-marker "></div>
      <div class="resistor__and-marker"></div>
      <div class="resistor__band-marker"></div>
      <div class="resistor__band-marker"></div>
    </div>
    `;
    const $marker = document.getElementById('markIt');
    const test1 = () => {
      moveMarker($marker,'unknown_class');
    };
    const test2 = () => {
      moveMarker($marker, 111);
    };
    expect(test1).toThrow();
    expect(test2).toThrow();
  });
});
describe('getResult()::', () => {
  const defBands = () => {
    currentBandsInfo[0].color = 'brown';
    currentBandsInfo[0].description = '1';
    currentBandsInfo[1].color = 'brown';
    currentBandsInfo[1].description = '1';
    currentBandsInfo[2].color = 'black';
    currentBandsInfo[2].description = 'x 1 &#x2126';
    currentBandsInfo[3].color = 'none';
    currentBandsInfo[3].description = '';
    currentBandsInfo[4].color = 'none';
    currentBandsInfo[4].description = ' 20%';
    currentBandsInfo[5].color = 'none';
    currentBandsInfo[5].description = '';
  };
  it('default result', () =>{
    defBands();
    expect(getResult()).toEqual('11&#x2126 20%');  
  });
  it('1st band change', () => {
    currentBandsInfo[0].color = 'black';
    currentBandsInfo[0].description = '0';
    expect(getResult()).toEqual('1&#x2126 20%'); 
  });
  it('2nd band change', () => {
    currentBandsInfo[1].color = 'red';
    currentBandsInfo[1].description = '2';
    expect(getResult()).toEqual('2&#x2126 20%'); 
  });
  it('3rd band change', () => {
    currentBandsInfo[2].color = 'brown';
    currentBandsInfo[2].description = 'x 10 &#x2126';
    expect(getResult()).toEqual('20&#x2126 20%'); 
  });
  it('4th band change', () => {
    currentBandsInfo[2].color = 'black';
    currentBandsInfo[2].description = '0';
    currentBandsInfo[3].color = 'silver';
    currentBandsInfo[3].description = 'x 0.01 &#x2126';
    currentBandsInfo[4].color = 'silver';
    currentBandsInfo[4].description = ' 10%';
    expect(getResult()).toEqual('0.2&#x2126 10%'); 
  });
  it('5th band change', () => {
    currentBandsInfo[4].color = 'grey';
    currentBandsInfo[4].description = ' 0.05%';
    expect(getResult()).toEqual('0.2&#x2126 0.05%'); 
  });
  it('6th band change', () => {
    currentBandsInfo[5].color = 'grey';
    currentBandsInfo[5].description = ' 1ppm/K';
    expect(getResult()).toEqual('0.2&#x2126 0.05% 1ppm/K'); 
  });
});

//Post-test returning to default values
currentBandsInfo.forEach( band => {
  band.color = currentBandsInfoSave[band.bandNumber - 1].color;
  band.description = currentBandsInfoSave[band.bandNumber - 1].description;
});
result.value = resultSave.value;