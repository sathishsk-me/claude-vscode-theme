/**
 * Sample JavaScript file for VS Code theme preview.
 * Demonstrates modern ES2022+ syntax and patterns.
 */

"use strict";

// ─── Constants & Variables ───────────────────────────────────────
const API_BASE_URL = "https://api.example.com/v2";
const MAX_TIMEOUT = 5000;
let requestCount = 0;

// ─── Symbols and WeakMaps ────────────────────────────────────────
const _private = Symbol("private");
const cache = new WeakMap();

// ─── Class with private fields ───────────────────────────────────
class EventEmitter {
  #listeners = new Map();
  #maxListeners = 10;

  constructor(options = {}) {
    this.name = options.name ?? "default";
    this.#maxListeners = options.maxListeners ?? 10;
  }

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    const listeners = this.#listeners.get(event);
    if (listeners.length >= this.#maxListeners) {
      console.warn(`Max listeners (${this.#maxListeners}) reached for "${event}"`);
    }
    listeners.push(callback);
    return this; // chainable
  }

  emit(event, ...args) {
    const listeners = this.#listeners.get(event) ?? [];
    for (const listener of listeners) {
      listener.apply(this, args);
    }
    return listeners.length > 0;
  }

  off(event, callback) {
    const listeners = this.#listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
    return this;
  }

  get listenerCount() {
    let total = 0;
    for (const [, listeners] of this.#listeners) {
      total += listeners.length;
    }
    return total;
  }
}

// ─── Async/Await & Fetch ─────────────────────────────────────────
async function fetchData(endpoint, options = {}) {
  const { retries = 3, delay = 1000 } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      requestCount++;
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": crypto.randomUUID(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data, attempt };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ─── Generators & Iterators ─────────────────────────────────────
function* fibonacci(limit = Infinity) {
  let [a, b] = [0, 1];
  let count = 0;
  while (count < limit) {
    yield a;
    [a, b] = [b, a + b];
    count++;
  }
}

// ─── Proxy & Reflect ─────────────────────────────────────────────
function createReactiveObject(target, onChange) {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      return typeof value === "object" && value !== null
        ? createReactiveObject(value, onChange)
        : value;
    },
    set(obj, prop, value, receiver) {
      const oldValue = obj[prop];
      const result = Reflect.set(obj, prop, value, receiver);
      if (oldValue !== value) {
        onChange(prop, value, oldValue);
      }
      return result;
    },
  });
}

// ─── Template Literals & Tagged Templates ────────────────────────
function sql(strings, ...values) {
  const query = strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? `$${i + 1}` : "");
  }, "");
  return { query, values };
}

const tableName = "users";
const minAge = 18;
const statement = sql`SELECT * FROM ${tableName} WHERE age >= ${minAge}`;

// ─── Destructuring & Spread ──────────────────────────────────────
const config = {
  database: {
    host: "localhost",
    port: 5432,
    credentials: { username: "admin", password: "secret" },
  },
  features: ["auth", "logging", "cache"],
  debug: false,
};

const {
  database: {
    host,
    port,
    credentials: { username, ...restCredentials },
  },
  features: [primaryFeature, ...otherFeatures],
  debug = false,
} = config;

// ─── Array methods & Chaining ────────────────────────────────────
const users = [
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob", age: 25, role: "user" },
  { name: "Charlie", age: 35, role: "admin" },
  { name: "Diana", age: 28, role: "user" },
];

const adminEmails = users
  .filter(({ role }) => role === "admin")
  .map(({ name }) => `${name.toLowerCase()}@example.com`)
  .sort();

// ─── Regular Expressions ─────────────────────────────────────────
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

function validateEmail(email) {
  return emailRegex.test(email);
}

// ─── Optional Chaining & Nullish Coalescing ──────────────────────
function getUserDisplayName(user) {
  const displayName = user?.profile?.displayName ?? user?.name ?? "Anonymous";
  const avatar = user?.profile?.avatar?.url;
  const badges = user?.achievements?.badges?.length ?? 0;

  return { displayName, avatar, badges };
}

// ─── Promise combinators ─────────────────────────────────────────
async function loadDashboard(userId) {
  const [profile, settings, notifications] = await Promise.allSettled([
    fetchData(`/users/${userId}/profile`),
    fetchData(`/users/${userId}/settings`),
    fetchData(`/users/${userId}/notifications`),
  ]);

  return {
    profile: profile.status === "fulfilled" ? profile.value : null,
    settings: settings.status === "fulfilled" ? settings.value : null,
    notifications: notifications.status === "fulfilled" ? notifications.value : [],
  };
}

// ─── Module exports ──────────────────────────────────────────────
export { EventEmitter, fetchData, fibonacci, createReactiveObject };
export default { validateEmail, loadDashboard, getUserDisplayName };
