package com.sweetrush.staging.elso;

import com.getcapacitor.BridgeActivity;

import com.microsoft.clarity.Clarity;
import com.microsoft.clarity.ClarityConfig;
import com.microsoft.clarity.models.ApplicationFramework;
import com.microsoft.clarity.models.LogLevel;

public class MainActivity extends BridgeActivity {
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Your custom code here
        ClarityConfig config = new ClarityConfig(
          "oztc10g5eg",
          null, // Default user id
          LogLevel.None,
          false, // Disallow metered network usage
          true, // Enable web view capturing
          Collections.singletonList("*"), // Allowed domains
          ApplicationFramework.Native,
          Collections.emptyList(), // Allowed activities
          Collections.emptyList(), // Disallowed activities (ignore activities)
          false // Disable on low-end devices
        );

        Clarity.initialize(getApplicationContext(), config);
    }
}
