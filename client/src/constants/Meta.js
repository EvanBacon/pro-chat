import expoApp from '../../app.json';
import Settings from './Settings';

const { user, userPlural } = Settings;
// const { name, version, build } = expoApp.expo;

export const strings = {
  en: {
    no_location_title: 'No Location Found',
    no_location_subtitle: `We’ve recognized that you don’t have your current location on. In order to search for ${userPlural}, please turn it on.`,
    no_location_action: 'Turn Location On',

    no_messages_title: 'No Messages Yet',
    no_messages_subtitle: `Go back to the home screen and start looking for hot ${userPlural}`,
    no_messages_action: 'Start Swiping',

    no_matches_title: 'No Matches Yet',
    no_matches_subtitle: `Go back to the home screen and start looking for hot ${userPlural}`,
    no_matches_action: 'Start Swiping',

    email_subject_general: 'Seeking Support... [General]',
    email_subject_report: 'I Need To Report This! [Report]',
    email_subject_bug: 'I Found A Bug! [Bug]',

    option_report: `Report ${user}`,
    option_recommend: `Recommend ${user}`,
    option_cancel: 'Cancel',

    blocking_button_title: 'Unblock',

    block: 'Block',
    blocking: 'Blocking',
    blocked: 'Blocked',
    blocking_outward: 'You have chosen to block this user.',
    blocking_inward: `You cannot view this ${user}`,

    try_again: 'Try Again',
    no_more_users_title: `No ${userPlural} Around`,
    no_more_users_subtitle: `We cannot find any ${userPlural} in your area that you'd be interested in... Try again later, and invite your friends!`,

    out_of_users_title: `No More ${userPlural} Left`,
    out_of_users_subtitle: `You can swipe through them again, while we find more ${user}!`,
    out_of_users_action: 'Start Swiping',

    rated_as: 'Rated As',
    tap_to_get_rating: 'Tap to get a Rating!',

    matched_with_title: 'Matched with',
    matched_with_subtitle: `Now it’s time to message, and connect those ${userPlural}. ${user} to ${user}. Young thug.`,
    message_action: 'Rated As',
    dismiss: 'Dismiss',

    log_out: 'Log Out',
    under_review_title: `Your ${user} is Under Review`,
    under_review_subtitle:
      "You've been reported by users too many times. We will be reviewing your account to determine what action needs to be made.",

    uploading_profile_image: 'Uploading Belfie, Please Wait...',
    upload_profile_image: `Upload New ${user} Photo`,
    about_placeholder: `Say something about your ${user}...`,
    meta_info_like_title: 'You Likey?',
    meta_info_like_subtitle: `Swipe right when the ${user} dope. If they like you back, we'll let you know!`,
    meta_info_like_confirm: 'Ok!',
    meta_info_dislike_title: 'Not Interested?',
    meta_info_dislike_subtitle: `Swipe left when you aren't feeling the current ${user}`,
    meta_info_dislike_confirm: 'Aight',

    meta_info_learn_more_title: 'Want to know more?',
    meta_info_learn_more_subtitle: `Tap the ${user} to learn more`,
    meta_info_learn_more_confirm: 'Got it',

    sign_in_title: 'Get Signed Up',
    sign_in_subtitle: `Logging in with Facebook makes searching for ${userPlural} fast and a super easy login.`,
    sign_in_action: 'Sign in with Facebook',

    report_user_title: 'Report User',
    report_user_action: 'Submit',

    report_user_question: 'What Are You Reporting?',

    report_photo_is_not_a_users_title: `Photo is Not A ${user}`,
    report_photo_is_not_a_users_subtitle:
      'What is the photo of? Our algorithm can better prevent this kind of image if you can be descriptive!',

    report_harassment_title: 'Harassment',
    report_harassment_subtitle: 'Please tell us what happened',

    report_spam_title: 'Spam',
    report_spam_subtitle: 'How are you being spammed?',

    report_other_title: 'Other',
    report_other_subtitle: 'Help us, help you!',

    report_user_placeholder: 'Say something...',
    report_user_block_hint:
      'If this user is really bothering you, you could always block them and never see them again!',

    men: 'Men',
    women: 'Women',
    both: 'Both',

    male: 'Male',
    female: 'Female',

    no_messages_placeholder: 'Send a message!',

    delete_message_channel_title: 'Delete Channel',
    delete_message_channel_subtitle: 'Are you sure?',

    delete_message_channel_action: 'Yes, Delete',
    delete_message_channel_destructive: 'Cancel',

    share_dialog_title: `Share this ${user}`,
    share_title: `${user} Alert!`,
    share_message: `I found a ${user} for you. Get on ${user} Alert and let me know what you think! 🍑`,

    select_image_option_camera: 'Take Selfie',
    select_image_option_library: 'Choose from Library',
    select_image_option_destructive: 'Cancel',
    select_image_option_facebook: 'Choose Photo from Facebook',

    underage_title: `Underaged ${user} Found...`,
    underage_subtitle:
      'Welp, according to Facebook, you’re under 17. If you are actually over 17, please fix this in Facebook.',
    underage_action: `Sign Out of ${user} Alert`,

    notifications: 'Notifications',
    the_team: 'The Team!',
    eula: 'EULA',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    licenses: 'Libraries',
    contact: 'Contact',
    interested_in: 'Interested In',
    help_support: 'Help & Support',

    app_name: expoApp.name,
    settings_version: `Version ${expoApp.version}`,
    settigns_build: `Build 5 ${expoApp.build}`,
    popular_title: `Popular ${user}`,
    user_interests_title: 'Interests',
    matches: 'Matches',
    messages: 'Messages',
    is_typing: 'is typing...',
    get_location_action: 'Enable Location',
    get_location_title: 'We Need Your Location',
    no_tags_inward:
      "We couldn't find any of your interests... Like some things on Facebook and they'll show up here!",
    no_tags_outward: "doesn't have any interests...",
    updating: 'Updating...',
    eula_statement: 'By registering, you agree to our ',
    and_our: ' and our ',
    privacy_policy_error: 'Could not access Privacy at this time 😱',
    terms_of_service_error: 'Could not access Terms at this time 😱',
    empty_message_title: 'Matched with',
    empty_message_question: 'Why do you think',
    empty_message_adjective: 'is lit?',
    user_blocked_message:
      'User Has Been Blocked! It may take up to 24 hours for the changes to take full effect.',
    user_blocked_error:
      'We encountered an error trying to block this user, please try again later!',

    on_boarding_signin_title: 'Get Signed Up',
    on_boarding_signin_subtitle: `Logging in with Facebook makes searching for ${userPlural} fast and a super easy login.`,

    on_boarding_matching_title: `Matching ${userPlural}`,
    on_boarding_matching_subtitle:
      'When you and the person of interest match butts, you’ll be able to message them.',

    on_boarding_anon_title: 'Stay Anonymous',
    on_boarding_anon_subtitle:
      'Using a photo of your butt allows you to stay anonymous. People can’t see your face unless you send a photo.',

    on_boarding_location_title: 'Location Enabling',
    on_boarding_location_subtitle_undetermined: `${user} Alert needs to use your location to offer all of the great ${userPlural} in your area. Accept?`,
    on_boarding_location_subtitle_denied: `${user} Alert needs to use your location to offer all of the great ${userPlural} in your area. Please enable in Settings`,

    on_boarding_gender_title: 'What are you?…',
    on_boarding_gender_subtitle:
      'We’ve detected that you don’t have a gender selected on Facebook.',

    on_boarding_interest_title: "What's your interest?",
    on_boarding_interest_subtitle: `Select what kind of ${user} you're into. You can also select both male and female.`,

    on_boarding_swiping_title: 'Swiping Actions',
    on_boarding_swiping_subtitle: `Swipe the ${userPlural} you see to the left to dismiss, and to the right if you like it.`,

    on_boarding_picture_title: `Add your ${user}`,
    on_boarding_picture_subtitle: `Let's get a picture of your ${user}. Click below to add or take a ${user} photo.`,

    on_boarding_finished_title: 'Congratulations!',
    on_boarding_finished_subtitle: `Now get swiping, it's ${user} time!`,
  },
  fr: {},
};

export default strings.en;
