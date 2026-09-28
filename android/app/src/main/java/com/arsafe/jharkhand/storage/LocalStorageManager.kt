package com.arsafe.jharkhand.storage

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "training_records")
data class TrainingRecordEntity(
    @PrimaryKey val sessionId: String,
    val workerId: String,
    val workerName: String,
    val moduleId: String,
    val score: Int,
    val isPassed: Boolean,
    val completedAt: Long,
    val certificateId: String?,
    val isSyncedWithBackend: Boolean = false
)

@Dao
interface TrainingRecordDao {
    @Query("SELECT * FROM training_records ORDER BY completedAt DESC")
    fun getAllRecords(): Flow<List<TrainingRecordEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: TrainingRecordEntity)

    @Query("SELECT * FROM training_records WHERE isSyncedWithBackend = 0")
    suspend fun getPendingSyncQueue(): List<TrainingRecordEntity>
}

@Database(entities = [TrainingRecordEntity::class], version = 1, exportSchema = false)
abstract class ARSafeDatabase : RoomDatabase() {
    abstract fun trainingRecordDao(): TrainingRecordDao

    companion object {
        @Volatile
        private var INSTANCE: ARSafeDatabase? = null

        fun getDatabase(context: Context): ARSafeDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ARSafeDatabase::class.java,
                    "arsafe_offline.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
