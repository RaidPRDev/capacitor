package com.sweetrush.staging.elso;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle; // required for onCreate parameter
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
        ClarityConfig config = new ClarityConfig("oztc10g5eg");

        Clarity.initialize(getApplicationContext(), config);
    }
}
