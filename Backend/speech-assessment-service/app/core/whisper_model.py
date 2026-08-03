import os
import logging
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

class WhisperModelSingleton:
    _instance = None
    _model = None

    @classmethod
    def get_instance(cls):
        if cls._model is None:
            model_size = os.getenv("WHISPER_MODEL_SIZE", "small")
            device = os.getenv("WHISPER_DEVICE", "cpu")
            compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
            
            logger.info(f"Loading Faster-Whisper model: {model_size} (device={device}, compute_type={compute_type})...")
            cls._model = WhisperModel(
                model_size_or_path=model_size,
                device=device,
                compute_type=compute_type
            )
            logger.info("Faster-Whisper model loaded successfully!")
        return cls._model
