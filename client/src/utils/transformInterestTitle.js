import Meta from '../constants/Meta';

const labels = {
  male: Meta.men,
  female: Meta.women,
  both: Meta.both,
};
export default interest => labels[interest.toLowerCase()];
