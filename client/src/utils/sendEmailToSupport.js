import Communications from 'react-native-communications';

import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import firebase from '../universal/firebase';

export const Subjects = {
  general: Meta.email_subject_general,
  report: Meta.email_subject_report,
  bug: Meta.email_subject_bug,
};
export default ({
  cc, bcc, subject, body,
}) => {
  // if (!Subjects.hasOwnProperty(subject)) {
  //     return;
  // }
  if (firebase.analytics) {
    firebase.analytics().logEvent('sent_email_to_support', {
      subject,
      cc,
      bcc,
      body,
    });
  }

  Communications.email([Settings.email], cc, bcc, subject, body);
};
// https://www.npmjs.com/package/react-native-communications
