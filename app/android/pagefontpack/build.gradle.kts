plugins {
    id("com.android.asset-pack")
}

// Install-time delivery: fonts are downloaded as part of the initial install,
// so they are available before the app first launches. This keeps the base APK
// lean (~91 MB saving) without any on-demand download UX.
assetPack {
    packName.set("pagefontpack")
    dynamicDelivery {
        deliveryType.set("install-time")
    }
}
