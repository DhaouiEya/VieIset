<?php
// Function to check if the device is iOS
function is_ios() {
    return preg_match('/iPhone|iPad|iPod/', $_SERVER['HTTP_USER_AGENT']);
}

// Function to check if the device is Android
function is_android() {
    return preg_match('/Android/', $_SERVER['HTTP_USER_AGENT']);
}

// URL for the website
$website_url = "https://gori-fit.com/";

// URLs for the iOS and Android apps
$ios_app_url = "https://apps.apple.com/tn/app/gorifit/id6736919733?l=fr-FR";
$android_app_url = "https://play.google.com/store/apps/details?id=com.gorifit.devlopy";

// Redirect based on the device
if (is_ios()) {
    header("Location: $ios_app_url");
    exit;
} elseif (is_android()) {
    header("Location: $android_app_url");
    exit;
} else {
    header("Location: $website_url");
    exit;
}
?>
