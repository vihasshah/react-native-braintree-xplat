# react-native-braintree-xplat

[![npm version](https://badge.fury.io/js/react-native-braintree-xplat.svg)](https://badge.fury.io/js/react-native-braintree-xplat)

An effort to merge react-native-braintree and react-native-braintree-android

## iOS Installation

For RN >= 60, simply:

- run `npm install https://github.com/vihasshah/react-native-braintree-xplat.git`
- run `cd ios && pod install && cd ..`

For RN <= 59:

You can use the React Native CLI to add native dependencies automatically:

`$ react-native link`

or do it manually as described below:

1. Run `npm install https://github.com/vihasshah/react-native-braintree-xplat.git --save`
2. Open your project in XCode, right click on `Libraries` and click `Add Files to "Your Project Name"` Look under `node_modules/react-native-braintree-xplat` and add `RCTBraintree.xcodeproj`.
3. Add `libRCTBraintree.a` to `Build Phases -> Link Binary With Libraries`
4. Done!

## Android Installation

Run `npm install react-native-braintree-xplat --save`

### RN 0.29 to RN 0.59

In `android/settings.gradle`

```gradle
...

include ':react-native-braintree-xplat'
project(':react-native-braintree-xplat').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-braintree-xplat/android')
```

In `android/app/build.gradle`

```gradle
...

dependencies {
    ...

    compile project(':react-native-braintree-xplat')
}
```

Register module (in `MainApplication.java`)

```java
import com.pw.droplet.braintree.BraintreePackage; // <--- Import Package
import android.content.Intent; // <--- Import Intent

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new BraintreePackage() // <--- Initialize the package
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}

```

---

### RN 0.28 and under

In `android/settings.gradle`

```gradle
...

include ':react-native-braintree-xplat'
project(':react-native-braintree-xplat').projectDir = file('../node_modules/react-native-braintree-xplat/android')
```

In `android/app/build.gradle`

```gradle
...

dependencies {
    ...

    compile project(':react-native-braintree-xplat')
}
```

Register module (in `MainActivity.java`)

```java
import com.pw.droplet.braintree.BraintreePackage; // <--- Import Package
import android.content.Intent; // <--- Import Intent

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "example";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new BraintreePackage() // <---  Initialize the Package
        );
    }
}

```

[Follow instructions in this GitHub issue](https://github.com/kraffslol/react-native-braintree-xplat/issues/80) to [setup BrowserSwitch](https://developers.braintreepayments.com/guides/client-sdk/setup/android/v2#browser-switch-setup). It's IMPERATIVE that your `application_id` is all lowercase and contains no punctiation aside from periods.

## Usage

### Setup

```js
var BTClient = require('react-native-braintree-xplat');
BTClient.setup(<token>);
```

You can find a demo client token [here](https://developers.braintreepayments.com/start/hello-client/ios/v3).

### Show Payment Screen (Android & iOS)

v.zero

```js
BTClient.showPaymentViewController(options)
  .then(function(nonce) {
    //payment succeeded, pass nonce to server
  })
  .catch(function(err) {
    //error handling
  });
```

**Options**

- [iOS] bgColor - Background color for the view.
- [iOS] tintColor - Tint color for the view.
- [iOS] barBgColor - Background color for the navbar.
- [iOS] barTintColor - Tint color for the navbar.
- [iOS] callToActionText - Text for call to action button. (Works for both Android and iOS)
- threeDSecure - If you want to enable [3DSecure](https://developers.braintreepayments.com/guides/3d-secure/client-side/android/v2), pass an object with an `amount` key that takes a number value

Example:

```js
const options = {
  bgColor: "#FFF",
  tintColor: "orange",
  callToActionText: "Save",
  threeDSecure: {
    amount: 1.0,
  },
};
```

---

**PayPal**

```js
BTClient.showPayPalViewController()
  .then(function(nonce) {
    //payment succeeded, pass nonce to server
  })
  .catch(function(err) {
    //error handling
  });
```

---

**Apple Pay**

```
BTClient.showApplePayViewController({
    merchantIdentifier: 'your.merchant.id',
    paymentSummaryItems: [
        {label: 'Subtotals', amount: subtotals},
        {label: 'Shipping', amount: shipping},
        {label: 'Totals', amount: totals},
    ]
    })
    .then((response) => {
        console.log(response);
        if (response.nonce) {
            // Do something with the nonce
        }
    });
```

## Custom Integration

If you only want to tokenize credit card information, you can use the following:

```js
const card = {
  number: "4111111111111111",
  expirationDate: "10/20", // or "10/2020" or any valid date
  cvv: "400",
};

async function jsGetCardNonce(creditCard: Card = card): string {
  try {
    const nonce = await BTClient.getCardNonce(card);

    return nonce;
  } catch (error) {
    console.log("Error getting card nonce:", error);
    /*
        Note: in iOS, the error handling has been simplified to return one error:

            reject(@"Error getting nonce", @"Cannot process this credit card type.", error);

        See the `getCardNonce` method in RCTBraintree.m for more details + to account for more specific error handling based on what the Braintree SDK returns.

        Reasoning: https://github.com/kraffslol/react-native-braintree-xplat/issues/91

    */

    throw error;
  }
}

// Full list of card parameters:
type Card = {
  number: string,
  cvv: string,
  expirationDate: string,
  cardholderName: string,
  firstName: string,
  lastName: string,
  company: string,
  countryName: string,
  countryCodeAlpha2: string,
  countryCodeAlpha3: string,
  countryCodeNumeric: string,
  locality: string,
  postalCode: string,
  region: string,
  streetAddress: string,
  extendedAddress: string,
};
```

## One Touch on iOS

To take advantage of [One Touch](https://developers.braintreepayments.com/guides/one-touch/overview/ios/v3), there are additional setup required:

1. Register a URL scheme in Xcode (should always start with YOUR Bundle ID)
   [More info here](https://developers.braintreepayments.com/guides/paypal/client-side/ios/v3#register-a-url-type) TL;DR

#### Add CFBundleURLTypes to Info.Plist

```js
	<key>CFBundleURLTypes</key>
	<array>
	<dict>
		<key>CFBundleTypeRole</key>
		<string>Editor</string>
		<key>CFBundleURLName</key>
		<string>your.bundle.id</string>
		<key>CFBundleURLSchemes</key>
		<array>
			<string>your.bundle.id.payments</string>
		</array>
	</dict>
	</array>
```

#### WhiteList

If your app is built using iOS 9 as its Base SDK, then you must add URLs to a whitelist in your app's info.plist

```js
   <key>LSApplicationQueriesSchemes</key>
   <array>
     <string>com.paypal.ppclient.touch.v1</string>
     <string>com.paypal.ppclient.touch.v2</string>
     <string>com.venmo.touch.v2</string>
   </array>
```

2. For iOS: Use setupWithURLScheme instead, passing the url scheme you have registered in previous step

```js
var BTClient = require("react-native-braintree");
BTClient.setupWithURLScheme(token, "your.bundle.id.payments");
```

#### For xplat, you can do something like this:

```js
if (Platform.OS === "ios") {
  BTClient.setupWithURLScheme(token, "your.bundle.id.payments");
} else {
  BTClient.setup(token);
}
```

3. Add this delegate method (callback) to your AppDelegate.m

```objc
#import "RCTBraintree.h"

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
return [[RCTBraintree sharedInstance] application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}
```

## Credits

Big thanks to [@alanhhwong](https://github.com/alanhhwong) and [@surialabs](https://github.com/surialabs) for the original ios & android modules.
