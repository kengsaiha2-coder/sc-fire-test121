// Base APK Configuration (Flutter / Dart)
class AppConfig {
  static const String appName = "ApkBug Pro Controller";
  static const String serverHost = "https://sc-fire-test-4hk1.onrender.com";
  static const String secretAuthKey = "SEC_AUTH_KEY_99X";

  static String get pingEndpoint => "$serverHost/api/ping";
  static String get statusEndpoint => "$serverHost/api/status";
  static String get executeEndpoint => "$serverHost/api/execute";

  static Map<String, String> get authHeaders => {
    "Content-Type": "application/json",
    "Authorization": "Bearer $secretAuthKey",
    "X-Client-App": appName,
  };
}