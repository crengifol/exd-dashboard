from pydantic import BaseSettings, Field
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql://localhost/exd_control", env="DATABASE_URL")
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    CORS_ORIGINS: str = Field(default="http://localhost:5173,http://localhost:3000", env="CORS_ORIGINS")

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()
