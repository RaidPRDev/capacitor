package com.ecmo.bedside;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;
import com.microsoft.clarity.Clarity;
import com.microsoft.clarity.ClarityConfig;
import com.microsoft.clarity.models.ApplicationFramework;
import com.microsoft.clarity.models.LogLevel;
import java.util.Arrays;
import java.util.Collections;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class MainActivity extends BridgeActivity {
  @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Your custom code here
        ClarityConfig config = new ClarityConfig(
          "oztc10g5eg",
          null,                                             // Default user id
          LogLevel.None,
          false,                                            // Disallow metered network usage
          true,                                             // Enable web view capturing
          Collections.singletonList("*"),                   // Allowed domains
          ApplicationFramework.Native,
          Collections.emptyList(),                          // Allowed activities
          Collections.emptyList(),                          // Disallowed activities (ignore activities)
          false,                                            // Disable on low-end devices
          null
        );

        Clarity.initialize(getApplicationContext(), config);
    }
}