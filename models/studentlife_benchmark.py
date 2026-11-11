"""
SENTINEL V4 — Dartmouth StudentLife Academic Benchmark Harness
Contains empirical population priors, synthetic EMA stress-test cases,
and multi-modal sensor fusion algorithms.
"""

import math
from typing import List, Dict, Tuple, Any

STUDENTLIFE_48_BENCHMARK = {
    "circadian_rest_hours": {"mean": 6.64, "std": 1.28},
    "bedtime_drift_hours": {"mean": 0.35, "std": 1.12},
    "screen_unlocks_per_day": {"mean": 51.8, "std": 17.4},
    "nocturnal_micro_unlocks_hourly": {"mean": 0.85, "std": 0.72},
    "biaffect_interkey_ms": {"mean": 146.5, "std": 32.1},
    "biaffect_backspace_ratio": {"mean": 0.084, "std": 0.029}
}

SYNTHETIC_EMA_CASES_24 = [
    {"id": "case_01", "name": "Stable Collegiate Baseline", "features": [0.0, 0.1, 0.0, 0.0, 0.0], "ground_truth": "Safe", "true_score": 20.0},
    {"id": "case_02", "name": "Night-Owl STEM Student", "features": [0.5, 1.2, 0.8, 0.3, 0.2], "ground_truth": "Safe", "true_score": 32.0},
    {"id": "case_03", "name": "Midterm Exam Crunch", "features": [1.4, 1.8, 1.6, 0.9, 1.2], "ground_truth": "Elevated", "true_score": 58.0},
    {"id": "case_04", "name": "Severe Sleep Deprivation", "features": [2.8, 2.9, 3.2, 1.8, 2.1], "ground_truth": "Elevated", "true_score": 72.0},
    {"id": "case_05", "name": "Acute Panic & Despair", "features": [3.8, 3.5, 4.2, 2.9, 3.9], "ground_truth": "Critical", "true_score": 94.0},
    {"id": "case_06", "name": "Safe Negation (Exams)", "features": [1.2, 1.1, 1.0, 0.8, 0.7], "ground_truth": "Safe", "true_score": 34.0},
    {"id": "case_07", "name": "Protected Witness Fear", "features": [2.5, 2.2, 3.8, 2.1, 2.4], "ground_truth": "Elevated", "true_score": 68.0},
    {"id": "case_08", "name": "Shift Worker Day Sleep", "features": [-0.5, 2.5, 0.2, 0.1, 0.0], "ground_truth": "Safe", "true_score": 28.0},
]


class StudentLifeBenchmark:
    """Evaluates multi-modal sensor fusion across StudentLife population priors."""

    @staticmethod
    def fuse_and_smooth(
        raw_message_score: float,
        if_score: float,
        z_score: float,
        previous_smoothed: float = 20.0,
        tau: float = 28.0
    ) -> Dict[str, Any]:
        delta = abs(if_score - z_score)
        disagreement = delta > tau

        if disagreement:
            confidence = "LOW_CONFIDENCE (Disagreement Hold)"
            fused_raw = (0.5 * if_score) + (0.5 * z_score)
        else:
            confidence = "HIGH_CONFIDENCE (Multi-Modal Consensus)"
            fused_raw = (0.40 * raw_message_score) + (0.35 * if_score) + (0.25 * z_score)

        # Acute crisis bypasses dampening
        if raw_message_score >= 75.0:
            smoothed = max(raw_message_score, 85.0)
        else:
            smoothed = (0.70 * previous_smoothed) + (0.30 * fused_raw)

        return {
            "smoothed_score": round(smoothed, 1),
            "fused_raw_score": round(fused_raw, 1),
            "disagreement_delta": round(delta, 2),
            "disagreement_gate_triggered": disagreement,
            "confidence_status": confidence
        }
