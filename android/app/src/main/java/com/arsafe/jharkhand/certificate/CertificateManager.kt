package com.arsafe.jharkhand.certificate

import android.graphics.Bitmap
import android.graphics.Color
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter

data class DigitalCertificate(
    val certificateId: String,
    val workerId: String,
    val workerName: String,
    val moduleCode: String,
    val moduleTitle: String,
    val score: Int,
    val completionTimestamp: Long,
    val verificationUrl: String,
    val qrCodeBitmap: Bitmap? = null
)

class CertificateManager {

    companion object {
        fun generateDeterministicId(moduleId: String, sequenceNumber: Long = 1L): String {
            val pad = String.format("%06d", sequenceNumber)
            return if (moduleId == "fire-explosion") {
                "JH-FIRE-2026-$pad"
            } else {
                "JH-GAS-2026-$pad"
            }
        }

        fun getVerificationUrl(certificateId: String): String {
            return "https://example.com/verify/$certificateId"
        }

        fun generateQRCodeBitmap(url: String, size: Int = 300): Bitmap? {
            return try {
                val writer = QRCodeWriter()
                val bitMatrix = writer.encode(url, BarcodeFormat.QR_CODE, size, size)
                val width = bitMatrix.width
                val height = bitMatrix.height
                val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
                for (x in 0 until width) {
                    for (y in 0 until height) {
                        bmp.setPixel(x, y, if (bitMatrix.get(x, y)) Color.BLACK else Color.WHITE)
                    }
                }
                bmp
            } catch (e: Exception) {
                null
            }
        }
    }
}
