import firebase from 'firebase';
import Communications from 'react-native-communications';

import Settings from '../constants/Settings';
import Meta from '../constants/Meta';

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
  firebase.analytics().logEvent('sent_email_to_support', {
    subject,
    cc,
    bcc,
    body,
  });

  Communications.email([Settings.email], cc, bcc, subject, body);
};
// https://www.npmjs.com/package/react-native-communications
