package com.sweetrush.staging.elso.plugins.clarity;

import android.util.Log;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import java.util.Arrays;
import java.util.Collections;

import com.microsoft.clarity.Clarity;
import com.microsoft.clarity.ClarityConfig;
import com.microsoft.clarity.models.ApplicationFramework;
import com.microsoft.clarity.models.LogLevel;

public class MyClarityCapacitator {

    private Context context;

    MyClarityCapacitator(Context context) {
        this.context = context.getApplicationContext();
    }
    
    public String initialize(String id) {
        Log.i("[CLARITY].initialize", id);

        // Your custom code here
        ClarityConfig config = new ClarityConfig(
          id,
          null,                                             // Default user id
          LogLevel.None,
          false,                                            // Disallow metered network usage
          true,                                             // Enable web view capturing
          Collections.singletonList("*"),                   // Allowed domains
          ApplicationFramework.Native,
          Collections.emptyList(),                          // Allowed activities
          Collections.emptyList(),                          // Disallowed activities (ignore activities)
          false,                                            // Disable on low-end devices
          null                                              // Maximum allowed daily network usage in MB (null = unlimited)
        );

        Clarity.initialize(this.context, config);

        return id;
    }

    public void handleOnResume() {
        Clarity.resume();

    }
    
    public void handleOnPause() {
        Clarity.pause();

    }
    
    public String setCurrentScreenName(String id) {
        Log.i("[CLARITY].setCurrentScreenName", id);
        Clarity.setCurrentScreenName(id);
        return id;
    }
    
    public String echo(String value) {
        Log.i("[CLARITY].echo", value);
        return value;
    }
}
