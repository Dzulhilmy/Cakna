# Flutter
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.**

# flutter_local_notifications — uses Gson reflection for scheduled notifications
-keep class com.dexterous.** { *; }
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# just_audio / audio_session
-keep class com.ryanheise.** { *; }

# sqflite (no special rules needed, but keep to be safe)
-keep class com.tekartik.** { *; }
