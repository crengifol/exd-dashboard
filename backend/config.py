from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    DATABASE_URL: str = Field(default="postgresql://localhost/exd_control")
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    CORS_ORIGINS: str = Field(default="http://localhost:5173,http://localhost:3000")

    @property
    def cors_origins_list(self) -> List[str]:
        # In production, allow all origins (will be tightened later with proper env var)
        if self.ENVIRONMENT == "production":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()
