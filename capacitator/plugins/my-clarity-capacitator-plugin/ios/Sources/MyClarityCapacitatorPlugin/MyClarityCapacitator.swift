import Foundation
import Clarity

@objc public class MyClarityCapacitator: NSObject {
    
    private let plugin: MyClarityCapacitatorPlugin

    init(plugin: MyClarityCapacitatorPlugin) {
        self.plugin = plugin
        super.init()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.onResume), name: UIApplication.willEnterForegroundNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.onPause), name: UIApplication.willResignActiveNotification, object: nil)
    }

    @objc public func initialize(_ id: String) -> String {
        // Note: Set ".verbose" value for "logLevel" parameter while testing to debug initialization issues.
        let clarityConfig = ClarityConfig(projectId: id)
        ClaritySDK.initialize(config: clarityConfig)

        return id
    }
    
    @objc public func setCurrentScreenName(_ id: String!) -> String {
        ClaritySDK.setCurrentScreenName(id);

        return id
    }

    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }

    @objc public func onResume() {
        ClaritySDK.resume()
    }

    @objc public func onPause() {
        ClaritySDK.pause()
    }
}
