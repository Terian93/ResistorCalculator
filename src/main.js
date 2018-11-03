const $bandsList = document.getElementById('bands-list');
const $firstBand = document.getElementById('first-band');
const $secondBand = document.getElementById('second-band');
const $thirdBand = document.getElementById('third-band');
const $fourthBand = document.getElementById('fourth-band');
const $fifthBand = document.getElementById('fifth-band');
const $sixthBand = document.getElementById('sixth-band');
let selectedBandNumber = 0;
let $bandMarker;
let $bandDescriprion;
const bandsObject = [
  { color: 'grey', description: '8' },
  { color: 'red', description: '2' },
  { color: 'orange', description: 'x1k' },
  { color: 'none', description: '' },
  { color: 'gold', description: '5%' },
  { color: 'none', description: '' }
];
$bandsList.onclick = event => {
  const {target} = event;
  const isBandBtn = target.classList.contains('bands-list__band-btn');
  if (isBandBtn) {
    $bandMarker = target.childNodes[1];
    $bandDescriprion = target.childNodes[3];
    const bandColorMarkersList = document.getElementsByClassName('bands-list__band-marker');
    Array.prototype.forEach.call(bandColorMarkersList, element => {
      element.className = 'bands-list__band-marker';
    });
    $bandMarker.className = 'bands-list__band-marker show-marker';
    selectedBandNumber = selectBandNumberById(target.id);
  }

};

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


