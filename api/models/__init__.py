"""
SENTINEL V4 — Python Machine Learning & Edge AI Models Package
Build for Bharat 2026 · Track 1: Software · PS 1 & PS 3

Modules:
- isolation_forest: Pure-Python multi-tree anomaly detection on passive telemetry.
- crisis_router: Negation-aware deterministic trie router (<2ms latency).
- conformal_predictor: Split-conformal prediction intervals (90.0% coverage).
- biaffect_engine: Psychomotor keystroke dynamics and cognitive rumination classifier.
- gemma_mindguard: Quantized clinical distillation & structured decoding.
- soap_synthesizer: Multi-dialect 4-Line SOAP-Lite clinical card synthesis.
- studentlife_benchmark: Dartmouth StudentLife (n=48) population benchmark harness.
- train_and_evaluate: Full training, cross-validation, and benchmarking suite.
"""

from .isolation_forest import IsolationForestModel, IsolationTree
from .crisis_router import CrisisRouter, RouterResult
from .conformal_predictor import SplitConformalPredictor, ConformalResult
from .biaffect_engine import BiAffectEngine, KeystrokeSession
from .gemma_mindguard import GemmaMindGuard, ClinicalAssessment
from .soap_synthesizer import SoapSynthesizer, SoapCard
from .studentlife_benchmark import StudentLifeBenchmark

__all__ = [
    "IsolationForestModel",
    "IsolationTree",
    "CrisisRouter",
    "RouterResult",
    "SplitConformalPredictor",
    "ConformalResult",
    "BiAffectEngine",
    "KeystrokeSession",
    "GemmaMindGuard",
    "ClinicalAssessment",
    "SoapSynthesizer",
    "SoapCard",
    "StudentLifeBenchmark",
]
