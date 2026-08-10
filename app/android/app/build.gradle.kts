import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

// Release signing config loaded from android/key.properties (git-ignored).
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "my.cakna"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion
    // Page fonts ship via Play Asset Delivery (install-time), not the base APK.
    assetPacks += listOf(":pagefontpack")

    compileOptions {
        isCoreLibraryDesugaringEnabled = true // required by flutter_local_notifications
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "my.cakna"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
                storeFile = file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["storePassword"] as String
            }
        }
    }

    buildTypes {
        release {
            // Use the release keystore when present, else fall back to debug keys
            // so `flutter run --release` still works without key.properties.
            signingConfig = if (keystorePropertiesFile.exists())
                signingConfigs.getByName("release")
            else
                signingConfigs.getByName("debug")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }
}

flutter {
    source = "../.."
}

// After Flutter merges its assets, remove page_fonts from the base APK.
// They are served by the pagefontpack PAD module instead, so keeping them
// in the base would double the download and hit the 150 MB limit.
// Strip page_fonts from the base APK only in release builds.
// Debug builds keep them bundled so the PAD fallback path (flutter_assets/...)
// in MainActivity works without a Play Store install.
afterEvaluate {
    androidComponents.onVariants { variant ->
        if (!variant.name.contains("release", ignoreCase = true)) return@onVariants
        val capitalized = variant.name.replaceFirstChar { it.uppercase() }
        tasks.matching { t -> t.name == "merge${capitalized}Assets" }.configureEach {
            doLast {
                val out = file("$buildDir/intermediates/assets/${variant.name}/out")
                delete(fileTree(out) { include("flutter_assets/assets/page_fonts/**") })
            }
        }
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
