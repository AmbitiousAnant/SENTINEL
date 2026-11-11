from setuptools import setup, find_packages

setup(
    name="sentinel-ai",
    version="4.0.0",
    description="Offline Zero-Daemon Mental Health & Statutory Crisis Triage Platform",
    author="Sentinel AI Research Team",
    packages=find_packages(),
    py_modules=["run_models", "test_pipeline", "app"],
    install_requires=[
        "fastapi>=0.115.0",
        "uvicorn>=0.30.0",
        "pydantic>=2.8.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
    ],
    python_requires=">=3.10",
)
