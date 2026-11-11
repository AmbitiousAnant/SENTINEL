"""
SENTINEL V4 — Automated Test Suite & Research Pipeline Verification
Build for Bharat 2026 · Track 1: Software · PS 1 & PS 3
"""

import sys
import os
import unittest

# Ensure api directory is on sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "api"))

from models.isolation_forest import IsolationForestModel, get_trained_studentlife_model
from models.crisis_router import get_crisis_router, CrisisRouter
from models.conformal_predictor import SplitConformalPredictor
from models.biaffect_engine import BiAffectEngine, KeystrokeSession
from models.soap_synthesizer import SoapSynthesizer
from models.gemma_mindguard import GemmaMindGuard
from models.studentlife_benchmark import StudentLifeBenchmark, SYNTHETIC_EMA_CASES_24


class TestSentinelPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.if_model = get_trained_studentlife_model()
        cls.router = get_crisis_router()
        cls.cp = SplitConformalPredictor(alpha=0.10)
        cls.biaffect = BiAffectEngine()
        cls.gemma = GemmaMindGuard()

    def test_01_isolation_forest_normal(self):
        """Verify normal student telemetry predicts Low risk (< 40)."""
        normal_point = [0.0, 0.0, 0.0, 0.0, 0.0]
        res = self.if_model.predict_distress(normal_point)
        self.assertLess(res["distress_score"], 40.0)
        self.assertEqual(res["risk_band"], "Low")

    def test_02_isolation_forest_anomaly(self):
        """Verify severe circadian drift and micro-unlocks predict High risk (>= 75)."""
        acute_point = [3.8, 3.5, 4.2, 2.9, 3.9]
        res = self.if_model.predict_distress(acute_point)
        self.assertGreaterEqual(res["distress_score"], 75.0)
        self.assertEqual(res["risk_band"], "High")

    def test_03_crisis_router_safe_negation(self):
        """Verify explicit self-harm negation does NOT trigger acute crisis."""
        negation_text = "I'm feeling stressed about exams, but I don't want to die."
        res = self.router.route(negation_text)
        self.assertFalse(res.is_acute)
        self.assertTrue(res.negation_detected)
        self.assertEqual(res.mindguard_class, "Safe")
        self.assertLess(res.latency_ms, 5.0)  # SLA < 5ms

    def test_04_crisis_router_acute_crisis(self):
        """Verify Hinglish and English acute crisis phrases lock into Tier 3."""
        acute_phrases = [
            "sab khatam karna hai tonight, cannot take it anymore",
            "ab aur nahi sah sakta, want to end tonight",
            "vaazhkai mudikkanum, vali thaanga mudiyala"
        ]
        for phrase in acute_phrases:
            res = self.router.route(phrase)
            self.assertTrue(res.is_acute, f"Failed on acute phrase: {phrase}")
            self.assertEqual(res.mindguard_class, "Self-Harm / Imminent Threat")
            self.assertLess(res.latency_ms, 5.0)

    def test_05_conformal_coverage(self):
        """Verify split-conformal 90% quantile is valid."""
        res = self.cp.predict_interval(50.0)
        self.assertAlmostEqual(res.quantile_q, 7.50, delta=0.1)
        self.assertAlmostEqual(res.confidence_level, 0.90, delta=0.01)
        self.assertLessEqual(res.lower_bound, 50.0)
        self.assertGreaterEqual(res.upper_bound, 50.0)

    def test_06_biaffect_keystroke_analyzer(self):
        """Verify psychomotor flight retardation detection on sluggish typing."""
        session = KeystrokeSession(
            interkey_latencies_ms=[240, 260, 230, 250, 280],
            total_keystrokes=50,
            backspace_count=12
        )
        res = self.biaffect.process_keystrokes(session)
        self.assertTrue(res["is_psychomotor_retarded"])
        self.assertTrue(res["is_cognitive_ruminating"])
        self.assertGreaterEqual(res["cognitive_hesitation_score"], 70.0)

    def test_07_soap_synthesizer_dialects(self):
        """Verify SOAP-Lite generation across all 4 regional dialects."""
        for dialect in ["Casual Hinglish", "Formal Hindi", "Tamil", "English"]:
            card = SoapSynthesizer.synthesize(
                score=62.0,
                tier=2,
                factors=["Circadian sleep drift"],
                guidance="Paced rest blocks",
                dialect=dialect
            )
            self.assertTrue(len(card.subjective) > 5)
            self.assertTrue(len(card.objective) > 5)
            self.assertTrue(len(card.assessment) > 5)
            self.assertTrue(len(card.plan) > 5)
            self.assertIn("14416", card.whatsapp_dispatch)

    def test_08_disagreement_gate(self):
        """Verify Disagreement Gate flags LOW_CONFIDENCE when IF and Z-score diverge."""
        # s_IF = 90.0, s_z = 20.0 -> delta = 70.0 > tau (28.0)
        res = StudentLifeBenchmark.fuse_and_smooth(
            raw_message_score=50.0,
            if_score=90.0,
            z_score=20.0,
            previous_smoothed=20.0,
            tau=28.0
        )
        self.assertTrue(res["disagreement_gate_triggered"])
        self.assertIn("LOW_CONFIDENCE", res["confidence_status"])


if __name__ == "__main__":
    unittest.main()
