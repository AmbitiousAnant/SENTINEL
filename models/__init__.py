"""
SENTINEL V4 — Core Machine Learning & Edge AI Models
Package Root Exports for Hackathon Judges & Researchers
"""

import sys
import os

# Ensure api directory is on sys.path
api_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "api")
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from models.isolation_forest import IsolationTree, IsolationForest, get_trained_studentlife_model
from models.crisis_router import CrisisRouter, RouterResult, get_crisis_router
from models.conformal_predictor import SplitConformalPredictor, ConformalInterval
from models.biaffect_engine import BiAffectEngine, KeystrokeSession, KeystrokeMetrics
from models.gemma_mindguard import GemmaMindGuard, SymptomExtractionResult
from models.soap_synthesizer import SoapSynthesizer, SoapLiteCard
from models.studentlife_benchmark import StudentLifeBenchmark, SYNTHETIC_EMA_CASES_24

__all__ = [
    "IsolationTree",
    "IsolationForest",
    "get_trained_studentlife_model",
    "CrisisRouter",
    "RouterResult",
    "get_crisis_router",
    "SplitConformalPredictor",
    "ConformalInterval",
    "BiAffectEngine",
    "KeystrokeSession",
    "KeystrokeMetrics",
    "GemmaMindGuard",
    "SymptomExtractionResult",
    "SoapSynthesizer",
    "SoapLiteCard",
    "StudentLifeBenchmark",
    "SYNTHETIC_EMA_CASES_24",
]
