// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyClarityCapacitatorPlugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "MyClarityCapacitatorPlugin",
            targets: ["MyClarityCapacitatorPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "MyClarityCapacitatorPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/MyClarityCapacitatorPlugin"),
        .testTarget(
            name: "MyClarityCapacitatorPluginTests",
            dependencies: ["MyClarityCapacitatorPlugin"],
            path: "ios/Tests/MyClarityCapacitatorPluginTests")
    ]
)