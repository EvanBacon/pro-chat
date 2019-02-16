import Meta from '../constants/Meta';

const interests = {
  male: Meta.men,
  female: Meta.women,
  both: Meta.both,
};

const genders = {
  male: Meta.male,
  female: Meta.female,
};

export function interest(value) {
  return interests[value.toLowerCase()];
}

export function gender(value) {
  return genders[value.toLowerCase()];
}
