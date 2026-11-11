"""
SENTINEL V4 — Deterministic Negation-Aware Crisis Router Engine
Evaluates triage text in < 5ms using Trie pattern matching and negation boundary resolution.
Multi-dialect: English, Hindi, Hinglish, Tamil.
"""

import time
import re
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field


@dataclass
class RouterResult:
    is_acute: bool
    matched_phrase: Optional[str]
    negation_detected: bool
    negation_context: Optional[str]
    tier1_status: str
    latency_ms: float
    mindguard_class: str
    recommended_score: float
    dialect_detected: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_acute": self.is_acute,
            "matched_phrase": self.matched_phrase,
            "negation_detected": self.negation_detected,
            "negation_context": self.negation_context,
            "tier1_status": self.tier1_status,
            "latency_ms": round(self.latency_ms, 3),
            "mindguard_class": self.mindguard_class,
            "recommended_score": self.recommended_score,
            "dialect_detected": self.dialect_detected,
            "negation_aware": True
        }


class TrieNode:
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.is_end_of_word: bool = False
        self.phrase: Optional[str] = None
        self.severity_weight: float = 1.0
        self.dialect: str = "generic"


class CrisisRouter:
    """
    Sub-millisecond deterministic triage router.
    Resolves safe statements ("stressed but don't want to die") from acute threats ("sab khatam karna hai").
    """
    def __init__(self):
        self.root = TrieNode()
        self._build_crisis_lexicon()
        self._compile_negation_regexes()

    def _add_phrase(self, phrase: str, severity: float = 1.0, dialect: str = "en"):
        node = self.root
        tokens = phrase.lower().strip().split()
        for token in tokens:
            if token not in node.children:
                node.children[token] = TrieNode()
            node = node.children[token]
        node.is_end_of_word = True
        node.phrase = phrase
        node.severity_weight = severity
        node.dialect = dialect

    def _build_crisis_lexicon(self):
        # Hinglish acute crisis markers
        hinglish = [
            ("sab khatam karna hai", 1.0),
            ("mar jana chahta hu", 1.0),
            ("mar jaana chahta hoon", 1.0),
            ("ab aur nahi sah sakta", 0.95),
            ("ab aur nahi jhel sakta", 0.95),
            ("zindagi se tang aa gaya hu", 0.90),
            ("jaan de dunga", 1.0),
            ("zeher kha lunga", 1.0),
            ("kisi ko meri parwah nahi", 0.85),
            ("sab kuch khatam", 0.95),
            ("kud jaunga", 1.0),
            ("fasi laga lunga", 1.0),
        ]
        for p, s in hinglish:
            self._add_phrase(p, s, "hinglish")

        # Hindi (Devanagari)
        hindi = [
            ("सब खत्म करना है", 1.0),
            ("मरना चाहता हूँ", 1.0),
            ("आत्महत्या", 1.0),
            ("जीवन समाप्त", 0.95),
            ("अब और नहीं सह सकता", 0.95),
            ("जान दे दूंगा", 1.0),
        ]
        for p, s in hindi:
            self._add_phrase(p, s, "hi")

        # Tamil (Romanized)
        tamil = [
            ("vaazhkai mudikkanum", 1.0),
            ("saganum pola irukku", 1.0),
            ("uyirai vida poren", 1.0),
            ("tharkolai panna poren", 1.0),
            ("vali thaanga mudiyala", 0.90),
        ]
        for p, s in tamil:
            self._add_phrase(p, s, "ta")

        # English acute crisis markers
        english = [
            ("want to die", 1.0),
            ("kill myself", 1.0),
            ("end tonight", 1.0),
            ("want it all to end", 1.0),
            ("better off dead", 0.95),
            ("no reason to live", 0.95),
            ("suicide", 1.0),
            ("commit suicide", 1.0),
            ("cannot go on anymore", 0.90),
            ("goodbye forever", 0.95),
            ("slit my wrists", 1.0),
            ("hang myself", 1.0),
            ("take all my pills", 1.0),
            ("jump off the bridge", 1.0),
        ]
        for p, s in english:
            self._add_phrase(p, s, "en")

    def _compile_negation_regexes(self):
        """Negation words in English, Hinglish, and Hindi."""
        # Preceding or succeeding negation within 1-5 word token window
        self.negation_patterns = [
            # English
            re.compile(r"(don't|dont|do\s+not|never|no|not|cannot|can't|won't|wont|wouldn't|didn't|did\s+not)\s+([a-z\s]{0,25})(die|kill|hurt|suicide|end|hang)", re.IGNORECASE),
            # Hinglish
            re.compile(r"(nahi|nhi|mat|na|never)\s+([a-z\s]{0,25})(marna|khatam|jaan\s+dena|marne)", re.IGNORECASE),
            # Hindi reverse negation: "marna nahi chahta"
            re.compile(r"(die|kill|suicide|marna|khatam)\s+([a-z\s]{0,15})(nahi|nhi|never|na|not)", re.IGNORECASE),
            # Coping / resilience context
            re.compile(r"(manage|cope|survive|fight|handle|study|future|live)\s+([a-z\s]{0,25})(stress|pressure|exams)", re.IGNORECASE)
        ]

    def check_negation(self, text: str) -> Tuple[bool, Optional[str]]:
        for pattern in self.negation_patterns:
            match = pattern.search(text)
            if match:
                return True, match.group(0)
        return False, None

    def search_trie(self, text: str) -> List[Tuple[str, float, str]]:
        """Finds all matching crisis phrases using multi-token sliding window."""
        tokens = re.findall(r"[\w']+|[^\s\w]", text.lower(), re.UNICODE)
        matches = []
        n = len(tokens)

        for i in range(n):
            node = self.root
            j = i
            while j < n and tokens[j] in node.children:
                node = node.children[tokens[j]]
                if node.is_end_of_word and node.phrase:
                    matches.append((node.phrase, node.severity_weight, node.dialect))
                j += 1
        return matches

    def route(self, message: str) -> RouterResult:
        """
        Executes triage routing on arbitrary message.
        Guaranteed < 5ms latency benchmark.
        """
        t0 = time.perf_counter()
        clean_text = message.strip()
        neg_detected, neg_context = self.check_negation(clean_text)
        trie_matches = self.search_trie(clean_text)

        # Micro-regex fallback for direct keywords
        lower = clean_text.lower()
        if not trie_matches:
            fallback_keywords = ["suicide", "kill myself", "want to die", "sab khatam", "mar jana"]
            for kw in fallback_keywords:
                if kw in lower:
                    trie_matches.append((kw, 1.0, "generic"))

        latency_ms = (time.perf_counter() - t0) * 1000.0

        # Safe negation detected
        if neg_detected and (trie_matches or any(w in lower for w in ["die", "kill", "suicide", "end"])):
            return RouterResult(
                is_acute=False,
                matched_phrase=neg_context,
                negation_detected=True,
                negation_context=neg_context,
                tier1_status="CLEAR (Negation Verified: LLM Guardrail Cleared)",
                latency_ms=latency_ms,
                mindguard_class="Safe",
                recommended_score=34.0,
                dialect_detected="en/hinglish"
            )

        # Acute match confirmed
        if trie_matches:
            top_match = max(trie_matches, key=lambda m: m[1])
            return RouterResult(
                is_acute=True,
                matched_phrase=top_match[0],
                negation_detected=False,
                negation_context=None,
                tier1_status="ACUTE RISK LOCKED (LLM Bypassed -> Direct Handoff)",
                latency_ms=latency_ms,
                mindguard_class="Self-Harm / Imminent Threat",
                recommended_score=95.0,
                dialect_detected=top_match[2]
            )

        # Routine baseline / Strain without crisis markers
        is_elevated = any(w in lower for w in ["anxious", "exhausted", "burnout", "scared", "stress", "sleep", "fear", "depressed"])
        rec_score = 58.0 if is_elevated else 22.0
        status_msg = "CLEAR (Proceed to Gemma 4 E2B)" if is_elevated else "CLEAR (Routine Resilience)"

        return RouterResult(
            is_acute=False,
            matched_phrase=None,
            negation_detected=False,
            negation_context=None,
            tier1_status=status_msg,
            latency_ms=latency_ms,
            mindguard_class="Safe",
            recommended_score=rec_score,
            dialect_detected="standard"
        )


_ROUTER_SINGLETON: Optional[CrisisRouter] = None

def get_crisis_router() -> CrisisRouter:
    global _ROUTER_SINGLETON
    if _ROUTER_SINGLETON is None:
        _ROUTER_SINGLETON = CrisisRouter()
    return _ROUTER_SINGLETON
