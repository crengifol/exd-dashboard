from pydantic import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Read from environment variables first, then use defaults
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "postgresql://localhost/exd_control")
    ENVIRONMENT: str = os.environ.get("ENVIRONMENT", "development")
    DEBUG: bool = os.environ.get("DEBUG", "true").lower() == "true"
    CORS_ORIGINS: str = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()
