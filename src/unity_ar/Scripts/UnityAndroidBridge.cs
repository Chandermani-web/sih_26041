using System;
using UnityEngine;

namespace ARSafe.Jharkhand.UnityAR
{
    [Serializable]
    public class UnityARTestResultPayload
    {
        public string workerId;
        public string moduleId;
        public int totalScore;
        public bool isPassed;
        public float durationSeconds;
        public string completionTimestamp;
    }

    /// <summary>
    /// Bidirectional communication bridge between native Android (Kotlin / Java)
    /// and the Unity AR Foundation emergency simulation module.
    /// Official Reference: Unity as a Library (UaaL) for Android.
    /// </summary>
    public class UnityAndroidBridge : MonoBehaviour
    {
        [SerializeField] private ScenarioStateMachine stateMachine;
        [SerializeField] private UnityScoringEngine scoringEngine;

        public static UnityAndroidBridge Instance { get; private set; }

        private string currentWorkerId = "JH-W-001";
        private string currentModuleId = "fire-explosion";

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        /// <summary>
        /// Called from Android Kotlin via UnitySendMessage("AndroidBridge", "StartScenarioWithWorker", jsonPayload)
        /// </summary>
        public void StartScenarioWithWorker(string jsonPayload)
        {
            try
            {
                var data = JsonUtility.FromJson<UnityARTestResultPayload>(jsonPayload);
                if (data != null)
                {
                    currentWorkerId = data.workerId;
                    currentModuleId = data.moduleId;
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning("Failed to parse start parameters: " + ex.Message);
            }
        }

        /// <summary>
        /// Notifies the Android host when the worker finishes the practical AR test.
        /// Sends JSON result back to the native Android activity.
        /// </summary>
        public void SendResultToAndroid(int finalScore, bool passed, float duration)
        {
            var result = new UnityARTestResultPayload
            {
                workerId = currentWorkerId,
                moduleId = currentModuleId,
                totalScore = finalScore,
                isPassed = passed,
                durationSeconds = duration,
                completionTimestamp = DateTime.UtcNow.ToString("o")
            };

            string json = JsonUtility.ToJson(result);

#if UNITY_ANDROID && !UNITY_EDITOR
            using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
            {
                AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                currentActivity.Call("onUnityARTestCompleted", json);
            }
#else
            Debug.Log("[UnityAndroidBridge] Scenario result payload sent to Android: " + json);
#endif
        }
    }
}
