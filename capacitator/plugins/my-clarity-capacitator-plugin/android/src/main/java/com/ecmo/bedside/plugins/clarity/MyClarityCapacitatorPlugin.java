package com.sweetrush.staging.elso.plugins.clarity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MyClarityCapacitator")
public class MyClarityCapacitatorPlugin extends Plugin {

    private MyClarityCapacitator implementation;

    @Override
    public void load() {
        implementation = new MyClarityCapacitator(getContext());
    }

    @Override
    public void handleOnPause() {
        super.handleOnPause();
        implementation.handleOnPause();
    }

    @Override
    public void handleOnResume() {
        super.handleOnResume();
        implementation.handleOnResume();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        String id = call.getString("id");
        
        JSObject ret = new JSObject();
        ret.put("id", implementation.initialize(id));
        call.resolve(ret);
    }
    
    @PluginMethod
    public void setCurrentScreenName(PluginCall call) {
        String id = call.getString("id");
        
        JSObject ret = new JSObject();
        ret.put("id", implementation.setCurrentScreenName(id));
        call.resolve(ret);
    }

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }
}
