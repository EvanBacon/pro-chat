package host.exp.exponent.generated;

import com.facebook.common.internal.DoNotStrip;

import java.util.ArrayList;
import java.util.List;

import host.exp.exponent.BuildConfig;
import host.exp.exponent.Constants;

@DoNotStrip
public class AppConstants {

  public static final String VERSION_NAME = "2.2.0";
  public static String INITIAL_URL = "exp://exp.host/@bacon/bute";
  public static final boolean IS_DETACHED = true;
  public static final String SHELL_APP_SCHEME = "expda03597637ef40b18b668276446d5b1a";
  public static final String RELEASE_CHANNEL = "default";
  public static boolean SHOW_LOADING_VIEW_IN_SHELL_APP = false;
  public static final List<Constants.EmbeddedResponse> EMBEDDED_RESPONSES;

  static {
    List<Constants.EmbeddedResponse> embeddedResponses = new ArrayList<>();

    // ADD EMBEDDED RESPONSES HERE
    // START EMBEDDED RESPONSES
    // END EMBEDDED RESPONSES
    EMBEDDED_RESPONSES = embeddedResponses;
  }

  // Called from expoview/Constants
  public static Constants.ExpoViewAppConstants get() {
    Constants.ExpoViewAppConstants constants = new Constants.ExpoViewAppConstants();
    constants.VERSION_NAME = VERSION_NAME;
    constants.INITIAL_URL = INITIAL_URL;
    constants.IS_DETACHED = IS_DETACHED;
    constants.SHELL_APP_SCHEME = SHELL_APP_SCHEME;
    constants.RELEASE_CHANNEL = RELEASE_CHANNEL;
    constants.SHOW_LOADING_VIEW_IN_SHELL_APP = SHOW_LOADING_VIEW_IN_SHELL_APP;
    constants.EMBEDDED_RESPONSES = EMBEDDED_RESPONSES;
    constants.ANDROID_VERSION_CODE = BuildConfig.VERSION_CODE;
    return constants;
  }
}
