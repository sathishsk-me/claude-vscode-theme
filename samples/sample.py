#!/usr/bin/env python3
"""
Sample Python file for VS Code theme preview.
Demonstrates modern Python 3.12+ syntax and patterns.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from abc import ABC, abstractmethod
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum, auto
from functools import lru_cache, wraps
from pathlib import Path
from typing import (
    Any,
    Callable,
    Generator,
    Generic,
    Iterator,
    Literal,
    NamedTuple,
    Protocol,
    TypeVar,
    override,
)

# ─── Constants ────────────────────────────────────────────────────
MAX_RETRIES: int = 3
DEFAULT_TIMEOUT: float = 30.0
API_BASE_URL: str = "https://api.example.com/v2"
VALID_ROLES: set[str] = {"admin", "user", "moderator", "guest"}

# ─── Logging setup ───────────────────────────────────────────────
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# ─── Type Variables ───────────────────────────────────────────────
T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


# ─── Enums ────────────────────────────────────────────────────────
class Status(Enum):
    """Task status enumeration."""

    PENDING = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    FAILED = auto()
    CANCELLED = auto()

    @property
    def is_terminal(self) -> bool:
        return self in {Status.COMPLETED, Status.FAILED, Status.CANCELLED}

    def __str__(self) -> str:
        return self.name.replace("_", " ").title()


class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


# ─── Protocols & ABCs ────────────────────────────────────────────
class Serializable(Protocol):
    """Protocol for objects that can be serialized to dict."""

    def to_dict(self) -> dict[str, Any]: ...


class Repository(ABC, Generic[T]):
    """Abstract base class for data repositories."""

    @abstractmethod
    async def find_by_id(self, id: str) -> T | None:
        """Find an entity by its ID."""
        ...

    @abstractmethod
    async def find_all(self, **filters: Any) -> list[T]:
        """Find all entities matching filters."""
        ...

    @abstractmethod
    async def save(self, entity: T) -> T:
        """Save an entity."""
        ...

    @abstractmethod
    async def delete(self, id: str) -> bool:
        """Delete an entity by ID."""
        ...


# ─── Named Tuples ────────────────────────────────────────────────
class Coordinate(NamedTuple):
    latitude: float
    longitude: float
    altitude: float = 0.0

    def distance_to(self, other: Coordinate) -> float:
        """Calculate approximate distance in km using Haversine."""
        from math import asin, cos, radians, sin, sqrt

        lat1, lon1 = radians(self.latitude), radians(self.longitude)
        lat2, lon2 = radians(other.latitude), radians(other.longitude)
        dlat, dlon = lat2 - lat1, lon2 - lon1

        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        return 6371 * 2 * asin(sqrt(a))


# ─── Dataclasses ──────────────────────────────────────────────────
@dataclass(frozen=True, slots=True)
class User:
    """Immutable user entity."""

    id: str
    name: str
    email: str
    role: Literal["admin", "user", "moderator", "guest"] = "user"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    tags: frozenset[str] = field(default_factory=frozenset)

    def __post_init__(self) -> None:
        if self.role not in VALID_ROLES:
            raise ValueError(f"Invalid role: {self.role!r}")
        if not re.match(r"^[\w.+-]+@[\w-]+\.[\w.]+$", self.email):
            raise ValueError(f"Invalid email: {self.email!r}")

    @property
    def display_name(self) -> str:
        return f"{self.name} ({self.role})"

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
            "tags": sorted(self.tags),
        }


@dataclass
class TaskResult(Generic[T]):
    """Generic result wrapper with success/error states."""

    success: bool
    data: T | None = None
    error: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def ok(cls, data: T, **metadata: Any) -> TaskResult[T]:
        return cls(success=True, data=data, metadata=metadata)

    @classmethod
    def fail(cls, error: str, **metadata: Any) -> TaskResult[T]:
        return cls(success=False, error=error, metadata=metadata)

    def unwrap(self) -> T:
        if not self.success or self.data is None:
            raise RuntimeError(f"Cannot unwrap failed result: {self.error}")
        return self.data


# ─── Decorators ───────────────────────────────────────────────────
def retry(max_attempts: int = 3, delay: float = 1.0) -> Callable:
    """Decorator that retries a function on failure."""

    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exception: Exception | None = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as exc:
                    last_exception = exc
                    logger.warning(
                        "Attempt %d/%d failed for %s: %s",
                        attempt,
                        max_attempts,
                        func.__name__,
                        exc,
                    )
                    if attempt < max_attempts:
                        await asyncio.sleep(delay * attempt)

            raise RuntimeError(
                f"All {max_attempts} attempts failed"
            ) from last_exception

        return wrapper

    return decorator


def timer(func: Callable) -> Callable:
    """Decorator to measure function execution time."""

    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        import time

        start = time.perf_counter()
        result = await func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        logger.info("%s executed in %.3fs", func.__name__, elapsed)
        return result

    return wrapper


# ─── Context Managers ─────────────────────────────────────────────
class DatabaseConnection:
    """Async context manager for database connections."""

    def __init__(self, connection_string: str) -> None:
        self.connection_string = connection_string
        self._connected = False

    async def __aenter__(self) -> DatabaseConnection:
        logger.info("Connecting to %s", self.connection_string)
        self._connected = True
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> bool:
        logger.info("Disconnecting from database")
        self._connected = False
        if exc_type is ConnectionError:
            logger.error("Connection error suppressed: %s", exc_val)
            return True  # Suppress the exception
        return False

    async def execute(self, query: str, params: tuple = ()) -> list[dict]:
        if not self._connected:
            raise ConnectionError("Not connected to database")
        logger.info("Executing: %s with params %s", query, params)
        return []


# ─── Generators & Iterators ──────────────────────────────────────
def fibonacci(limit: int = 100) -> Generator[int, None, None]:
    """Generate Fibonacci numbers up to a limit."""
    a, b = 0, 1
    while a <= limit:
        yield a
        a, b = b, a + b


def chunk_iterable(iterable: Iterator[T], size: int) -> Generator[list[T], None, None]:
    """Split an iterable into chunks of a given size."""
    chunk: list[T] = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk


# ─── Caching ──────────────────────────────────────────────────────
@lru_cache(maxsize=128)
def compute_factorial(n: int) -> int:
    """Compute factorial with memoization."""
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n <= 1:
        return 1
    return n * compute_factorial(n - 1)


# ─── Pattern Matching (Python 3.10+) ─────────────────────────────
def process_command(command: dict[str, Any]) -> str:
    """Process a command using structural pattern matching."""
    match command:
        case {"action": "create", "entity": str(entity), "data": dict(data)}:
            return f"Creating {entity} with {len(data)} fields"
        case {"action": "delete", "entity": str(entity), "id": str(id_)}:
            return f"Deleting {entity} with id={id_}"
        case {"action": "search", "query": str(query), "limit": int(limit)}:
            return f"Searching for '{query}' (limit={limit})"
        case {"action": "batch", "commands": [*commands]}:
            results = [process_command(cmd) for cmd in commands]
            return f"Batch: {'; '.join(results)}"
        case _:
            return f"Unknown command: {command}"


# ─── Async Operations ────────────────────────────────────────────
@retry(max_attempts=3, delay=0.5)
@timer
async def fetch_user_data(user_id: str) -> TaskResult[User]:
    """Fetch user data from the API."""
    logger.info("Fetching user %s", user_id)

    # Simulated API response
    user = User(
        id=user_id,
        name="Alice Johnson",
        email="alice@example.com",
        role="admin",
        tags=frozenset({"python", "developer"}),
    )
    return TaskResult.ok(user, source="api", cached=False)


async def process_users_concurrently(user_ids: list[str]) -> list[TaskResult[User]]:
    """Process multiple users concurrently with semaphore."""
    semaphore = asyncio.Semaphore(5)

    async def _fetch_with_semaphore(uid: str) -> TaskResult[User]:
        async with semaphore:
            return await fetch_user_data(uid)

    tasks = [_fetch_with_semaphore(uid) for uid in user_ids]
    return await asyncio.gather(*tasks)


# ─── Comprehensions & Functional Patterns ─────────────────────────
def analyze_users(users: list[User]) -> dict[str, Any]:
    """Demonstrate various comprehension patterns."""
    # Dict comprehension
    users_by_role: dict[str, list[User]] = defaultdict(list)
    for user in users:
        users_by_role[user.role].append(user)

    # Set comprehension
    all_tags: set[str] = {tag for user in users for tag in user.tags}

    # List comprehension with filtering
    admin_emails: list[str] = [
        user.email for user in users if user.role == "admin"
    ]

    # Nested comprehension
    tag_matrix: dict[str, list[str]] = {
        role: sorted({tag for u in role_users for tag in u.tags})
        for role, role_users in users_by_role.items()
    }

    return {
        "total": len(users),
        "by_role": {k: len(v) for k, v in users_by_role.items()},
        "all_tags": sorted(all_tags),
        "admin_emails": admin_emails,
        "tag_matrix": tag_matrix,
    }


# ─── Main Entry Point ────────────────────────────────────────────
async def main() -> None:
    """Main application entry point."""
    logger.info("Starting application...")

    # Pattern matching
    commands = [
        {"action": "create", "entity": "user", "data": {"name": "Bob"}},
        {"action": "search", "query": "python", "limit": 10},
        {"action": "delete", "entity": "post", "id": "abc-123"},
    ]
    for cmd in commands:
        result = process_command(cmd)
        logger.info("Command result: %s", result)

    # Fibonacci generator
    fib_numbers = list(fibonacci(50))
    logger.info("Fibonacci: %s", fib_numbers)

    # Factorial with caching
    for n in [5, 10, 15, 20]:
        logger.info("%d! = %d", n, compute_factorial(n))

    # Async database usage
    async with DatabaseConnection("postgresql://localhost/demo") as db:
        await db.execute("SELECT * FROM users WHERE role = %s", ("admin",))

    # Concurrent user processing
    user_ids = [f"user-{i:03d}" for i in range(1, 6)]
    results = await process_users_concurrently(user_ids)

    for result in results:
        if result.success:
            user = result.unwrap()
            logger.info("Fetched: %s", user.display_name)

    # Coordinate distance
    paris = Coordinate(48.8566, 2.3522)
    london = Coordinate(51.5074, -0.1278)
    logger.info("Paris → London: %.1f km", paris.distance_to(london))


if __name__ == "__main__":
    asyncio.run(main())
