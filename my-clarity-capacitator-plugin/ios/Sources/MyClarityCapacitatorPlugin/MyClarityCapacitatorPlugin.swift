import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(MyClarityCapacitatorPlugin)
public class MyClarityCapacitatorPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "MyClarityCapacitatorPlugin"
    public let jsName = "MyClarityCapacitator"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setCurrentScreenName", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise)
    ]
    private var implementation: MyClarityCapacitator?

    override public func load() {
      self.implementation = MyClarityCapacitator(plugin: self)
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        let id = call.getString("id") ?? ""
        call.resolve([
            "id": implementation?.initialize(id) ?? ""
        ])
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation?.echo(value) ?? ""
        ])
    }
    
    @objc func setCurrentScreenName(_ call: CAPPluginCall) {
        let id = call.getString("id") ?? ""
        call.resolve([
            "id": implementation?.setCurrentScreenName(id) ?? ""
        ])
    }

    // @objc private func onPause() {
    //     implementation?.handleOnPause()
    // }
    
    // @objc private func onResume() {
    //     implementation?.handleOnResume()
    // }
}
