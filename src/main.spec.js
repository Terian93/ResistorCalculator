import {selectBandNumberById} from './main';

describe('selectBandNumberById::', () => {
  it('Should return band index in array', () => {
    expect(selectBandNumberById('first-band-color')).toEqual(0);
    expect(selectBandNumberById('second-band-color')).toEqual(1);
    expect(selectBandNumberById('third-band-color')).toEqual(2);
    expect(selectBandNumberById('fourth-band-color')).toEqual(3);
    expect(selectBandNumberById('fifth-band-color')).toEqual(4);
    expect(selectBandNumberById('sixth-band-color')).toEqual(5);
  });
});
