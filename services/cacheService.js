// Simple in-memory cache service for CV analysis results
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum number of cached items
    this.ttl = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Generate cache key from CV data
  generateKey(cvText, uri) {
    // Create a simple hash from CV text and URI
    const combined = `${cvText.substring(0, 100)}_${uri}`;
    return btoa(combined).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Get cached result
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Set cached result
  set(key, data) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
      timestamp: Date.now()
    });
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }

  // Remove expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Cleanup expired items every hour
setInterval(() => {
  cacheService.cleanup();
}, 60 * 60 * 1000);
