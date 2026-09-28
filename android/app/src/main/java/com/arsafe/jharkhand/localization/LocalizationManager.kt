package com.arsafe.jharkhand.localization

enum class SupportedLanguage(val code: String, val displayName: String) {
    ENGLISH("en", "English"),
    HINDI("hi", "हिन्दी"),
    SANTALI("sat", "ᱥᱟᱱᱛᱟᱲᱤ")
}

class LocalizationManager(private val context: android.content.Context) {

    fun setLocale(language: SupportedLanguage) {
        val locale = java.util.Locale(language.code)
        java.util.Locale.setDefault(locale)
        val config = context.resources.configuration
        config.setLocale(locale)
        context.createConfigurationContext(config)
    }
}
